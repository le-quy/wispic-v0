-- ============================================================
-- WISPIC – Migration: template sections (admin tạo mẫu theo section)
-- Thêm cột sections JSONB để lưu mẫu dạng mảng section có thứ tự.
-- Chạy một lần: psql -f database/migration-2026-09-22-template-sections.sql
-- ============================================================

BEGIN;

ALTER TABLE templates
    ADD COLUMN IF NOT EXISTS sections JSONB NOT NULL DEFAULT '[]';

COMMIT;