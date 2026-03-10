require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function upgradeToAdmin() {
    const email = process.argv[2];

    if (!email) {
        console.log('❌ Please provide an email address.');
        console.log('Usage: node upgrade-admin.js <user-email>');
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

        await prisma.user.update({
            where: { email },
            data: { role: 'admin' }
        });

        console.log(`✅ Success! User ${user.username} (${email}) has been upgraded to an Admin.`);
        console.log(`You can now log in and access the dashboard at http://localhost:80/admin`);
    } catch (error) {
        console.error('❌ Error upgrading user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

upgradeToAdmin();
