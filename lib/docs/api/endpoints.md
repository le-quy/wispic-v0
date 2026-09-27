# API Reference — Wispic

Mục lục:

- [auth/login](#post-apiauthlogin)
- [auth/register](#post-apiauthregister)
- [auth/logout](#post-apiauthlogout)
- [auth/me](#get-apiauthme)
- [weddings](#getapeweddings)
- [weddings/[id]](#getapeweddingsid)
- [PATCH weddings/[id]](#patch-apaweddingsid)
- [weddings/[id]/publish](#post-apaweddingsidpublish)
- [weddings/[id]/unpublish](#post-apaweddingsidunpublish)
- [public/wedding/[slug]](#get-apipublicweddingslug)
- [explore](#get-apiexplore)
- [explore/[slug]](#get-apiexploreslug)
- [uploads](#post-apiuploads)
- [media](#get-mediapath)
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

## `PATCH /api/weddings/[id]`

Cập nhật thiệp cưới theo kiểu **bán phần**: server chỉ ghi những cột có mặt trong
body, và chỉ thay những nhóm sub-tables được nhắc tới.

Trước đây là `PUT` full-replace — ghi đè mọi cột và xoá sạch cả 6 bảng con rồi
tạo lại. Một body chỉ đổi `title` vì thế sẽ xoá trắng tên công dâu chú rể, câu
chuyện, album và timeline. Sự cố này đã xảy ra một lần trong quá trình kiểm thử
và phải khôi phục dữ liệu từ backup.

**Request body:** một phần hoặc toàn bộ `WeddingDraft`.

| Gửi kèm | Kết quả |
|---------|---------|
| `{ title: '...' }` | chỉ đổi `title` |
| `{ photos: [] }` | xoá album (mảng rỗng rõ ràng = xoá) |
| không nhắc `photos` | giữ nguyên album |
| `{ avatar: null }` | gỡ ảnh đại diện |
| `{ music: { enabled: false } }` | tắt nhạc — `false` không bị coi là "thiếu" |
| `{}` | `422 VALIDATION_ERROR` |

**Slug không đổi theo tiêu đề.** Chỉ đổi khi body gửi `slug` tường minh, vì
nếu suy ra từ tiêu đề thì mỗi lần autosave sẽ sinh URL mới và phá link đã
gửi khách.

**Response 200:** Wedding object đã cập nhật.
`PUT` vẫn được nhận như alias của `PATCH` cho các tab đã mở trước lần deploy này
— sẽ bỏ khi không còn client nào gọi.

**Sử dụng tại (qua `lib/wedding-storage.ts` → `saveWedding(draft)`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/[id]/edit/wedding-editor.tsx` | `WeddingEditor` — autosave effect, `forceSaveAndGoBack()` | Auto-lưu khi chỉnh sửa, lưu & quay lại |

---

## `POST /api/weddings/[id]/publish`

Xuất bản thiệp: `DRAFT` / `UNPUBLISHED` → `PUBLISHED`.

Endpoint riêng thay vì dùng `PATCH` chỉ để đổi trạng thái, vì khiến người gọi dễ
lỡ gửi kèm cả nội dung thiệp và ghi đè ngoài ý muốn.

**Response 200:** Wedding object ở trạng thái `PUBLISHED`.
**Lỗi:** `404` không tìm thấy hoặc không sở hữu · `409 CONFLICT` nếu thiệp đã
xuất bản.

**Sử dụng tại (qua `lib/wedding-storage.ts` → `publishWedding(id)`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/[id]/edit/wedding-editor.tsx` | `WeddingEditor.togglePublish()` | Nút xuất bản / gỡ xuất bản |
| `app/dashboard/create/wedding-create-form.tsx` | `WeddingCreateForm` — tuỳ chọn "Xuất bản ngay" | Xuất bản luôn khi tạo thiệp |

---

## `POST /api/weddings/[id]/unpublish`

Gỡ xuất bản: `PUBLISHED` → `UNPUBLISHED`.

Đưa về `UNPUBLISHED` chứ không phải `DRAFT` để phân biệt "từng xuất bản rồi bị
gỡ" với "chưa từng xuất bản" — dashboard cần hai trạng thái này khác nhau.

**Response 200:** Wedding object ở trạng thái `UNPUBLISHED`.
**Lỗi:** `404` không tìm thấy hoặc không sở hữu · `409 CONFLICT` nếu thiệp vốn
đã chưa xuất bản.

**Sử dụng tại (qua `lib/wedding-storage.ts` → `unpublishWedding(id)`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/[id]/edit/wedding-editor.tsx` | `WeddingEditor.togglePublish()` | Nút xuất bản / gỡ xuất bản |

---

## `GET /api/public/wedding/[slug]`

Thiệp cưới public theo slug. **Không cần đăng nhập.**

Chỉ trả về thiệp `PUBLISHED`; điều kiện nằm ngay trong SQL chứ không kiểm sau
khi đã lấy row ra. Mọi trạng thái khác (`DRAFT`, `UNPUBLISHED`, không tồn tại)
đều trả `404` **giống hệt nhau**, để không lộ ra thiệp đang soạn dở tồn tại hay
không.

**Response 200:**

```json
{ "data": { "…": "mọi trường của thiệp trừ userId, createdBy, createdAt, updatedAt" },
  "meta": { "slug": "wis-paoziiee" } }
```

Bốn trường nêu trên bị loại khỏi response vì không cần thiết cho bên xem thiệp.

**Sử dụng tại:** hiện chưa có client nào gọi — trang `app/w/[slug]/page.tsx` gọi
thẳng `getPublishedWeddingBySlug()` trong `lib/wedding-public.ts` để không phải
vòng qua HTTP với chính server. Endpoint dành cho client ngoài (app mobile,
embed, script chia sẻ).

---

## `GET /api/explore`

Danh sách bài Explore đã xuất bản. **Không cần đăng nhập.**

**Query:** `?category=` lọc theo chuyên mục (bỏ trống = tất cả).

**Response 200:**

```json
{ "data": [ { "id": "…", "title": "…", "slug": "…", "excerpt": "…",
              "content": "…", "coverImage": null, "category": "…",
              "tags": [], "location": null, "authorId": null,
              "publishedAt": null, "updatedAt": "…" } ],
  "meta": { "total": 0 } }
```

`meta.category` chỉ xuất hiện khi có truyền `?category=`. Bảng `articles` hiện
đang rỗng nên `total` luôn bằng `0` — đây là empty state thật, không phải lỗi.

**Sử dụng tại:** hiện chưa có client nào gọi — `app/explore/page.tsx` gọi thẳng
`listPublishedExplore()` trong `lib/explore.ts`, dùng chung truy vấn với API để
hai đường không lệch nhau.

---

## `GET /api/explore/[slug]`

Một bài Explore theo slug. **Không cần đăng nhập.** Chỉ trả bài `PUBLISHED`; bài
chưa xuất bản trả `404`.

**Response 200:** `{ "data": { …PublicArticle }, "meta": { "slug": "…" } }`

**Sử dụng tại:** hiện chưa có client nào gọi — `app/explore/[slug]/page.tsx` gọi
thẳng `getPublishedExploreArticle()`. Vì bảng `articles` còn rỗng nên nhánh render
nội dung của trang **chưa từng được kiểm chứng bằng dữ liệu thật**.

---

## `POST /api/uploads`

Tải một ảnh lên, trả về URL để nhúng vào thiệp. Chỉ cần đăng nhập, không giới
hạn theo vai trò. Xem [upload.md](./upload.md) để biết chi tiết về kiểm tra
định dạng, giới hạn dung lượng và cách chuyển sang S3.

**Request body:** `multipart/form-data`, trường `file`.

**Response 201:**

```json
{ "data": { "url": "/media/3af2acbb-ce39-4399-968e-095851f02427.png",
            "kind": "png", "contentType": "image/png", "bytes": 78 } }
```

**Lỗi:** `401` chưa đăng nhập · `422` sai định dạng, quá 5 MB, hoặc thiếu trường `file`.

**Sử dụng tại (qua `components/wedding/editor-shared.tsx` → `uploadImage(file)`):**

| File | Component / Function | Mục đích |
|------|----------------------|----------|
| `app/dashboard/[id]/edit/wedding-editor.tsx` | `WeddingEditor.addGalleryFile()` | Thêm ảnh vào album kỷ niệm |
| `app/dashboard/create/wedding-create-form.tsx` | `WeddingCreateForm` | Ảnh khi tạo thiệp |
| `components/wedding/editor-shared.tsx` | `PhotoPicker` | Ảnh đại diện và ảnh bìa |

---

## `GET /media/[...path]`

Phục vụ ảnh đã tải lên. Công khai, không cần đăng nhập. Trả `Cache-Control:
immutable` (tên file là UUID nên nội dung một URL không bao giờ đổi) và `ETag`
để hỗ trợ `If-None-Match` → `304`.

Chỉ phục vụ 4 đuôi `jpg/png/webp/gif`; mọi đường dẫn khác trả `404` kể cả khi
file tồn tại. Chi tiết cơ chế chống path traversal trong [upload.md](./upload.md).

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
