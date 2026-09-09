-- ============================================================
-- WISPIC – Seed Data (dữ liệu mặc định)
-- Chạy sau init.sql
-- ============================================================

-- ============================================================
-- 1. Tài khoản mặc định
-- ============================================================
INSERT INTO users (id, email, password, name, role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin@local.com', 'admin', 'Quản trị viên', 'admin'),
    ('a0000000-0000-0000-0000-000000000002', 'user@local.com',  'user',  'Người dùng',    'user')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- 2. Templates hệ thống (system templates)
-- ============================================================
INSERT INTO templates (id, name, category, description, swatches, accent, html, css, is_custom) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Lãng mạn',
    'Editorial',
    'Serif duyên dáng, ảnh toàn màn hình, phong cách nhiếp ảnh.',
    '["#f7f3ee", "#302b27"]',
    '#9b8878',
    '',
    '',
    false
),
(
    '00000000-0000-0000-0000-000000000002',
    'Thanh xuân',
    'Hiện đại',
    'Bố cục lệch tối giản, trắng – than và điểm nhấn cam đất.',
    '["#fbfaf7", "#1f1d1b"]',
    '#d97832',
    '',
    '',
    false
),
(
    '00000000-0000-0000-0000-000000000003',
    'Song Hỷ',
    'Truyền thống',
    'Đỏ son – vàng kim, kính mời song thân, nét Việt trang trọng.',
    '["#7d1f1f", "#e8c15a"]',
    '#c9a227',
    '',
    '',
    false
)
ON CONFLICT (id) DO NOTHING;
