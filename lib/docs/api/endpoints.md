# API Reference — Wispic

Mục lục:

- [auth/login](#post-apiauthlogin)
- [auth/register](#post-apiauthregister)
- [auth/logout](#post-apiauthlogout)
- [auth/me](#get-apiauthme)
- [weddings](#getapeweddings)
- [weddings/[id]](#getapeweddingsid)
- [templates](#getapitemplates)
- [templates/[id]](#getapitemplatesid)

---

## `POST /api/auth/login`

Đăng nhập, trả về thông tin user và set cookie `wispic_session` (httpOnly, 7 ngày).

**Request body:**
```json
{ "email": "string", "password": "string" }
```

**Response 200:**
```json
{ "id": "uuid", "email": "string", "name": "string", "role": "admin" | "user" }
```

**Sử dụng tại:**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `components/login-form.tsx` | `LoginForm.handleLogin()` | Form đăng nhập gửi credential lên API |

---

## `POST /api/auth/register`

Đăng ký tài khoản mới (role mặc định: `user`).

**Request body:**
```json
{ "email": "string", "password": "string", "name?": "string" }
```

**Response 201:**
```json
{ "id": "uuid", "email": "string", "name": "string", "role": "user" }
```

**Sử dụng tại:**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `components/sign-up-form.tsx` | `SignUpForm.handleSignUp()` | Form đăng ký gửi thông tin lên API |

---

## `POST /api/auth/logout`

Xoá cookie `wispic_session`, đăng xuất.

**Response 200:**
```json
{ "success": true }
```

**Sử dụng tại:**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `components/logout-button.tsx` | `LogoutButton.logout()` | Nút "Đăng xuất" trong dashboard |
| `components/site-header.tsx` | `SiteHeader.handleLogout()` | Nút "Đăng xuất" trên header trang chủ |

---

## `GET /api/auth/me`

Kiểm tra session hiện tại, trả về user đang đăng nhập (hoặc 401).

**Response 200:**
```json
{ "id": "uuid", "email": "string", "name": "string", "role": "admin" | "user" }
```

**Sử dụng tại:**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `components/site-header.tsx` | `SiteHeader.sync()` | Kiểm tra trạng thái đăng nhập để hiển thị nút Login/Logout |
| `app/dashboard/create/wedding-create-form.tsx` | `CreateWedding.handleSave()` | Lấy userId để gán vào thiệp cưới khi tạo mới |
| `app/dashboard/wedding-list.tsx` | `WeddingList useEffect` | Xác định role user để lọc danh sách thiệp (admin thấy tất cả) |

---

## `GET /api/weddings`

Danh sách tất cả thiệp cưới. Hỗ trợ query params: `?userId=`, `?status=`.

**Response 200:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid | null",
    "templateId": "string",
    "title": "string",
    "status": "draft" | "published",
    "groom": "string",
    "bride": "string",
    "weddingDate": "string",
    "ceremony": { "time": "string", "date": "string" },
    "reception": { "time": "string", "description": "string" },
    "location": { "city": "string", "province": "string", "venueName": "string" },
    "photos": [...],
    "rsvp": { "enabled": true, "displayMode": "button", "maxGuestCount": 5, "questions": [...] },
    "gift": { "enabled": true, "displayMode": "button", "title": "string", "accounts": [...] },
    "timeline": [...],
    "dressCode": { "enabled": true, "title": "string", "subtitle": "string", "colors": [...] },
    "music": { "enabled": false, "url": "", "title": "" },
    "guestbook": { "enabled": true, "questions": [...] },
    "envelope": { "greeting": "string" },
    "og": { "style": "envelope" | "photo", "customUrl": "" },
    "map": { "embedUrl": "", "address": "" },
    "createdAt": 1234567890,
    "updatedAt": 1234567890
  }
]
```

**Sử dụng tại (qua `lib/wedding-storage.ts` → `readWeddings()`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/wedding-list.tsx` | `WeddingList useEffect` | Load danh sách thiệp trên dashboard |

---

## `POST /api/weddings`

Tạo thiệp cưới mới. Client cung cấp `id` (UUID).

**Request body:** Toàn bộ WeddingDraft (xem response GET ở trên)

**Response 201:** Wedding object vừa tạo

**Sử dụng tại (qua `lib/wedding-storage.ts` → `createWedding()`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/create/wedding-create-form.tsx` | `CreateWedding.handleSave()` | Lưu thiệp mới sau khi nhập thông tin |

---

## `GET /api/weddings/[id]`

Lấy chi tiết một thiệp cưới theo ID.

**Response 200:** Wedding object (xem schema ở GET /api/weddings)
**Response 404:** `{ "error": "Not found" }`

**Sử dụng tại (qua `lib/wedding-storage.ts` → `readWedding(id)`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/[id]/edit/wedding-editor.tsx` | `WeddingEditor useEffect` | Load dữ liệu thiệp khi mở trang chỉnh sửa |
| `app/dashboard/[id]/preview/wedding-preview.tsx` | `WeddingPreview useEffect` | Load dữ liệu thiệp khi xem trước |

---

## `PUT /api/weddings/[id]`

Cập nhật thiệp cưới. Xoá toàn bộ sub-tables cũ (photos, rsvp_questions, gift_accounts, timeline_events, dress_code_colors, guestbook_questions) rồi tạo lại.

**Request body:** Toàn bộ WeddingDraft
**Response 200:** Wedding object đã cập nhật

**Sử dụng tại (qua `lib/wedding-storage.ts` → `saveWedding(draft)`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/[id]/edit/wedding-editor.tsx` | `WeddingEditor` — autosave effect, `togglePublish()`, `forceSaveAndGoBack()` | Auto-lưu khi chỉnh sửa, chuyển trạng thái draft/published, lưu & quay lại |

---

## `DELETE /api/weddings/[id]`

Xoá thi cưới và toàn bộ dữ liệu liên quan (cascade).

**Response 200:** `{ "success": true }`

**Sử dụng tại (qua `lib/wedding-storage.ts` → `deleteWedding(id)`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/[id]/edit/wedding-editor.tsx` | `WeddingEditor.removeDraft()` | Nút xoá thiệp trong trang chỉnh sửa |
| `app/dashboard/wedding-list.tsx` | `WeddingList.handleDelete()` | Nút xoá thiệp trên danh sách |

---

## `GET /api/templates`

Danh sách tất cả templates (system + custom).

**Response 200:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "category": "string",
    "description": "string",
    "swatches": ["#fff", "#000"],
    "accent": "#9b8878",
    "html": "string",
    "css": "string",
    "isCustom": true,
    "createdAt": 1234567890,
    "updatedAt": 1234567890
  }
]
```

**Sử dụng tại (qua `lib/admin-template-storage.ts` → `readAdminTemplates()`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/templates/template-manager.tsx` | `TemplateManager useEffect` | Hiển thị danh sách mẫu tùy chỉnh |
| `components/wedding/editor-shared.tsx` | `TemplateGallery`, `TemplatePreview`, `useTemplateInfo()` | Hiển thị tất cả mẫu khi chọn template cho thiệp |
| `app/dashboard/[id]/preview/wedding-preview.tsx` | `CustomTemplateRenderer useEffect` | Load template tùy chỉnh khi xem trước |

---

## `POST /api/templates`

Tạo template mới.

**Request body:** AdminTemplate object
**Response 201:** Template vừa tạo

**Sử dụng tại (qua `lib/admin-template-storage.ts` → `saveAdminTemplate()`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/templates/template-manager.tsx` | `TemplateManager.handleCreate()`, `handleDuplicate()` | Tạo mới hoặc nhân bản mẫu |

---

## `GET /api/templates/[id]`

Lấy chi tiết template theo ID.

**Response 200:** AdminTemplate object
**Response 404:** `{ "error": "Not found" }`

**Sử dụng tại (qua `lib/admin-template-storage.ts` → `readAdminTemplate(id)`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/templates/[id]/edit/admin-template-editor.tsx` | `AdminTemplateEditor useEffect` | Load template khi mở trang chỉnh sửa |

---

## `PUT /api/templates/[id]`

Cập nhật template.

**Request body:** AdminTemplate object
**Response 200:** Template đã cập nhật

**Sử dụng tại (qua `lib/admin-template-storage.ts` → `saveAdminTemplate()`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/templates/[id]/edit/admin-template-editor.tsx` | `AdminTemplateEditor` — autosave effect, `forceSave()` | Auto-lưu khi chỉnh sửa code HTML/CSS |

---

## `DELETE /api/templates/[id]`

Xoá template.

**Response 200:** `{ "success": true }`

**Sử dụng tại (qua `lib/admin-template-storage.ts` → `deleteAdminTemplate()`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/templates/[id]/edit/admin-template-editor.tsx` | `AdminTemplateEditor.removeTemplate()` | Nút xoá trong trang chỉnh sửa |
| `app/dashboard/templates/template-manager.tsx` | `TemplateManager.handleDelete()` | Nút xoá trên danh sách |
