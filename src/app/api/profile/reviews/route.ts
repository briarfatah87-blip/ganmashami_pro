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

        const reviews = await prisma.review.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' },
            // In a full system, you might also have a Content table to fetch the title/poster
            // For now, the user profile will handle looking up the content info if necessary,
            // or the frontend must use the Xtream API based on contentId.
        })

        return NextResponse.json(reviews, { status: 200 })
    } catch (error) {
        console.error('Profile reviews API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
