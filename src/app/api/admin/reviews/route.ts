import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = await verifyToken(token)
        if (!payload || !payload.userId || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Fetch all reviews with user info
        const reviews = await prisma.review.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(reviews)
    } catch (error) {
        console.error('Error fetching admin reviews:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = await verifyToken(token)
        if (!payload || !payload.userId || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const reviewId = searchParams.get('id')

        if (!reviewId) {
            return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
        }

        await prisma.review.delete({
            where: { id: reviewId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting review:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
