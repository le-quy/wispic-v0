-- ============================================================
-- WISPIC – PostgreSQL Database Schema
-- Database: wicpic
-- ============================================================

-- Tạo database (chạy riêng nếu chưa có)
-- CREATE DATABASE wicpic;

-- ============================================================
-- 1. USERS – Tài khoản người dùng
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL DEFAULT '',
    role        VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. TEMPLATES – Mẫu thiệp (system + admin custom)
-- ============================================================
CREATE TABLE IF NOT EXISTS templates (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL DEFAULT 'Mẫu tùy chỉnh',
    category    VARCHAR(100) NOT NULL DEFAULT 'Tùy chỉnh',
    description TEXT         NOT NULL DEFAULT '',
    swatches    JSONB        NOT NULL DEFAULT '["#f7f3ee", "#302b27"]',
    accent      VARCHAR(20)  NOT NULL DEFAULT '#9b8878',
    html        TEXT         NOT NULL DEFAULT '',
    css         TEXT         NOT NULL DEFAULT '',
    is_custom   BOOLEAN      NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. WEDDINGS – Thiệp cưới chính
-- ============================================================
CREATE TABLE IF NOT EXISTS weddings (
    id              UUID PRIMARY KEY,
    user_id         UUID         REFERENCES users(id) ON DELETE SET NULL,
    template_id     VARCHAR(100) NOT NULL DEFAULT 'romantic',
    title           VARCHAR(255) NOT NULL DEFAULT 'Thiệp cưới chưa đặt tên',
    status          VARCHAR(20)  NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),

    -- Cô dâu & chú rể
    groom           VARCHAR(255) NOT NULL DEFAULT '',
    bride           VARCHAR(255) NOT NULL DEFAULT '',
    groom_parents   VARCHAR(500) NOT NULL DEFAULT '',
    bride_parents   VARCHAR(500) NOT NULL DEFAULT '',

    -- Ngày cưới
    wedding_date    VARCHAR(100) NOT NULL DEFAULT '',

    -- Lễ & tiệc
    ceremony        JSONB NOT NULL DEFAULT '{"time":"","date":""}',
    reception       JSONB NOT NULL DEFAULT '{"time":"","description":""}',

    -- Địa điểm
    location        JSONB NOT NULL DEFAULT '{"city":"","province":"","venueName":""}',

    -- Nội dung
    introduction    TEXT NOT NULL DEFAULT '',
    couple_story    TEXT NOT NULL DEFAULT '',

    -- Ảnh đại diện & cặp đôi (lưu URL)
    avatar_url      TEXT,
    avatar_alt      VARCHAR(500) DEFAULT '',
    couple_photo_url TEXT,
    couple_photo_alt VARCHAR(500) DEFAULT '',

    -- RSVP
    rsvp_enabled        BOOLEAN      NOT NULL DEFAULT true,
    rsvp_display_mode   VARCHAR(20)  NOT NULL DEFAULT 'button' CHECK (rsvp_display_mode IN ('button', 'inline')),
    rsvp_max_guest_count INTEGER     NOT NULL DEFAULT 5,

    -- Mừng cưới
    gift_enabled    BOOLEAN      NOT NULL DEFAULT true,
    gift_display_mode VARCHAR(20) NOT NULL DEFAULT 'button' CHECK (gift_display_mode IN ('button', 'inline')),
    gift_title      VARCHAR(255) NOT NULL DEFAULT 'Mừng cưới',

    -- Dress code
    dress_code_enabled  BOOLEAN NOT NULL DEFAULT true,
    dress_code_title    VARCHAR(255) NOT NULL DEFAULT 'Dress Code',
    dress_code_subtitle VARCHAR(255) NOT NULL DEFAULT 'Tông màu hoà cùng ngày vui',

    -- Nhạc nền
    music_enabled   BOOLEAN NOT NULL DEFAULT false,
    music_url       TEXT,
    music_title     VARCHAR(255) DEFAULT '',

    -- Guestbook
    guestbook_enabled BOOLEAN NOT NULL DEFAULT true,

    -- Phong bì
    envelope_greeting TEXT NOT NULL DEFAULT 'Mời bạn đến chia sẻ niềm vui cùng chúng mình',

    -- OG Image
    og_style        VARCHAR(20)  NOT NULL DEFAULT 'envelope' CHECK (og_style IN ('envelope', 'photo')),
    og_custom_url   TEXT,

    -- Bản đồ
    map_embed_url   TEXT,
    map_address     TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. WEDDING_PHOTOS – Bộ sưu tập ảnh thiệp
-- ============================================================
CREATE TABLE IF NOT EXISTS wedding_photos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    alt         VARCHAR(500) DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wedding_photos_wedding_id ON wedding_photos(wedding_id);

-- ============================================================
-- 5. RSVP_QUESTIONS – Câu hỏi RSVP
-- ============================================================
CREATE TABLE IF NOT EXISTS rsvp_questions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    text        TEXT NOT NULL DEFAULT '',
    type        VARCHAR(20) NOT NULL DEFAULT 'yes_no' CHECK (type IN ('yes_no', 'text')),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_questions_wedding_id ON rsvp_questions(wedding_id);

-- ============================================================
-- 6. GIFT_ACCOUNTS – Tài khoản mừng cưới
-- ============================================================
CREATE TABLE IF NOT EXISTS gift_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id      UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    bank_name       VARCHAR(255) NOT NULL DEFAULT '',
    account_number  VARCHAR(100) NOT NULL DEFAULT '',
    holder_name     VARCHAR(255) NOT NULL DEFAULT '',
    qr_url          TEXT,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_accounts_wedding_id ON gift_accounts(wedding_id);

-- ============================================================
-- 7. TIMELINE_EVENTS – Lịch trình buổi tiệc
-- ============================================================
CREATE TABLE IF NOT EXISTS timeline_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    time        VARCHAR(20) NOT NULL DEFAULT '',
    title       VARCHAR(255) NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timeline_events_wedding_id ON timeline_events(wedding_id);

-- ============================================================
-- 8. DRESS_CODE_COLORS – Màu trang phục dress code
-- ============================================================
CREATE TABLE IF NOT EXISTS dress_code_colors (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    color       VARCHAR(20) NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dress_code_colors_wedding_id ON dress_code_colors(wedding_id);

-- ============================================================
-- 9. GUESTBOOK_ENTRIES – Lời chúc từ khách
-- ============================================================
CREATE TABLE IF NOT EXISTS guestbook_entries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    guest_name  VARCHAR(255) NOT NULL DEFAULT '',
    message     TEXT NOT NULL DEFAULT '',
    answers     JSONB DEFAULT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guestbook_entries_wedding_id ON guestbook_entries(wedding_id);

-- ============================================================
-- 10. GUESTBOOK_QUESTIONS – Câu hỏi guestbook
-- ============================================================
CREATE TABLE IF NOT EXISTS guestbook_questions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    text        TEXT NOT NULL DEFAULT '',
    type        VARCHAR(20) NOT NULL DEFAULT 'yes_no' CHECK (type IN ('yes_no', 'text')),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guestbook_questions_wedding_id ON guestbook_questions(wedding_id);

-- ============================================================
-- 11. RSVP_RESPONSES – Phản hồi RSVP từ khách
-- ============================================================
CREATE TABLE IF NOT EXISTS rsvp_responses (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id  UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    guest_name  VARCHAR(255) NOT NULL DEFAULT '',
    attending   BOOLEAN NOT NULL DEFAULT true,
    guest_count INTEGER NOT NULL DEFAULT 1,
    answers     JSONB DEFAULT NULL,
    note        TEXT DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_responses_wedding_id ON rsvp_responses(wedding_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_weddings_user_id ON weddings(user_id);
CREATE INDEX IF NOT EXISTS idx_weddings_template_id ON weddings(template_id);
CREATE INDEX IF NOT EXISTS idx_weddings_status ON weddings(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
