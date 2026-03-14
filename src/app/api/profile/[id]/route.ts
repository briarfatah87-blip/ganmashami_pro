import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('seven_stream_session')?.value
    const decoded = token ? verifyToken(token) : null

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            favorites: true,
            watchHistory: true,
            reviews: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      joinedAt: user.createdAt,
      stats: {
        favorites: user._count.favorites,
        watched: user._count.watchHistory,
        reviews: user._count.reviews,
      }
    })
  } catch (error) {
    console.error('Failed to fetch public profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
