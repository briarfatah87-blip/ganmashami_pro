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

    if (!decoded || decoded.role !== 'admin') {
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
            avatar: true,
            createdAt: true
          }
        }
      }
    })

    const liveActivity = recentHistory.map((history: any) => ({
      id: history.id,
      user: {
        id: history.user.id,
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


    const recentGuests = await prisma.guestActivity.findMany({
      where: {
        updatedAt: { gte: thirtySecondsAgo },
        completed: false,
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    })

    const liveGuests = recentGuests.map((guest: any) => ({
      id: guest.id,
      user: {
        id: `guest-${guest.id}`,
        username: 'Guest',
        avatar: null,
        isGuest: true,
        ip: guest.ipAddress
      },
      content: {
        id: guest.contentId,
        type: guest.contentType,
        title: guest.contentTitle || 'Unknown Title',
        poster: guest.contentPoster || '',
        progress: guest.progress,
        duration: guest.duration,
        seasonNumber: guest.seasonNumber,
        episodeNumber: guest.episodeNumber,
        updatedAt: guest.updatedAt
      }
    }))

    const combinedActivity = [...liveActivity, ...liveGuests]
      .sort((a, b) => new Date(b.content.updatedAt).getTime() - new Date(a.content.updatedAt).getTime())
      .slice(0, 50)

    return NextResponse.json(combinedActivity)


  } catch (error) {
    console.error('Failed to fetch live watching activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
