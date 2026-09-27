-- ============================================================
-- WISPIC – Migration: sessions thật + hash mật khẩu + lifecycle template
-- Ngày: 2026-09-26
--
-- Mục đích (spec 08-user-roles-and-permissions.md):
--   - Session không còn là `user.id` trần trong cookie
--   - Mật khẩu không còn lưu plaintext
--   - Template có vòng đời DRAFT/PUBLISHED/ARCHIVED như spec 06
--
-- THỨ TỰ BẮT BUỘC:
--   1. Chạy file này
--   2. Chạy `node scripts/hash-passwords.ts --migrate`
--      (script chỉ DROP COLUMN users.password khi không còn user plaintext nào)
--   3. Trên DB mới thì dùng seed.sql đã cập nhật hash, KHÔNG cần bước 2
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. users.password_hash
--    NULL = chưa đặt mật khẩu (bắt user reset) — cột `password` cũ giữ lại
--    tới khi script backfill xong mới drop.
-- ------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- ------------------------------------------------------------
-- 2. sessions – token ngẫu nhiên thay cho user id
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    token        TEXT PRIMARY KEY,
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at   TIMESTAMPTZ NOT NULL,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id   ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- ------------------------------------------------------------
-- 3. templates: status + created_by / updated_by
--    Mặc định 'published' để các template đang tồn tại vẫn hiện.
-- ------------------------------------------------------------
ALTER TABLE templates ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published';
ALTER TABLE templates DROP CONSTRAINT IF EXISTS templates_status_check;
ALTER TABLE templates ADD  CONSTRAINT templates_status_check CHECK (status IN ('draft', 'published', 'archived'));

ALTER TABLE templates ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);

-- ------------------------------------------------------------
-- 4. Dọn index thừa (UNIQUE email đã có index riêng)
-- ------------------------------------------------------------
DROP INDEX IF EXISTS idx_users_email;

-- ------------------------------------------------------------
-- 5. Server cấp id — client không tự chọn được khoá chính
-- ------------------------------------------------------------
ALTER TABLE weddings ALTER COLUMN id SET DEFAULT gen_random_uuid();

COMMIT;
