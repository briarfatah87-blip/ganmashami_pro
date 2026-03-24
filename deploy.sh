#!/bin/bash

# Deployment Script for seven-stream
# Usage: ./deploy.sh

# Exit on error
set -e

echo "🚀 Starting deployment..."

# 1. Clear local changes to prevent conflicts
echo "📦 Reseting local changes..."
git fetch origin
git reset --hard origin/main

# 2. Install dependencies
echo "🔍 Installing dependencies..."
npm install

# 3. Generate Prisma client
echo "💎 Generating Prisma Client..."
npx prisma generate

# 4. Build the application
echo "🏗️ Building Next.js application..."
npm run build

# 5. Restart PM2 process
echo "🔄 Restarting PM2..."
pm2 restart seven-stream

echo "✅ Deployment complete! Check the site at http://localhost:3000 (or via your Nginx proxy)."
