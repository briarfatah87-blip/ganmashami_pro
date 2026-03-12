import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

async function requireAdmin() {
    const cookieStore = await cookies()
    const token = cookieStore.get('seven_stream_session')?.value
    if (!token) return null
    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'admin') return null
    return payload
}

export async function GET() {
    try {
        const admin = await requireAdmin()
        if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        let settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } })
        if (!settings) {
            settings = await prisma.siteSettings.create({ data: { id: 'default' } })
        }
        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error fetching site settings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const admin = await requireAdmin()
        if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const { logoUrl, footerDescription, copyrightText, facebookUrl, twitterUrl, instagramUrl, youtubeUrl } = body

        const settings = await prisma.siteSettings.upsert({
            where: { id: 'default' },
            update: {
                logoUrl: logoUrl || '/logo.png',
                footerDescription: footerDescription || '',
                copyrightText: copyrightText || '',
                facebookUrl: facebookUrl || null,
                twitterUrl: twitterUrl || null,
                instagramUrl: instagramUrl || null,
                youtubeUrl: youtubeUrl || null,
            },
            create: {
                id: 'default',
                logoUrl: logoUrl || '/logo.png',
                footerDescription: footerDescription || '',
                copyrightText: copyrightText || '',
                facebookUrl: facebookUrl || null,
                twitterUrl: twitterUrl || null,
                instagramUrl: instagramUrl || null,
                youtubeUrl: youtubeUrl || null,
            },
        })

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error updating site settings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
