# Library Reference — Wispic

Mục lục:

- [lib/db.ts](#libdbts)
- [lib/session.ts](#libsessionts)
- [lib/wedding-storage.ts](#libwedding-storagets)
- [lib/admin-template-storage.ts](#libadmin-template-storagets)

---

## `lib/db.ts`

PostgreSQL connection pool (`pg` package). Dùng chung cho tất cả API routes.

**Exports:** `Pool` instance (default export)

**Config:** Đọc từ env vars `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

**Sử dụng tại:**

| File | Mục đích |
|------|----------|
| `lib/session.ts` | Truy vấn bảng `users` để xác thực session |
| `app/api/weddings/route.ts` | CRUD weddings + sub-tables |
| `app/api/weddings/[id]/route.ts` | GET/PUT/DELETE wedding theo ID |
| `app/api/templates/route.ts` | CRUD templates |
| `app/api/templates/[id]/route.ts` | GET/PUT/DELETE template theo ID |
| `app/api/auth/login/route.ts` | Truy vấn bảng `users` để xác thực đăng nhập |
| `app/api/auth/register/route.ts` | Insert user mới vào bảng `users` |

---

## `lib/session.ts`

Server-side session helper. Đọc cookie `wispic_session` → query DB → trả về user.

**Exports:**
| Export | Type | Mô tả |
|--------|------|-------|
| `getSessionUser()` | `Promise<SessionUser \| null>` | Lấy user từ session cookie |
| `getCurrentRole()` | `Promise<'admin' \| 'user' \| null>` | Lấy role user hiện tại |
| `getCurrentUserId()` | `Promise<string \| null>` | Lấy ID user hiện tại |

**Type:**
```ts
type SessionUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}
```

**Sử dụng tại:**

| File | Component / Context | Mục đích |
|------|---------------------|----------|
| `app/api/auth/me/route.ts` | GET /api/auth/me | Trả về thông tin user đang đăng nhập |
| `components/auth-button.tsx` | `AuthButton` (server component) | Hiển thị email user hoặc nút Sign in |
| `app/dashboard/layout.tsx` | `DashboardLayout` | Redirect về login nếu chưa đăng nhập; xác định role admin/user |
| `app/dashboard/templates/page.tsx` | `TemplatesPage` | Chỉ admin mới truy cập được trang quản lý mẫu |

---

## `lib/wedding-storage.ts`

Client-side API wrapper cho `/api/weddings`. Gọi fetch() thay vì localStorage.

**Exports:**
| Export | Type | Mô tả |
|--------|------|-------|
| `readWeddings()` | `Promise<WeddingDraft[]>` | GET danh sách thiệp |
| `readWedding(id)` | `Promise<WeddingDraft \| null>` | GET một thiệp theo ID |
| `saveWedding(draft)` | `Promise<void>` | PUT cập nhật thiệp |
| `createWedding(draft)` | `Promise<void>` | POST tạo thiệp mới |
| `deleteWedding(id)` | `Promise<void>` | DELETE xoá thiệp |
| `createDraftFromTemplate()` | `WeddingDraft` | Tạo draft mẫu (client-side) |
| `createWeddingId()` | `string` | Tạo UUID mới |
| `ensureDraftDefaults(raw)` | `WeddingDraft` | Đổ default cho các field thiếu |
| `toWeddingData(d)` | `WeddingData` | Chuyển WeddingDraft → WeddingData |
| `summaryFromDraft(d)` | `{ date, city, names }` | Tóm tắt hiển thị trên card |
| `newPhoto(url, alt?)` | `WeddingPhoto` | Tạo object ảnh mới |
| `writeWeddings(list)` | `Promise<void>` | Backward-compat: lưu list weddings |
| `DEFAULT_TEMPLATE_ID` | `'romantic'` | Template mặc định |
| `type WeddingDraft` | | Kiểu dữ liệu thiệp cưới |
| `type WeddingStatus` | `'draft' \| 'published'` | Trạng thái thiệp |

**Sử dụng tại:**

| File | Component / Functions used | Mục đích |
|------|---------------------------|----------|
| `app/dashboard/wedding-list.tsx` | `readWeddings`, `deleteWedding`, `summaryFromDraft`, `WeddingDraft` | Hiển thị danh sách + xoá thiệp |
| `app/dashboard/create/wedding-create-form.tsx` | `createDraftFromTemplate`, `createWedding`, `newPhoto`, `DEFAULT_TEMPLATE_ID`, `toWeddingData` | Form tạo thiệp mới |
| `app/dashboard/[id]/edit/wedding-editor.tsx` | `readWedding`, `saveWedding`, `deleteWedding`, `toWeddingData`, `newPhoto`, `DEFAULT_TEMPLATE_ID`, `WeddingDraft` | Trang chỉnh sửa thiệp (load, autosave, xoá) |
| `app/dashboard/[id]/preview/wedding-preview.tsx` | `readWedding`, `toWeddingData`, `WeddingDraft` | Trang xem trước thiệp |
| `components/wedding/editor-shared.tsx` | `newPhoto`, `createWeddingId` | Các component editor chung (PhotoPicker, GalleryManager, QuestionBuilder...) |

---

## `lib/admin-template-storage.ts`

Client-side API wrapper cho `/api/templates`. Gọi fetch() thay vì localStorage.

**Exports:**
| Export | Type | Mô tả |
|--------|------|-------|
| `readAdminTemplates()` | `Promise<AdminTemplate[]>` | GET danh sách template |
| `readAdminTemplate(id)` | `Promise<AdminTemplate \| null>` | GET một template theo ID |
| `saveAdminTemplate(template)` | `Promise<void>` | POST tạo hoặc PUT cập nhật template |
| `deleteAdminTemplate(id)` | `Promise<void>` | DELETE xoá template |
| `createAdminTemplate(overrides?)` | `AdminTemplate` | Tạo template mới với default values (client-side) |
| `type AdminTemplate` | | Kiểu dữ liệu template |

**Type:**
```ts
type AdminTemplate = {
  id: string
  name: string
  category: string
  description: string
  swatches: [string, string]  // [màu_nền_1, màu_nền_2]
  accent: string
  html: string
  css: string
  isCustom: boolean
  createdAt: number
  updatedAt: number
}
```

**Logic phân biệt POST/PUT:** `saveAdminTemplate()` kiểm tra `template.id.includes('-')` — nếu có (UUID mới từ `createAdminTemplate`) thì POST, nếu không thì PUT.

**Sử dụng tại:**

| File | Component / Functions used | Mục đích |
|------|---------------------------|----------|
| `components/wedding/editor-shared.tsx` | `readAdminTemplates`, `AdminTemplate` | `TemplateGallery` — hiển thị mẫu tùy chỉnh khi chọn template; `useAdminTemplates()` hook |
| `app/dashboard/[id]/preview/wedding-preview.tsx` | `readAdminTemplates`, `AdminTemplate` | `CustomTemplateRenderer` — load HTML/CSS template tùy chỉnh khi xem trước |
| `app/dashboard/templates/template-manager.tsx` | `readAdminTemplates`, `saveAdminTemplate`, `createAdminTemplate`, `deleteAdminTemplate`, `AdminTemplate` | Quản lý danh sách mẫu: tạo, nhân bản, xoá |
| `app/dashboard/templates/[id]/edit/admin-template-editor.tsx` | `readAdminTemplate`, `saveAdminTemplate`, `deleteAdminTemplate`, `AdminTemplate` | Trang chỉnh sửa code HTML/CSS của template (autosave, xoá) |
