import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// Force dynamic execution for live data
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('seven_stream_session')?.value
    const decoded = token ? verifyToken(token) : null

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Window = 30 seconds. Player saves every 10s, so user disappears
    // from this list within 10-30 seconds of closing the page.
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000)

    const recentHistory = await prisma.watchHistory.findMany({
      where: {
        updatedAt: {
          gte: thirtySecondsAgo,
        },
        // Show anyone watching (not yet completed - still in progress)
        completed: false,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    const liveActivity = recentHistory.map(history => ({
      id: history.id,
      user: {
        username: history.user.username,
        avatar: history.user.avatar
      },
      content: {
        id: history.contentId,
        type: history.contentType,
        title: history.contentTitle || 'Unknown Title',
        poster: history.contentPoster || '',
        progress: history.progress,
        duration: history.duration,
        seasonNumber: history.seasonNumber,
        episodeNumber: history.episodeNumber,
        updatedAt: history.updatedAt
      }
    }))

    return NextResponse.json(liveActivity)

  } catch (error) {
    console.error('Failed to fetch live watching activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
