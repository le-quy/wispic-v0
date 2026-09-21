# WISPIC — Bản đồ route theo role

Tài liệu tham khảo để **vào file đọc / làm việc**. Xác định role → mở mục tương ứng → theo file path.

## 1. Cơ chế role & auth (đọc trước)

| Khái niệm | Chi tiết |
|---|---|
| 2 role | `admin` và `user`, lưu ở cột `users.role` |
| Local demo | `admin@local.com / admin`, `user@local.com / user` — định nghĩa trong **`lib/local-auth.ts`** |
| Session thật | Cookie `wispic_session` = `users.id`. Đọc role bằng **`lib/session.ts`** (`getSessionUser`, `getCurrentRole`, `getCurrentUserId`) |
| Guard pattern | Server page gọi `getSessionUser()/getCurrentRole()` rồi `redirect('/dashboard')` nếu thiếu quyền. **Không có middleware** — guard nằm ngay trong từng page |
| Bypass demo | Param `?as=admin` (hoặc `?role=admin`) cho phép mở trang admin khi không đủ role |

> Tài khoản mặc định nằm trong **`database/seed.sql`** (dòng 9-12): 2 users admin + user.

---

## 2. Route dùng chung (mọi role / chưa đăng nhập)

| Route | File (TSX) | Chức năng |
|---|---|---|
| `/` | `app/page.tsx` | Landing page (components: `hero, features, how-it-works, template-showcase, faq, testimonials, final-cta`) |
| `/auth/login` | `app/auth/login/page.tsx` + `components/login-form.tsx` | Đăng nhập |
| `/auth/sign-up` | `app/auth/sign-up/page.tsx` + `components/sign-up-form.tsx` | Đăng ký |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` + `components/forgot-password-form.tsx` | Quên mật khẩu |
| `/auth/update-password` | `app/auth/update-password/page.tsx` + `components/update-password-form.tsx` | Cập nhật mật khẩu |
| `/auth/sign-up-success` | `app/auth/sign-up-success/page.tsx` | Thông báo đăng ký xong |
| `/auth/error` | `app/auth/error/page.tsx` | Trang lỗi auth |
| `/auth/confirm` | `app/auth/confirm/route.ts` (route handler) | Verify OTP token (Supabase) |
| `/preview` | `app/preview/page.tsx` | Demo thiệp romantic với `demoWedding` (không cần đăng nhập) |

### API auth dùng chung

| Route | File | Chức năng |
|---|---|---|
| `POST /api/auth/login` | `app/api/auth/login/route.ts` | Xác thực, ghi cookie session |
| `POST /api/auth/register` | `app/api/auth/register/route.ts` | Tạo user mới |
| `GET /api/auth/me` | `app/api/auth/me/route.ts` | Trả user hiện tại theo session |
| `POST /api/auth/logout` | `app/api/auth/logout/route.ts` | Xoá session |

---

## 3. Role: USER (cặp đôi — làm thiệp)

Truy cập: mọi route dưới `/dashboard` (trừ `/dashboard/templates`).

| Route | File (TSX) | Chức năng triển khai chính |
|---|---|---|
| `/dashboard` | `app/dashboard/page.tsx` → **`app/dashboard/wedding-list.tsx`** | Danh sách thiệp của user (dùng trong `WeddingList`) |
| `/dashboard/create` | `app/dashboard/create/page.tsx` → **`app/dashboard/create/wedding-create-form.tsx`** | Tạo thiệp mới, chọn template (**`CreateWedding`**) |
| `/dashboard/[id]/edit` | `app/dashboard/[id]/edit/page.tsx` → **`app/dashboard/[id]/edit/wedding-editor.tsx`** | Chỉnh sửa toàn bộ nội dung thiệp (**`WeddingEditor`**) |
| `/dashboard/[id]/preview` | `app/dashboard/[id]/preview/page.tsx` → **`app/dashboard/[id]/preview/wedding-preview.tsx`** | Xem trước thiệp published (**`WeddingPreview`**) |
| Layout chung | `app/dashboard/layout.tsx` | Nav dashboard: hiện tab "Quản lý mẫu" **chỉ khi admin** |

### Các file hỗ trợ user (components/wedding)

| File | Export chính | Chức năng |
|---|---|---|
| `components/wedding/editor-shared.tsx` | `Section, CollapsibleSection, TemplateGallery, TemplatePreview, PhotoPicker, GalleryManager, RsvpEditor, GiftEditor, TimelineEditor, DressCodeEditor, MusicEditor, GuestbookEditor, EnvelopeEditor, OgImageEditor, MapEditor, PhoneMockupPreview, EditorQuickNav, useTemplateInfo, inputCls/labelCls/textareaCls` | Toàn bộ UI block chỉnh nội dung & preview |
| `components/wedding/wedding-extra-sections.tsx` | `WeddingExtraSections`, `Countdown` | Widget countdown + các section phụ |
| `components/wedding/custom-template-renderer.tsx` | `CustomTemplateRenderer` | Render template admin (sections hoặc html đơn) trong iframe |
| `components/wedding/romantic-template.tsx` / `modern-template.tsx` / `traditional-template.tsx` | default components | 3 template hệ thống (React) |
| `components/wedding/template-image.tsx` | `TemplateImage` | Ảnh đại diện template |

### Storage + data (user)

| File | Export chính | Chức năng |
|---|---|---|
| `lib/wedding-storage.ts` | `WeddingDraft`, `readWeddings, readWedding, saveWedding, createWedding, deleteWedding, createDraftFromTemplate, ensureDraftDefaults, toWeddingData, summaryFromDraft, newPhoto` | Client storage → gọi `/api/weddings` |
| `lib/wedding-data.ts` | `WeddingData`, `demoWedding`, các `DEFAULT_*` | Kiểu dữ liệu + dữ liệu mẫu |
| `lib/template-registry.tsx` | `renderWeddingTemplate, getTemplateInfo` | Chọn template hệ thống theo `templateId` |

### API (user)

| Route | File | Chức năng |
|---|---|---|
| `GET/POST /api/weddings` | `app/api/weddings/route.ts` | List (lọc `userId`/`status`) / tạo thiệp kèm sub-tables |
| `GET/PUT/DELETE /api/weddings/[id]` | `app/api/weddings/[id]/route.ts` | Đọc / cập nhật / xoá thiệp |

> Ghi chú: bảng `weddings` + sub-tables (`wedding_photos, rsvp_questions, gift_accounts, timeline_events, dress_code_colors, guestbook_questions`) — xem **`database/init.sql`**.

---

## 4. Role: ADMIN (quản lý mẫu)

Bao gồm toàn bộ mục **User** + các route admin dưới đây.

| Route | File (TSX) | Chức năng triển khai chính |
|---|---|---|
| `/dashboard/templates` | `app/dashboard/templates/page.tsx` (guard) → **`app/dashboard/templates/template-manager.tsx`** | Danh sách + tạo / nhân bản / xoá mẫu (**`TemplateManager`**) |
| `/dashboard/templates/[id]/edit` | `app/dashboard/templates/[id]/edit/page.tsx` (guard) → **`app/dashboard/templates/[id]/edit/admin-template-editor.tsx`** | **Section Builder**: soạn từng section, sắp xếp, widget, variables (**`AdminTemplateEditor`**) |

> Guard admin nằm ở `app/dashboard/templates/page.tsx:14` và `app/dashboard/templates/[id]/edit/page.tsx:18` (kiểm `role !== 'admin'` → `redirect`).

### Các file hỗ trợ admin

| File | Export chính | Chức năng |
|---|---|---|
| `lib/admin-template-storage.ts` | `AdminTemplate`, `readAdminTemplates, readAdminTemplate, saveAdminTemplate, deleteAdminTemplate, createAdminTemplate` | Client storage → gọi `/api/templates`; mẫu mới khởi tạo `defaultTemplateSections()` |
| `lib/template-sections.ts` | `TemplateSection`, `TEMPLATE_SECTION_DEFS` (16 section), `defaultTemplateSections, defaultSectionHtml, isWidgetSection, getSectionDef` | Registry các canonical section |
| `lib/template-engine.ts` | `renderTemplateSections, renderCustomTemplate, buildVars, TEMPLATE_VARIABLES` + widget renderers | Render HTML + widget (`{{#widget key}}`), template syntax `{{var}}/{{#if}}/{{#each}}` |
| `docs/template-spec.md` | — | Contract soạn HTML từng section (để đưa agent sinh HTML) |

### API (admin)

| Route | File | Chức năng |
|---|---|---|
| `GET/POST /api/templates` | `app/api/templates/route.ts` | List / tạo template (lưu `sections` JSONB) |
| `GET/PUT/DELETE /api/templates/[id]` | `app/api/templates/[id]/route.ts` | Đọc / cập nhật / xoá template |

> Migration thêm cột `sections` JSONB: **`database/migration-2026-09-22-template-sections.sql`**. Mẫu admin tham khảo (sections) trong **`database/seed.sql`** (id `...000100`).

---

## 5. Sơ đồ gọi file khi làm việc

```
Admin edit mẫu:      /dashboard/templates/[id]/edit
   → admin-template-editor.tsx (UI + Section Builder)
      → lib/admin-template-storage.ts (fetch)
         → app/api/templates/** (DB)
      → lib/template-sections.ts (registry)
      → lib/template-engine.ts (render preview)
      → docs/template-spec.md (quy ước HTML)

User edit thiệp:     /dashboard/[id]/edit
   → wedding-editor.tsx (UI)
      → components/wedding/editor-shared.tsx (Section/Collapsible/editors)
      → components/wedding/wedding-extra-sections.tsx (Countdown...)
      → lib/wedding-storage.ts (fetch)
         → app/api/weddings/** (DB)
      → TemplatePreview → editor-shared / custom-template-renderer
```

## 6. Kiểm tra nhanh trước khi sửa

```bash
npx tsc --noEmit   # typecheck
npm run lint       # eslint
npm run build      # build production
```