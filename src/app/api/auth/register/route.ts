import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { hashPassword, signToken, generateSessionToken } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { email, username, password } = await request.json()

        if (!email || !username || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user and default settings
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                settings: {
                    create: {}, // Creates default UserSettings
                },
            },
        })

        // User will now log in manually upon redirection
        // (Auto-login session code removed as per requested flow)

        // Return user without password
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(userWithoutPassword, { status: 201 })
    } catch (error) {
        console.error('Registration error:', error)
        console.error('Error details:', error instanceof Error ? error.message : String(error))
        return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}
