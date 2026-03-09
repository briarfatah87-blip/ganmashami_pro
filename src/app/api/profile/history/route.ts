import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value

        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const payload = verifyToken(token)
        if (!payload?.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const history = await prisma.watchHistory.findMany({
            where: { userId: payload.userId },
            orderBy: { updatedAt: 'desc' }
        })

        return NextResponse.json(history, { status: 200 })
    } catch (error) {
        console.error('Watch history API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const payload = verifyToken(token)
        if (!payload?.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const data = await request.json()
        const {
            contentId, contentType, contentTitle, contentPoster,
            episodeId, seasonNumber, episodeNumber,
            progress, duration, completed
        } = data

        if (!contentId || !contentType) {
            return NextResponse.json({ error: 'Missing content ID or type' }, { status: 400 })
        }

        // We use findFirst then update/create because composite unique key might be complex with optional episodeId
        let historyRecord = await prisma.watchHistory.findFirst({
            where: {
                userId: payload.userId,
                contentId: String(contentId),
                contentType: String(contentType),
                episodeId: episodeId ? String(episodeId) : null
            }
        })

        if (historyRecord) {
            historyRecord = await prisma.watchHistory.update({
                where: { id: historyRecord.id },
                data: {
                    progress: progress || historyRecord.progress,
                    duration: duration || historyRecord.duration,
                    completed: completed !== undefined ? completed : historyRecord.completed,
                    watchedAt: new Date()
                }
            })
        } else {
            historyRecord = await prisma.watchHistory.create({
                data: {
                    userId: payload.userId,
                    contentId: String(contentId),
                    contentType: String(contentType),
                    contentTitle: contentTitle ? String(contentTitle) : null,
                    contentPoster: contentPoster ? String(contentPoster) : null,
                    episodeId: episodeId ? String(episodeId) : null,
                    seasonNumber: seasonNumber ? Number(seasonNumber) : null,
                    episodeNumber: episodeNumber ? Number(episodeNumber) : null,
                    progress: progress || 0,
                    duration: duration || 0,
                    completed: completed || false
                }
            })
        }

        return NextResponse.json(historyRecord, { status: 200 })
    } catch (error) {
        console.error('Watch history POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
