require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    const email = process.argv[2];

    if (!email) {
        console.log('❌ Please provide an email address.');
        console.log('Usage: node reset-password.js <user-email>');
        process.exit(1);
    }

    if (!process.env.DATABASE_URL) {
        console.log('❌ Error: DATABASE_URL is not set in .env.local');
        process.exit(1);
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log(`❌ No user found with email: ${email}`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash('password123', 10);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        console.log(`✅ Success! The password for ${user.username} (${email}) has been reset to: password123`);
        console.log(`You can now log in at http://localhost:80/login with the new password.`);
    } catch (error) {
        console.error('❌ Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
