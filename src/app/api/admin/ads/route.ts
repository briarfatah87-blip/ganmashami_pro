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

        const ads = await prisma.advertisement.findMany({
            orderBy: { updatedAt: 'desc' }
        })

        return NextResponse.json(ads)
    } catch (error) {
        console.error('Error fetching admin ads:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = await verifyToken(token)
        if (!payload || !payload.userId || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { id, imageUrl, link, showCountPerDay, isActive } = body

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
        }

        let ad
        if (id) {
            ad = await prisma.advertisement.update({
                where: { id },
                data: {
                    imageUrl,
                    link,
                    showCountPerDay: parseInt(showCountPerDay),
                    isActive
                }
            })
        } else {
            ad = await prisma.advertisement.create({
                data: {
                    imageUrl,
                    link,
                    showCountPerDay: parseInt(showCountPerDay),
                    isActive: isActive ?? true
                }
            })
        }

        return NextResponse.json(ad)
    } catch (error) {
        console.error('Error saving ad:', error)
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
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        await prisma.advertisement.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting ad:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
