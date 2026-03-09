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

        const watchLater = await prisma.watchLater.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(watchLater, { status: 200 })
    } catch (error) {
        console.error('Watch later API error:', error)
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

        const { contentId, contentType, contentTitle, contentPoster } = await request.json()

        if (!contentId || !contentType) {
            return NextResponse.json({ error: 'Missing content ID or type' }, { status: 400 })
        }

        const item = await prisma.watchLater.create({
            data: {
                userId: payload.userId,
                contentId: String(contentId),
                contentType: String(contentType),
                contentTitle: contentTitle ? String(contentTitle) : null,
                contentPoster: contentPoster ? String(contentPoster) : null
            }
        })

        return NextResponse.json(item, { status: 201 })
    } catch (error: any) {
        console.error('Watch later POST error:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Already in watch later' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const payload = verifyToken(token)
        if (!payload?.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const contentId = searchParams.get('contentId')
        const contentType = searchParams.get('contentType')

        if (!contentId || !contentType) {
            return NextResponse.json({ error: 'Missing content ID or type' }, { status: 400 })
        }

        await prisma.watchLater.deleteMany({
            where: {
                userId: payload.userId,
                contentId: String(contentId),
                contentType: String(contentType)
            }
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('Watch later DELETE error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
