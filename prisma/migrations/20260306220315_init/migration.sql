-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "themeColor" TEXT NOT NULL DEFAULT 'Red',
    "language" TEXT NOT NULL DEFAULT 'en',
    "notifyNewReleases" BOOLEAN NOT NULL DEFAULT true,
    "notifyRecommendations" BOOLEAN NOT NULL DEFAULT true,
    "autoplayNext" BOOLEAN NOT NULL DEFAULT true,
    "defaultQuality" TEXT NOT NULL DEFAULT '1080p',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentTitle" TEXT,
    "contentPoster" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watch_later" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentTitle" TEXT,
    "contentPoster" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watch_later_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watch_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentTitle" TEXT,
    "contentPoster" TEXT,
    "episodeId" TEXT,
    "seasonNumber" INTEGER,
    "episodeNumber" INTEGER,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watch_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episode_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "episodeId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "episode_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentTitle" TEXT,
    "contentPoster" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'system',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_expiresAt_idx" ON "user_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");

-- CreateIndex
CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_contentId_contentType_key" ON "favorites"("userId", "contentId", "contentType");

-- CreateIndex
CREATE INDEX "watch_later_userId_idx" ON "watch_later"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "watch_later_userId_contentId_contentType_key" ON "watch_later"("userId", "contentId", "contentType");

-- CreateIndex
CREATE INDEX "watch_history_userId_idx" ON "watch_history"("userId");

-- CreateIndex
CREATE INDEX "watch_history_watchedAt_idx" ON "watch_history"("watchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "watch_history_userId_contentId_contentType_episodeId_key" ON "watch_history"("userId", "contentId", "contentType", "episodeId");

-- CreateIndex
CREATE INDEX "episode_progress_userId_seriesId_idx" ON "episode_progress"("userId", "seriesId");

-- CreateIndex
CREATE UNIQUE INDEX "episode_progress_userId_seriesId_seasonNumber_episodeNumber_key" ON "episode_progress"("userId", "seriesId", "seasonNumber", "episodeNumber");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- CreateIndex
CREATE INDEX "reviews_contentId_contentType_idx" ON "reviews"("contentId", "contentType");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_contentId_contentType_key" ON "reviews"("userId", "contentId", "contentType");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "search_history_userId_idx" ON "search_history"("userId");

-- CreateIndex
CREATE INDEX "search_history_createdAt_idx" ON "search_history"("createdAt");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_later" ADD CONSTRAINT "watch_later_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_progress" ADD CONSTRAINT "episode_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'RESOLVED');

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentTitle" TEXT,
    "issueType" TEXT NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertisements" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "link" TEXT,
    "showCountPerDay" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reports_userId_idx" ON "reports"("userId");

-- CreateIndex
CREATE INDEX "reports_contentId_contentType_idx" ON "reports"("contentId", "contentType");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
