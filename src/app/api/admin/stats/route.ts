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

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const [
            totalPending,
            totalResolved,
            reportsToday,
            reportsThisWeek,
            reportsThisMonth
        ] = await Promise.all([
            prisma.report.count({ where: { status: 'PENDING' } }),
            prisma.report.count({ where: { status: 'RESOLVED' } }),
            prisma.report.count({ where: { createdAt: { gte: today } } }),
            prisma.report.count({ where: { createdAt: { gte: startOfWeek } } }),
            prisma.report.count({ where: { createdAt: { gte: startOfMonth } } }),
        ])

        return NextResponse.json({
            totals: { pending: totalPending, resolved: totalResolved },
            trends: {
                today: reportsToday,
                week: reportsThisWeek,
                month: reportsThisMonth
            }
        })
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
