import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

// We should use an environment variable for this in production
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-seven-stream-key-2026'

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export function signToken(payload: { userId: string, role: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string, role: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string, role: string }
    } catch (error) {
        return null
    }
}

export function generateSessionToken(): string {
    return uuidv4()
}
