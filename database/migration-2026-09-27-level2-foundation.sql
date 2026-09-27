-- ============================================================
-- WISPIC – Migration: nền tảng Level 2 (slug, status, bảng nội dung)
-- Ngày: 2026-09-27
--
-- Mục đích (spec lib/docs/ba/Wispic_BA_Level2/):
--   - 00-conventions: status VIẾT HOA, slug unique, soft-archive
--   - 05-wedding:     WeddingTemplate + WeddingInvitation tách bạch,
--                     thiệp công khai xem bằng slug, có UNPUBLISHED
--   - 07-content-model: articles / photography_collections / photos / bookings
--
-- Idempotent: chạy lại nhiều lần vẫn an toàn.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. TEMPLATES – slug, preview_image, template_key
--
-- Trước đây có HAI hệ thống template song song:
--   - lib/template-registry.tsx: 3 component React, khóa 'romantic'/'modern'/'traditional'
--   - bảng templates: UUID, chỉ admin dùng, KHÔNG FK
-- Gộp lại: `template_key` trỏ về registry, `weddings.template_id` trở thành FK thật.
-- ============================================================

ALTER TABLE templates ADD COLUMN IF NOT EXISTS slug VARCHAR(160);
ALTER TABLE templates ADD COLUMN IF NOT EXISTS preview_image TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS template_key VARCHAR(100);

-- Gán template_key cho 3 mẫu hệ thống đã seed (khớp lib/template-registry.tsx)
UPDATE templates SET template_key = 'romantic'     WHERE name = 'Lãng mạn'   AND template_key IS NULL;
UPDATE templates SET template_key = 'modern'      WHERE name = 'Thanh xuân' AND template_key IS NULL;
UPDATE templates SET template_key = 'traditional' WHERE name = 'Song Hỷ'    AND template_key IS NULL;

-- slug cho mẫu hệ thống chưa có
UPDATE templates SET slug = 'lang-man'  WHERE template_key = 'romantic'     AND (slug IS NULL OR slug = '');
UPDATE templates SET slug = 'thanh-xuan' WHERE template_key = 'modern'      AND (slug IS NULL OR slug = '');
UPDATE templates SET slug = 'song-hy'   WHERE template_key = 'traditional' AND (slug IS NULL OR slug = '');

-- mẫu còn lại (custom) suy ra slug từ tên, có xử lý trùng
UPDATE templates SET slug = COALESCE(NULLIF(slug, ''), lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g')))
WHERE slug IS NULL OR slug = '';

-- gỡ hậu tố -2/-3... nếu trùng, giữ nguyên các hậu tố đã ổn định
UPDATE templates t SET slug = t.slug || '-' || sub.cnt
FROM (SELECT id, row_number() OVER (PARTITION BY slug ORDER BY created_at, id) AS cnt
      FROM templates) sub
WHERE t.id = sub.id AND sub.cnt > 1;

ALTER TABLE templates ALTER COLUMN slug SET NOT NULL;
DROP INDEX IF EXISTS idx_templates_slug;
CREATE UNIQUE INDEX idx_templates_slug ON templates(slug);
DROP INDEX IF EXISTS idx_templates_template_key;
CREATE UNIQUE INDEX idx_templates_template_key ON templates(template_key) WHERE template_key IS NOT NULL;

-- status VIẾT HOA (templates chỉ có 3 trạng thái: DRAFT/PUBLISHED/ARCHIVED)
-- Phải DROP CHECK trước khi UPDATE, không thì bản ghi mới vi phạm ràng buộc cũ.
ALTER TABLE templates DROP CONSTRAINT IF EXISTS templates_status_check;
UPDATE templates SET status = upper(status);
UPDATE templates SET status = 'PUBLISHED' WHERE status IS NULL OR status = '';
ALTER TABLE templates ALTER COLUMN status SET DEFAULT 'DRAFT';
ALTER TABLE templates ADD  CONSTRAINT templates_status_check CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'));

-- ============================================================
-- 2. WEDDINGS – slug công khai, FK template, status 4 trạng thái
-- ============================================================

-- template_id cũ là VARCHAR chứa khóa registry -> đổi tên thành template_key.
-- RENAME không idempotent nên phải kiểm tra: lần chạy sau đã có cả 2 cột thì bỏ qua.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name = 'weddings' AND column_name = 'template_key') THEN
        RAISE NOTICE 'weddings.template_key đã tồn tại — bỏ qua rename';
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'weddings' AND column_name = 'template_id') THEN
        ALTER TABLE weddings RENAME COLUMN template_id TO template_key;
    END IF;
END $$;

ALTER TABLE weddings ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES templates(id) ON DELETE SET NULL;

-- template_key bỏ NOT NULL + bỏ default: giá trị registry không còn bắt buộc,
-- thiệp dùng mẫu custom sẽ chỉ có template_id.
ALTER TABLE weddings ALTER COLUMN template_key DROP NOT NULL;
ALTER TABLE weddings ALTER COLUMN template_key DROP DEFAULT;

