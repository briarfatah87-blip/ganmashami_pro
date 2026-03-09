-- =====================================================
-- SevenStream Database (PostgreSQL)
-- User accounts, favorites, watch history, reviews,
-- notifications, settings, and more
-- =====================================================
-- Movies & series come from the Xtream API, so we
-- only store the content_id (e.g. "movie-123") and
-- content_type ("movie" or "series") to reference them.
-- =====================================================

-- Create the database (run this separately as superuser if needed):
-- CREATE DATABASE seven_stream;

-- Connect to the database:
-- \c seven_stream

-- =====================================================
-- ENUM TYPES
-- =====================================================
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE content_type AS ENUM ('movie', 'series');
CREATE TYPE notification_type AS ENUM ('new_release', 'recommendation', 'system', 'update');

-- =====================================================
-- 1. USERS
-- =====================================================
CREATE TABLE users (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email        VARCHAR(255) NOT NULL UNIQUE,
  username     VARCHAR(100) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  avatar       VARCHAR(500) NULL,
  role         user_role    NOT NULL DEFAULT 'user',
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);

-- =====================================================
-- 2. USER SESSIONS (login tokens / remember me)
-- =====================================================
CREATE TABLE user_sessions (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL,
  token        VARCHAR(500) NOT NULL UNIQUE,
  device_info  VARCHAR(255) NULL,
  ip_address   VARCHAR(45)  NULL,
  expires_at   TIMESTAMP    NOT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user ON user_sessions (user_id);
CREATE INDEX idx_sessions_token ON user_sessions (token);
CREATE INDEX idx_sessions_expires ON user_sessions (expires_at);

-- =====================================================
-- 3. USER SETTINGS (theme, notifications, preferences)
-- =====================================================
CREATE TABLE user_settings (
  id                     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID         NOT NULL UNIQUE,
  theme_color            VARCHAR(50)  NOT NULL DEFAULT 'Red',
  language               VARCHAR(10)  NOT NULL DEFAULT 'en',
  notify_new_releases    BOOLEAN      NOT NULL DEFAULT TRUE,
  notify_recommendations BOOLEAN      NOT NULL DEFAULT TRUE,
  notify_email_updates   BOOLEAN      NOT NULL DEFAULT FALSE,
  autoplay_next          BOOLEAN      NOT NULL DEFAULT TRUE,
  default_quality        VARCHAR(10)  NOT NULL DEFAULT '1080p',
  updated_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 4. FAVORITES
-- content_id = Xtream ID like "movie-123" or "series-456"
-- content_type = "movie" or "series"
-- =====================================================
CREATE TABLE favorites (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID         NOT NULL,
  content_id    VARCHAR(100) NOT NULL,
  content_type  content_type NOT NULL,
  content_title VARCHAR(500) NULL,
  content_poster VARCHAR(1000) NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, content_id, content_type)
);

CREATE INDEX idx_fav_user ON favorites (user_id);

-- =====================================================
-- 5. WATCH LATER
-- =====================================================
CREATE TABLE watch_later (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID         NOT NULL,
  content_id    VARCHAR(100) NOT NULL,
  content_type  content_type NOT NULL,
  content_title VARCHAR(500) NULL,
  content_poster VARCHAR(1000) NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, content_id, content_type)
);

CREATE INDEX idx_wl_user ON watch_later (user_id);

-- =====================================================
-- 6. WATCH HISTORY (progress tracking / continue watching)
-- =====================================================
CREATE TABLE watch_history (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID         NOT NULL,
  content_id    VARCHAR(100) NOT NULL,
  content_type  content_type NOT NULL,
  content_title VARCHAR(500) NULL,
  content_poster VARCHAR(1000) NULL,
  episode_id    VARCHAR(100) NULL,           -- For series: which episode
  season_number INT          NULL,
  episode_number INT         NULL,
  progress      INT          NOT NULL DEFAULT 0, -- Seconds watched
  duration      INT          NOT NULL DEFAULT 0, -- Total seconds
  completed     BOOLEAN      NOT NULL DEFAULT FALSE,
  watched_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, content_id, content_type, episode_id)
);

CREATE INDEX idx_wh_user ON watch_history (user_id);
CREATE INDEX idx_wh_date ON watch_history (watched_at);

-- =====================================================
-- 7. EPISODE PROGRESS (track each watched episode)
-- Use this to change color of watched episodes in UI
-- e.g. user watched ep 1,2,3 → those show as watched
-- =====================================================
CREATE TABLE episode_progress (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL,
  series_id       VARCHAR(100) NOT NULL,     -- Xtream series ID like "series-456"
  season_number   INT          NOT NULL,
  episode_number  INT          NOT NULL,
  episode_id      VARCHAR(100) NOT NULL,     -- Xtream episode ID
  progress        INT          NOT NULL DEFAULT 0, -- Seconds watched
  duration        INT          NOT NULL DEFAULT 0, -- Total seconds
  completed       BOOLEAN      NOT NULL DEFAULT FALSE,
  watched_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, series_id, season_number, episode_number)
);

CREATE INDEX idx_ep_user_series ON episode_progress (user_id, series_id);

-- =====================================================
-- 8. REVIEWS (ratings & comments)
-- =====================================================
CREATE TABLE reviews (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID         NOT NULL,
  content_id    VARCHAR(100) NOT NULL,
  content_type  content_type NOT NULL,
  rating        SMALLINT     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT         NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, content_id, content_type)
);

CREATE INDEX idx_rev_user ON reviews (user_id);
CREATE INDEX idx_rev_content ON reviews (content_id, content_type);

-- =====================================================
-- 9. NOTIFICATIONS
-- =====================================================
CREATE TABLE notifications (
  id          UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID              NOT NULL,
  title       VARCHAR(255)      NOT NULL,
  message     TEXT              NOT NULL,
  type        notification_type NOT NULL DEFAULT 'system',
  is_read     BOOLEAN           NOT NULL DEFAULT FALSE,
  link        VARCHAR(500)      NULL,
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notif_user ON notifications (user_id);
CREATE INDEX idx_notif_unread ON notifications (user_id, is_read);

-- =====================================================
-- 10. SEARCH HISTORY
-- =====================================================
CREATE TABLE search_history (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         NOT NULL,
  query       VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_search_user ON search_history (user_id);
CREATE INDEX idx_search_date ON search_history (created_at);

-- =====================================================
-- DONE! 10 tables created:
--   1. users            - Accounts (login/signup)
--   2. user_sessions    - Auth tokens / remember me
--   3. user_settings    - Theme, notifications, prefs
--   4. favorites        - Favorite movies & series
--   5. watch_later      - Watch later list
--   6. watch_history    - Progress / continue watching
--   7. episode_progress - Per-episode watched status ★
--   8. reviews          - Ratings & comments
--   9. notifications    - Alerts & updates
--   10. search_history  - Search tracking
-- =====================================================
