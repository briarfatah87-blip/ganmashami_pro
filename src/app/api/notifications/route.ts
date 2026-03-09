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

        const notifications = await prisma.notification.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        })

        return NextResponse.json(notifications, { status: 200 })
    } catch (error) {
        console.error('Notifications GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const payload = verifyToken(token)
        if (!payload?.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const data = await request.json()
        const { notificationId, markAllRead } = data

        if (markAllRead) {
            await prisma.notification.updateMany({
                where: { userId: payload.userId, isRead: false },
                data: { isRead: true }
            })
            return NextResponse.json({ success: true })
        }

        if (notificationId) {
            const updated = await prisma.notification.update({
                where: {
                    id: notificationId,
                    userId: payload.userId // Ensure user owns the notification
                },
                data: { isRead: true }
            })
            return NextResponse.json(updated)
        }

        return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 })
    } catch (error) {
        console.error('Notifications PATCH error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Development helper to create system notifications
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const payload = verifyToken(token)
        if (!payload?.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        // Optional: Ensure only admins can create global notifications
        // For now, allow logged in user to test it for themselves

        const data = await request.json()
        const { title, message, type, link } = data

        const notification = await prisma.notification.create({
            data: {
                userId: payload.userId,
                title: title || 'System Update',
                message: message || 'This is a test notification',
                type: type || 'system',
                link: link || null
            }
        })

        return NextResponse.json(notification, { status: 201 })
    } catch (error) {
        console.error('Notifications POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
