import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { verifyPassword, signToken, generateSessionToken } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password)

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        if (!user.isActive) {
            return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 })
        }

        // Create JWT token and Session
        const jwtToken = signToken({ userId: user.id, role: user.role })
        const sessionToken = generateSessionToken()

        await prisma.userSession.create({
            data: {
                userId: user.id,
                token: sessionToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        })

        // Set HTTP-only cookie
        const cookieStore = await cookies()
        cookieStore.set('seven_stream_session', jwtToken, {
            httpOnly: true,
            secure: false, // Set to false to allow sessions over HTTP (IP access)
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        })

        // Return user without password
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(userWithoutPassword, { status: 200 })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
