import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const ad = await prisma.advertisement.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' }
        })

        return NextResponse.json(ad)
    } catch (error) {
        console.error('Error fetching ad:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
