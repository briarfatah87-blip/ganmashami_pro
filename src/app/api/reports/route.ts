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
        if (!payload || !payload.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const reports = await prisma.report.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(reports)
    } catch (error) {
        console.error('Error fetching reports:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = await verifyToken(token)
        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const body = await request.json()
        const { contentId, contentType, contentTitle, issueType, details } = body

        if (!contentId || !contentType || !issueType) {
            return NextResponse.json(
                { error: 'Missing required fields (contentId, contentType, issueType)' },
                { status: 400 }
            )
        }

        const validIssueTypes = [
            'Server not working',
            'Subtitle problem',
            'Sound problem',
            'Video playback issue',
            'Incorrect metadata'
        ]

        if (!validIssueTypes.includes(issueType)) {
            return NextResponse.json({ error: 'Invalid issue type provided' }, { status: 400 })
        }

        const report = await prisma.report.create({
            data: {
                userId: payload.userId as string,
                contentId,
                contentType,
                contentTitle,
                issueType,
                details,
                status: 'PENDING'
            }
        })

        return NextResponse.json({ success: true, report })
    } catch (error) {
        console.error('Error submitting report:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Admins can resolve tickets and ping users
export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('seven_stream_session')?.value
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = await verifyToken(token)
        if (!payload || !payload.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        // Verify admin 
        const adminCheck = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { role: true }
        })

        if (adminCheck?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized Admin Access' }, { status: 403 })
        }

        const { reportId, status } = await request.json()
        if (!reportId || status !== 'RESOLVED') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
        }

        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: { status }
        })

        // Automatically ping the user their issue was resolved
        await prisma.notification.create({
            data: {
                userId: updatedReport.userId,
                title: 'Issue Resolved! ✅',
                message: `Your report "${updatedReport.issueType}" for ${updatedReport.contentTitle || 'content'} has been fixed. Thanks for letting us know!`,
                type: 'update',
                link: updatedReport.contentType === 'movie'
                    ? `/movie/${updatedReport.contentId}`
                    : `/series/${updatedReport.contentId}`
            }
        })

        return NextResponse.json({ success: true, report: updatedReport })
    } catch (error) {
        console.error('Error resolving report:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
