import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = await verifyToken(token)
        if (!payload || !payload.userId || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { title, message, targetUserEmail } = await request.json()

        if (!title || !message) {
            return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
        }

        if (targetUserEmail) {
            // Send to specific user
            const targetUser = await prisma.user.findUnique({
                where: { email: targetUserEmail }
            })

            if (!targetUser) {
                return NextResponse.json({ error: 'User not found with that email' }, { status: 404 })
            }

            await prisma.notification.create({
                data: {
                    userId: targetUser.id,
                    title,
                    message,
                    type: 'system'
                }
            })

            return NextResponse.json({ success: true, message: 'Notification sent to user' })
        } else {
            // Broadcast to all users
            const users = await prisma.user.findMany({
                select: { id: true }
            })

            const notifications = users.map(user => ({
                userId: user.id,
                title,
                message,
                type: 'system'
            }))

            await prisma.notification.createMany({
                data: notifications
            })

            return NextResponse.json({ success: true, message: `Notification broadcasted to ${users.length} users` })
        }
    } catch (error) {
        console.error('Error broadcasting notification:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
