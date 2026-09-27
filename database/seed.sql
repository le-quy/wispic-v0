-- ============================================================
-- WISPIC – Seed Data (dữ liệu mặc định)
-- Chạy sau init.sql
-- ============================================================

-- ============================================================
-- 1. Tài khoản mặc định
--
-- Mật khẩu: admin / user (hash scrypt, sinh bằng
-- `node --env-file=.env --experimental-strip-types scripts/hash-passwords.ts --print "admin" "user"`)
-- ============================================================
INSERT INTO users (id, email, password_hash, name, role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin@local.com',
     'scrypt$16384$8$1$SuOKtiV/umc65QdoL1V7PQ==$s4rizhKwzLJzDv8a9uY59OwDvnSgUOL4DZgh9e1OirxExt2EiqsGfrFS+/rQa1YrEF7CqGFRGHPqNSte5zXpqA==',
     'Quản trị viên', 'admin'),
    ('a0000000-0000-0000-0000-000000000002', 'user@local.com',
     'scrypt$16384$8$1$ZkgoK5vu0pxJv/tC7lW46w==$NqE14i/q6oApZgNmqFniiS0isWlMGRrlWO68m+TaX6LfHdnGSM2gIrpb+gVZGj5Y34Qyt5qoDX6rZyCRbAa6DA==',
     'Người dùng', 'user')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- 2. Templates hệ thống (system templates)
-- ============================================================
-- template_key: khoá trỏ tới component React trong lib/template-registry.tsx
-- (3 mẫu hệ thống), NULL = mẫu custom do admin soạn.
INSERT INTO templates (id, name, slug, template_key, category, description, swatches, accent, html, css, is_custom, status) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Lãng mạn',
    'lang-man',
    'romantic',
    'Editorial',
    'Serif duyên dáng, ảnh toàn màn hình, phong cách nhiếp ảnh.',
    '["#f7f3ee", "#302b27"]',
    '#9b8878',
    '',
    '',
    false,
    'PUBLISHED'
),
(
    '00000000-0000-0000-0000-000000000002',
    'Thanh xuân',
    'thanh-xuan',
    'modern',
    'Hiện đại',
    'Bố cục lệch tối giản, trắng – than và điểm nhấn cam đất.',
    '["#fbfaf7", "#1f1d1b"]',
    '#d97832',
    '',
    '',
    false,
    'PUBLISHED'
),
(
    '00000000-0000-0000-0000-000000000003',
    'Song Hỷ',
    'song-hy',
    'traditional',
    'Truyền thống',
    'Đỏ son – vàng kim, kính mời song thân, nét Việt trang trọng.',
    '["#7d1f1f", "#e8c15a"]',
    '#c9a227',
    '',
    '',
    false,
    'PUBLISHED'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. Template admin dạng sections (tham khảo)
-- Cấu trúc: sections = [ { key, html, css? } ] theo thứ tự hiển thị
-- Cú pháp: {{var}}, {{#if var}}, {{#each photos}} {{this.url}}, {{#widget key}}
-- ============================================================
INSERT INTO templates (id, name, slug, category, description, swatches, accent, html, css, sections, is_custom, status) VALUES
(
    '00000000-0000-0000-0000-000000000100',
    'Minh & Vy (mẫu sections)',
    'minh-vy-mau-sections',
    'Editorial',
    'Mẫu admin soạn theo từng section: hero, couple, countdown widget, guestbook widget và closing.',
    '["#f7efe6", "#2b2620"]',
    '#b0754f',
    '',
    '.wt-hero .wt-hero__eyebrow::after { content: ""; display: block; width: 3rem; height: 1px; background: var(--wt-accent); margin: 0.75rem auto 0; }',
    '[
        {
            "key": "hero",
            "html": "<section class=\"wt-hero\">\n  <p class=\"wt-hero__eyebrow wt-eyebrow\">WE ARE GETTING MARRIED</p>\n  <h1 class=\"wt-hero__title\">{{groom}} & {{bride}}</h1>\n  <p class=\"wt-hero__date\">{{weddingDate}}</p>\n  {{#if location.venueName}}<p class=\"wt-hero__venue wt-muted\">{{location.venueName}}</p>{{/if}}\n</section>",
            "css": ""
        },
        {
            "key": "couple",
            "html": "<section class=\"wt-couple\">\n  <p class=\"wt-eyebrow\">Đôi lời</p>\n  <h3 class=\"wt-couple__names\">{{groom}} <span>&</span> {{bride}}</h3>\n  {{#if coupleStory}}<p class=\"wt-muted wt-couple__story\">{{coupleStory}}</p>{{/if}}\n</section>",
            "css": ""
        },
        {
            "key": "countdown",
            "html": "<section class=\"wt-countdown\">\n  <p class=\"wt-eyebrow\">Đếm ngược</p>\n  <h2 class=\"wt-countdown__title\">Khoảnh khắc của chúng mình</h2>\n  {{#widget countdown}}\n</section>",
            "css": ""
        },
        {
            "key": "guestbook",
            "html": "<section class=\"wt-guestbook\">\n  <p class=\"wt-eyebrow\">Guestbook</p>\n  <h2 class=\"wt-guestbook__title\">Lời chúc dành cho chúng mình</h2>\n  {{#widget guestbook}}\n</section>",
            "css": ""
        },
        {
            "key": "closing",
            "html": "<section class=\"wt-closing\">\n  {{#if introduction}}<p class=\"wt-muted\">{{introduction}}</p>{{/if}}\n  <p class=\"wt-eyebrow\">Hẹn gặp lại</p>\n  <p class=\"wt-closing__names\">{{groom}} & {{bride}}</p>\n</section>",
            "css": ""
        }
    ]',
    true,
    'PUBLISHED'
)
ON CONFLICT (id) DO NOTHING;
