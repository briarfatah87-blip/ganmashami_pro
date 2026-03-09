import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const contentId = searchParams.get('contentId')
        const contentType = searchParams.get('contentType')

        if (!contentId || !contentType) {
            return NextResponse.json({ error: 'Missing content ID or type' }, { status: 400 })
        }

        const reviews = await prisma.review.findMany({
            where: {
                contentId: String(contentId),
                contentType: String(contentType)
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(reviews, { status: 200 })
    } catch (error) {
        console.error('Reviews GET error:', error)
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

        const { contentId, contentType, contentTitle, contentPoster, rating, comment } = await request.json()

        if (!contentId || !contentType || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Search for existing review
        let review = await prisma.review.findFirst({
            where: {
                userId: payload.userId,
                contentId: String(contentId),
                contentType: String(contentType)
            }
        })

        if (review) {
            review = await prisma.review.update({
                where: { id: review.id },
                data: {
                    rating: Number(rating),
                    comment: comment ? String(comment) : null,
                    contentTitle: contentTitle ? String(contentTitle) : review.contentTitle,
                    contentPoster: contentPoster ? String(contentPoster) : review.contentPoster,
                    updatedAt: new Date()
                },
                include: { user: { select: { username: true, avatar: true } } } as any
            })
        } else {
            review = await prisma.review.create({
                data: {
                    userId: payload.userId,
                    contentId: String(contentId),
                    contentType: String(contentType),
                    contentTitle: contentTitle ? String(contentTitle) : null,
                    contentPoster: contentPoster ? String(contentPoster) : null,
                    rating: Number(rating),
                    comment: comment ? String(comment) : null
                },
                include: { user: { select: { username: true, avatar: true } } } as any
            })
        }

        return NextResponse.json(review, { status: 200 })
    } catch (error) {
        console.error('Reviews POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
