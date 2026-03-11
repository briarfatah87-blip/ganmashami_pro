-- =====================================================
-- SevenStream Database (PostgreSQL)
-- User accounts, favorites, watch history, reviews,
-- notifications, settings, and more
-- =====================================================

-- =====================================================
-- ENUM TYPES
-- =====================================================

DO $$ BEGIN
    CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 1. USERS (must be first — other tables reference it)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users
(
    id text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    avatar text COLLATE pg_catalog."default",
    role text COLLATE pg_catalog."default" NOT NULL DEFAULT 'user'::text,
    "isActive" boolean NOT NULL DEFAULT true,
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key
    ON public.users USING btree (email COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE UNIQUE INDEX IF NOT EXISTS users_username_key
    ON public.users USING btree (username COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

 -- Table: public.advertisements

-- DROP TABLE IF EXISTS public.advertisements;

CREATE TABLE IF NOT EXISTS public.advertisements
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "imageUrl" text COLLATE pg_catalog."default" NOT NULL,
    link text COLLATE pg_catalog."default",
    "showCountPerDay" integer NOT NULL DEFAULT 1,
    "isActive" boolean NOT NULL DEFAULT true,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT advertisements_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.advertisements
    OWNER to sevenstream;



    -- Table: public.episode_progress

-- DROP TABLE IF EXISTS public.episode_progress;

CREATE TABLE IF NOT EXISTS public.episode_progress
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "seriesId" text COLLATE pg_catalog."default" NOT NULL,
    "seasonNumber" integer NOT NULL,
    "episodeNumber" integer NOT NULL,
    "episodeId" text COLLATE pg_catalog."default" NOT NULL,
    progress integer NOT NULL DEFAULT 0,
    duration integer NOT NULL DEFAULT 0,
    completed boolean NOT NULL DEFAULT false,
    "watchedAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT episode_progress_pkey PRIMARY KEY (id),
    CONSTRAINT "episode_progress_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.episode_progress
    OWNER to sevenstream;
-- Index: episode_progress_userId_seriesId_idx

-- DROP INDEX IF EXISTS public."episode_progress_userId_seriesId_idx";

CREATE INDEX IF NOT EXISTS "episode_progress_userId_seriesId_idx"
    ON public.episode_progress USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST, "seriesId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: episode_progress_userId_seriesId_seasonNumber_episodeNumber_key

-- DROP INDEX IF EXISTS public."episode_progress_userId_seriesId_seasonNumber_episodeNumber_key";

CREATE UNIQUE INDEX IF NOT EXISTS "episode_progress_userId_seriesId_seasonNumber_episodeNumber_key"
    ON public.episode_progress USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST, "seriesId" COLLATE pg_catalog."default" ASC NULLS LAST, "seasonNumber" ASC NULLS LAST, "episodeNumber" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;


    -- Table: public.favorites

-- DROP TABLE IF EXISTS public.favorites;

CREATE TABLE IF NOT EXISTS public.favorites
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "contentId" text COLLATE pg_catalog."default" NOT NULL,
    "contentType" text COLLATE pg_catalog."default" NOT NULL,
    "contentTitle" text COLLATE pg_catalog."default",
    "contentPoster" text COLLATE pg_catalog."default",
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT favorites_pkey PRIMARY KEY (id),
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.favorites
    OWNER to sevenstream;
-- Index: favorites_userId_contentId_contentType_key

-- DROP INDEX IF EXISTS public."favorites_userId_contentId_contentType_key";

CREATE UNIQUE INDEX IF NOT EXISTS "favorites_userId_contentId_contentType_key"
    ON public.favorites USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentType" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: favorites_userId_idx

-- DROP INDEX IF EXISTS public."favorites_userId_idx";

CREATE INDEX IF NOT EXISTS "favorites_userId_idx"
    ON public.favorites USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;


    -- Table: public.notifications

-- DROP TABLE IF EXISTS public.notifications;

CREATE TABLE IF NOT EXISTS public.notifications
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL DEFAULT 'system'::text,
    "isRead" boolean NOT NULL DEFAULT false,
    link text COLLATE pg_catalog."default",
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notifications
    OWNER to sevenstream;
-- Index: notifications_userId_idx

-- DROP INDEX IF EXISTS public."notifications_userId_idx";

CREATE INDEX IF NOT EXISTS "notifications_userId_idx"
    ON public.notifications USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: notifications_userId_isRead_idx

-- DROP INDEX IF EXISTS public."notifications_userId_isRead_idx";

CREATE INDEX IF NOT EXISTS "notifications_userId_isRead_idx"
    ON public.notifications USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST, "isRead" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;


    -- Table: public.reports

-- DROP TABLE IF EXISTS public.reports;

CREATE TABLE IF NOT EXISTS public.reports
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "contentId" text COLLATE pg_catalog."default" NOT NULL,
    "contentType" text COLLATE pg_catalog."default" NOT NULL,
    "contentTitle" text COLLATE pg_catalog."default",
    "issueType" text COLLATE pg_catalog."default" NOT NULL,
    details text COLLATE pg_catalog."default",
    status "ReportStatus" NOT NULL DEFAULT 'PENDING'::"ReportStatus",
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT reports_pkey PRIMARY KEY (id),
    CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reports
    OWNER to sevenstream;
-- Index: reports_contentId_contentType_idx

-- DROP INDEX IF EXISTS public."reports_contentId_contentType_idx";

CREATE INDEX IF NOT EXISTS "reports_contentId_contentType_idx"
    ON public.reports USING btree
    ("contentId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentType" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: reports_status_idx

-- DROP INDEX IF EXISTS public.reports_status_idx;

CREATE INDEX IF NOT EXISTS reports_status_idx
    ON public.reports USING btree
    (status ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: reports_userId_idx

-- DROP INDEX IF EXISTS public."reports_userId_idx";

CREATE INDEX IF NOT EXISTS "reports_userId_idx"
    ON public.reports USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;


    -- Table: public.reviews

-- DROP TABLE IF EXISTS public.reviews;

CREATE TABLE IF NOT EXISTS public.reviews
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "contentId" text COLLATE pg_catalog."default" NOT NULL,
    "contentType" text COLLATE pg_catalog."default" NOT NULL,
    "contentTitle" text COLLATE pg_catalog."default",
    "contentPoster" text COLLATE pg_catalog."default",
    rating integer NOT NULL,
    comment text COLLATE pg_catalog."default",
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reviews
    OWNER to sevenstream;
-- Index: reviews_contentId_contentType_idx

-- DROP INDEX IF EXISTS public."reviews_contentId_contentType_idx";

CREATE INDEX IF NOT EXISTS "reviews_contentId_contentType_idx"
    ON public.reviews USING btree
    ("contentId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentType" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: reviews_userId_contentId_contentType_key

-- DROP INDEX IF EXISTS public."reviews_userId_contentId_contentType_key";

CREATE UNIQUE INDEX IF NOT EXISTS "reviews_userId_contentId_contentType_key"
    ON public.reviews USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentType" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: reviews_userId_idx

-- DROP INDEX IF EXISTS public."reviews_userId_idx";

CREATE INDEX IF NOT EXISTS "reviews_userId_idx"
    ON public.reviews USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;


    -- Table: public.search_history

-- DROP TABLE IF EXISTS public.search_history;

CREATE TABLE IF NOT EXISTS public.search_history
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    query text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT search_history_pkey PRIMARY KEY (id),
    CONSTRAINT "search_history_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.search_history
    OWNER to sevenstream;
-- Index: search_history_createdAt_idx

-- DROP INDEX IF EXISTS public."search_history_createdAt_idx";

CREATE INDEX IF NOT EXISTS "search_history_createdAt_idx"
    ON public.search_history USING btree
    ("createdAt" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: search_history_userId_idx

-- DROP INDEX IF EXISTS public."search_history_userId_idx";

CREATE INDEX IF NOT EXISTS "search_history_userId_idx"
    ON public.search_history USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;


    -- Table: public.user_sessions

-- DROP TABLE IF EXISTS public.user_sessions;

CREATE TABLE IF NOT EXISTS public.user_sessions
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    token text COLLATE pg_catalog."default" NOT NULL,
    "deviceInfo" text COLLATE pg_catalog."default",
    "ipAddress" text COLLATE pg_catalog."default",
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
    CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_sessions
    OWNER to sevenstream;
-- Index: user_sessions_expiresAt_idx

-- DROP INDEX IF EXISTS public."user_sessions_expiresAt_idx";

CREATE INDEX IF NOT EXISTS "user_sessions_expiresAt_idx"
    ON public.user_sessions USING btree
    ("expiresAt" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: user_sessions_token_key

-- DROP INDEX IF EXISTS public.user_sessions_token_key;

CREATE UNIQUE INDEX IF NOT EXISTS user_sessions_token_key
    ON public.user_sessions USING btree
    (token COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: user_sessions_userId_idx

-- DROP INDEX IF EXISTS public."user_sessions_userId_idx";

CREATE INDEX IF NOT EXISTS "user_sessions_userId_idx"
    ON public.user_sessions USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;


    -- Table: public.user_settings

-- DROP TABLE IF EXISTS public.user_settings;

CREATE TABLE IF NOT EXISTS public.user_settings
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "themeColor" text COLLATE pg_catalog."default" NOT NULL DEFAULT 'Red'::text,
    language text COLLATE pg_catalog."default" NOT NULL DEFAULT 'en'::text,
    "notifyNewReleases" boolean NOT NULL DEFAULT true,
    "notifyRecommendations" boolean NOT NULL DEFAULT true,
    "autoplayNext" boolean NOT NULL DEFAULT true,
    "defaultQuality" text COLLATE pg_catalog."default" NOT NULL DEFAULT '1080p'::text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT user_settings_pkey PRIMARY KEY (id),
    CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_settings
    OWNER to sevenstream;
-- Index: user_settings_userId_key

-- DROP INDEX IF EXISTS public."user_settings_userId_key";

CREATE UNIQUE INDEX IF NOT EXISTS "user_settings_userId_key"
    ON public.user_settings USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;


    -- Table: public.watch_history

-- DROP TABLE IF EXISTS public.watch_history;

CREATE TABLE IF NOT EXISTS public.watch_history
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "contentId" text COLLATE pg_catalog."default" NOT NULL,
    "contentType" text COLLATE pg_catalog."default" NOT NULL,
    "contentTitle" text COLLATE pg_catalog."default",
    "contentPoster" text COLLATE pg_catalog."default",
    "episodeId" text COLLATE pg_catalog."default",
    "seasonNumber" integer,
    "episodeNumber" integer,
    progress integer NOT NULL DEFAULT 0,
    duration integer NOT NULL DEFAULT 0,
    completed boolean NOT NULL DEFAULT false,
    "watchedAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT watch_history_pkey PRIMARY KEY (id),
    CONSTRAINT "watch_history_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.watch_history
    OWNER to sevenstream;
-- Index: watch_history_userId_contentId_contentType_episodeId_key

-- DROP INDEX IF EXISTS public."watch_history_userId_contentId_contentType_episodeId_key";

CREATE UNIQUE INDEX IF NOT EXISTS "watch_history_userId_contentId_contentType_episodeId_key"
    ON public.watch_history USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentType" COLLATE pg_catalog."default" ASC NULLS LAST, "episodeId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: watch_history_userId_idx

-- DROP INDEX IF EXISTS public."watch_history_userId_idx";

CREATE INDEX IF NOT EXISTS "watch_history_userId_idx"
    ON public.watch_history USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: watch_history_watchedAt_idx

-- DROP INDEX IF EXISTS public."watch_history_watchedAt_idx";

CREATE INDEX IF NOT EXISTS "watch_history_watchedAt_idx"
    ON public.watch_history USING btree
    ("watchedAt" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;



    -- Table: public.watch_later

-- DROP TABLE IF EXISTS public.watch_later;

CREATE TABLE IF NOT EXISTS public.watch_later
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "contentId" text COLLATE pg_catalog."default" NOT NULL,
    "contentType" text COLLATE pg_catalog."default" NOT NULL,
    "contentTitle" text COLLATE pg_catalog."default",
    "contentPoster" text COLLATE pg_catalog."default",
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT watch_later_pkey PRIMARY KEY (id),
    CONSTRAINT "watch_later_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.watch_later
    OWNER to sevenstream;
-- Index: watch_later_userId_contentId_contentType_key

-- DROP INDEX IF EXISTS public."watch_later_userId_contentId_contentType_key";

CREATE UNIQUE INDEX IF NOT EXISTS "watch_later_userId_contentId_contentType_key"
    ON public.watch_later USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentId" COLLATE pg_catalog."default" ASC NULLS LAST, "contentType" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
-- Index: watch_later_userId_idx

-- DROP INDEX IF EXISTS public."watch_later_userId_idx";

CREATE INDEX IF NOT EXISTS "watch_later_userId_idx"
    ON public.watch_later USING btree
    ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (fillfactor=100, deduplicate_items=True)
    TABLESPACE pg_default;