-- nối mẫu hệ thống: template_key -> template_id UUID
UPDATE weddings w SET template_id = t.id
FROM templates t
WHERE w.template_id IS NULL AND w.template_key IS NOT NULL AND t.template_key = w.template_key;

-- slug công khai
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS slug VARCHAR(180);
UPDATE weddings SET slug = COALESCE(NULLIF(slug, ''), lower(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g')))
WHERE slug IS NULL OR slug = '';
UPDATE weddings SET slug = 'wedding-' || id WHERE slug IS NULL OR slug = '';
UPDATE weddings w SET slug = w.slug || '-' || sub.cnt
FROM (SELECT id, row_number() OVER (PARTITION BY slug ORDER BY created_at, id) AS cnt
      FROM weddings) sub
WHERE w.id = sub.id AND sub.cnt > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_template_id ON weddings(template_id);
CREATE INDEX IF NOT EXISTS idx_weddings_status ON weddings(status);

-- status VIẾT HOA + thêm UNPUBLISHED (bỏ xuất bản nhưng giữ nguyên dữ liệu)
ALTER TABLE weddings DROP CONSTRAINT IF EXISTS weddings_status_check;
UPDATE weddings SET status = upper(status);
ALTER TABLE weddings ADD  CONSTRAINT weddings_status_check
    CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'));

-- ============================================================
-- 3. ARTICLES – dùng chung cho Explore (EXPLORE) và Share (SHARE)
--    spec 02-explore-level2 + 03-share-level2: cùng hạ tầng, khác contentType
-- ============================================================

CREATE TABLE IF NOT EXISTS articles (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(20)  NOT NULL DEFAULT 'EXPLORE' CHECK (content_type IN ('EXPLORE', 'SHARE')),
    title        VARCHAR(255) NOT NULL,
    slug         VARCHAR(200) NOT NULL,
    excerpt      TEXT         NOT NULL DEFAULT '',
    content      TEXT         NOT NULL DEFAULT '',
    cover_image  TEXT,
    category     VARCHAR(100) NOT NULL DEFAULT '',
    tags         JSONB        NOT NULL DEFAULT '[]',
    location     VARCHAR(200) NOT NULL DEFAULT '',
    author_id    UUID         REFERENCES users(id) ON DELETE SET NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_type_status ON articles(content_type, status);

ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_status_check;
ALTER TABLE articles ADD  CONSTRAINT articles_status_check
    CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'));

-- ============================================================
-- 4. PHOTOGRAPHY – collection + photo
--    spec 01-photography-level2: KHÔNG ép vào cấu trúc article
-- ============================================================

CREATE TABLE IF NOT EXISTS photography_collections (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title          VARCHAR(255) NOT NULL,
    slug           VARCHAR(200) NOT NULL,
    description    TEXT         NOT NULL DEFAULT '',
    category       VARCHAR(100) NOT NULL DEFAULT 'Wedding',
    cover_photo_id UUID,
    location       VARCHAR(200) NOT NULL DEFAULT '',
    shoot_date     DATE,
    photographer   VARCHAR(200) NOT NULL DEFAULT '',
    tags           JSONB        NOT NULL DEFAULT '[]',
    status         VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    published_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_photography_collections_slug ON photography_collections(slug);
CREATE INDEX IF NOT EXISTS idx_photography_collections_status ON photography_collections(status);

ALTER TABLE photography_collections DROP CONSTRAINT IF EXISTS photography_collections_status_check;
ALTER TABLE photography_collections ADD  CONSTRAINT photography_collections_status_check
    CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'));

CREATE TABLE IF NOT EXISTS photos (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID         NOT NULL REFERENCES photography_collections(id) ON DELETE CASCADE,
    image_url     TEXT         NOT NULL,
    alt_text      TEXT         NOT NULL DEFAULT '',
    caption       TEXT         NOT NULL DEFAULT '',
    width         INTEGER,
    height        INTEGER,
    sort_order    INTEGER      NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_collection ON photos(collection_id, sort_order);

-- cover_photo_id trỏ về chính bảng photos (FK thêm sau vì photos vừa tạo)
ALTER TABLE photography_collections
    DROP CONSTRAINT IF EXISTS photography_collections_cover_photo_id_fkey;
ALTER TABLE photography_collections
    ADD CONSTRAINT photography_collections_cover_photo_id_fkey
    FOREIGN KEY (cover_photo_id) REFERENCES photos(id) ON DELETE SET NULL;

-- ============================================================
-- 5. BOOKINGS – khách gửi không cần đăng nhập (spec 04-services-level2)
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           VARCHAR(255) NOT NULL,
    contact        VARCHAR(255) NOT NULL,
    email          VARCHAR(255),
    phone          VARCHAR(50),
    service        VARCHAR(100) NOT NULL,
    preferred_date DATE,
    location       VARCHAR(200) NOT NULL DEFAULT '',
    budget         VARCHAR(100) NOT NULL DEFAULT '',
    message        TEXT         NOT NULL DEFAULT '',
    source         VARCHAR(100) NOT NULL DEFAULT 'website',
    status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status, created_at DESC);

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD  CONSTRAINT bookings_status_check
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'));

COMMIT;
