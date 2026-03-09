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

        let settings = await prisma.userSettings.findUnique({
            where: { userId: payload.userId }
        })

        if (!settings) {
            settings = await prisma.userSettings.create({
                data: { userId: payload.userId }
            })
        }

        return NextResponse.json(settings, { status: 200 })
    } catch (error) {
        console.error('Settings API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const payload = verifyToken(token)
        if (!payload?.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const data = await request.json()

        const settings = await prisma.userSettings.upsert({
            where: { userId: payload.userId },
            update: {
                themeColor: data.themeColor,
                language: data.language,
                notifyNewReleases: data.notifyNewReleases,
                notifyRecommendations: data.notifyRecommendations,
                autoplayNext: data.autoplayNext,
                defaultQuality: data.defaultQuality
            },
            create: {
                userId: payload.userId,
                themeColor: data.themeColor,
                language: data.language,
                notifyNewReleases: data.notifyNewReleases,
                notifyRecommendations: data.notifyRecommendations,
                autoplayNext: data.autoplayNext,
                defaultQuality: data.defaultQuality
            }
        })

        return NextResponse.json(settings, { status: 200 })
    } catch (error) {
        console.error('Settings API PUT error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
