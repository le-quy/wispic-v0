-- ============================================================
-- WISPIC – Migration: fix weddings table schema
-- Chạy nếu bạn ĐÃ tạo database bằng init.sql phiên bản cũ
-- ============================================================

BEGIN;

-- Bỏ FK cũ trên template_id (thay bằng VARCHAR để hỗ trợ cả ID hệ thống + tùy chỉnh)
ALTER TABLE weddings DROP CONSTRAINT IF EXISTS weddings_template_id_fkey;

ALTER TABLE weddings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE weddings ALTER COLUMN template_id DROP DEFAULT;
ALTER TABLE weddings ALTER COLUMN template_id TYPE VARCHAR(100) USING template_id::VARCHAR;
ALTER TABLE weddings ALTER COLUMN template_id SET DEFAULT 'romantic';

-- Xoá tất cả weddings cũ (nếu có) để tránh xung đột UUID
DELETE FROM weddings;

COMMIT;