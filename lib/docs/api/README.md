# API & Library Docs — Wispic

Thư mục tài liệu化的 API và library cho dự án **Wispic Wedding**.

## Cấu trúc

```
lib/docs/api/
├── README.md          ← Bạn đang đọc đây
├── endpoints.md       ← Tài liệu chi tiết từng API endpoint
└── libraries.md       ← Tài liệu các lib (db, session, storage)
```

## Tổng quan kiến trúc

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│                                                              │
│  wedding-list.tsx ──┐                                        │
│  wedding-editor.tsx ─┼── lib/wedding-storage.ts ──┐         │
│  wedding-create.tsx ─┘                             │         │
│                                                    │ fetch() │
│  editor-shared.tsx ──┐                             │         │
│  template-manager.tsx┼── lib/admin-template-storage┤         │
│  admin-template.tsx ─┘                             │         │
│                                                    │         │
│  login-form.tsx ──────── direct fetch ─────────────┤         │
│  sign-up-form.tsx ────── direct fetch ─────────────┤         │
│  site-header.tsx ─────── direct fetch ─────────────┤         │
│  logout-button.tsx ───── direct fetch ─────────────┘         │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│               NEXT.JS API ROUTES (Server)                    │
│                                                              │
│  /api/weddings        ───┐                                   │
│  /api/weddings/[id]   ───┤                                   │
│  /api/templates       ───┼── lib/db.ts (PostgreSQL pool)     │
│  /api/templates/[id]  ───┤         │                         │
│  /api/auth/login      ───┤         ▼                         │
│  /api/auth/register   ───┤    ┌──────────┐                   │
│  /api/auth/logout     ───┤    │ PostgreSQL│                   │
│  /api/auth/me         ───┘    │ Database  │                   │
│                               │ "wicpic"  │                   │
│  lib/session.ts ──────────────┤          │                   │
│                                └──────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

## API Endpoints

| Endpoint | Methods | Mô tả | Chi tiết |
|----------|---------|--------|----------|
| `/api/auth/login` | POST | Đăng nhập | [→](#post-apiauthlogin) |
| `/api/auth/register` | POST | Đăng ký | [→](#post-apiauthregister) |
| `/api/auth/logout` | POST | Đăng xuất | [→](#post-apiauthlogout) |
| `/api/auth/me` | GET | Kiểm tra session | [→](#get-apiauthme) |
| `/api/weddings` | GET, POST | List / tạo thiệp | [→](#getapeweddings) |
| `/api/weddings/[id]` | GET, PUT, DELETE | CRUD thiệp | [→](#getapeweddingsid) |
| `/api/templates` | GET, POST | List / tạo template | [→](#getapitemplates) |
| `/api/templates/[id]` | GET, PUT, DELETE | CRUD template | [→](#getapitemplatesid) |

## Database Tables

| Bảng | Mô tả | Quan hệ |
|------|--------|---------|
| `users` | Tài khoản | ← weddings.user_id |
| `templates` | Mẫu thiệp (admin custom) | |
| `weddings` | Thiệp cưới chính | FK → users |
| `wedding_photos` | Ảnh gallery | FK → weddings |
| `rsvp_questions` | Câu hỏi RSVP | FK → weddings |
| `rsvp_responses` | Phản hồi RSVP | FK → weddings |
| `gift_accounts` | Tài khoản mừng cưới | FK → weddings |
| `timeline_events` | Lịch trình | FK → weddings |
| `dress_code_colors` | Màu dress code | FK → weddings |
| `guestbook_entries` | Lời chúc | FK → weddings |
| `guestbook_questions` | Câu hỏi guestbook | FK → weddings |

Xem chi tiết tại `database/init.sql`.
