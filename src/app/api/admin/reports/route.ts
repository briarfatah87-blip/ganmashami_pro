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

        // Fetch reports with user details
        const reports = await prisma.report.findMany({
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

        return NextResponse.json(reports)
    } catch (error) {
        console.error('Error fetching admin reports:', error)
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
        const reportId = searchParams.get('id')

        if (!reportId) {
            return NextResponse.json({ error: 'Report ID is required' }, { status: 400 })
        }

        await prisma.report.delete({
            where: { id: reportId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting report:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
