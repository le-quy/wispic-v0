# WISPIC — Phiên Dashboard + Create + Editor (Thiệp cưới)

> Tài liệu ghi lại những gì đã xây dựng trong phiên này: **Dashboard quản lý thiệp**, **Tạo thiệp mới**, và **trình chỉnh sửa thiệp (Editor)** kèm hệ thống template. Dùng để quay lại tiếp tục hoàn thiện (xem mục 8).

---

## 1. Tổng quan đã làm được

| Tính năng | Trạng thái | Nơi |
|---|---|---|
| Dashboard danh sách thiệp (CRUD) | ✅ | `/dashboard` |
| Trang tạo thiệp mới (form + preview + lưu) | ✅ | `/dashboard/create` |
| Editor: chọn template từ gallery | ✅ | `/dashboard/[id]/edit` |
| Editor: form thông tin (cô dâu/chú rể/bố mẹ/ngày giờ/địa điểm) | ✅ | `/dashboard/[id]/edit` |
| Editor: upload ảnh (avatar, couple, gallery) | ✅ | `/dashboard/[id]/edit` |
| Preview realtime | ✅ | `/dashboard/[id]/edit` (panel phải) |
| Đổi template **giữ nguyên dữ liệu** | ✅ | `/dashboard/[id]/edit` |
| Xem thiệp như khách (preview page) | ✅ | `/dashboard/[id]/preview` + `/preview` (demo) |
| Publish/Unpublish | 🔶 một phần | Editor: toggle "Xuất bản" lưu `status` |

**3 mẫu thiệp đã dựng:** Lãng mạn (editorial) · Thanh xuân (hiện đại) · Song Hỷ (truyền thống). Đều render được từ **dữ liệu thật** (tên, bố mẹ, ngày giờ, địa điểm, ảnh).

> ✅ Build + lint sạch; 3 template đã SSR-smoke-test render không lỗi.

---

## 2. Quyết định kiến trúc (giao ước)

1. **Lưu dữ liệu bằng localStorage / demo data** — chưa có Supabase table. Mọi CRUD chạy qua `lib/wedding-storage.ts`.
2. **Đổi template là đổi field `templateId` trên cùng bản nháp** — dữ liệu form giữ nguyên xuyên suốt.
3. **Template là component thuần** nhận `{ wedding, backHref, hideBack }`, registry chọn theo `templateId`.
4. **next/image không nhận `data:` URL** → `TemplateImage` dùng `<img>` thường khi src không phải remote URL (như ảnh đã upload).
5. **Auth local**: login `admin@local.com / admin`; bảo vệ dashboard bằng `getAuthClaims()` + cookie `wispic_local_session`. Chi tiết: `lib/docs/LOCAL-SESSION.md`.

---

## 3. Mô hình dữ liệu

`lib/wedding-data.ts`:

```ts
type WeddingPhoto = { url: string; alt?: string };   // url có thể là data: URL hoặc http(s)

interface WeddingData {
  groom, bride: string;
  groomParents, brideParents: string;   // bố mẹ hai bên (NTHT, NTKS)
  weddingDate: string;                  // giây epoch (số) — format khi render
  ceremonyTime, receptionTime: string;
  receptionNote: string;
  location: { venueName, city, province, address };
  introduction: string;
  coupleStory: string;
  avatar: WeddingPhoto | null;          // ảnh cặp đôi chính / ảnh đại diện
  couplePhoto: WeddingPhoto | null;     // ảnh tuổi trẻ / couples
  photos: WeddingPhoto[];               // bộ sưu tập
}
```

`lib/wedding-storage.ts` — `WeddingDraft = WeddingData & { id, createdBy, status, templateId, createdAt, updatedAt }`:

- `ensureDraftDefaults(draft)` — **migrate an toàn**: điền field thiếu bằng `demoWedding`, chỉ default `avatar`/`couplePhoto` khi key không tồn tại (để người dùng xoá ảnh không bị phục hồi dữ liệu cũ).
- `readWeddings()`, `readWedding(id)`, `saveWedding(draft)`, `deleteWedding(id)`, `toWeddingData()`, `newPhoto()`.
- Key localStorage: `wispic:weddings`, `wispic:wedding:${id}`; namespace `wispic:` (đồng bộ LOCAL-SESSION).
- `DEFAULT_TEMPLATE_ID = "romantic"`.

> ⚠️ Giao ước tương lai: khi chuyển sang DB, giữ nguyên **shape của `WeddingDraft`/`WeddingData`** để code editor không phải sửa lại.

---

## 4. Hệ thống template

| File | Vai trò |
|---|---|
| `lib/template-registry.tsx` | `TEMPLATES` (metadata + thumbnail màu), `getTemplate(id)`, `renderWeddingTemplate(id, wedding, backHref, hideBack)` |
| `components/wedding/template-image.tsx` | `<img>` thường cho data: URL, `next/image` cho remote |
| `components/wedding/romantic-template.tsx` | "Lãng mạn" — editorial, ivory/sand, chữ Cormorant |
| `components/wedding/modern-template.tsx` | "Thanh xuân" — hiện đại, tangerine, câu chuyện timeline |
| `components/wedding/traditional-template.tsx` | "Song Hỷ" — đỏ Hỷ, hai pronunciation + kính mời, 囍 |

Contract cho mọi template:

```tsx
type TemplateProps = {
  wedding: WeddingData;
  backHref?: string;   // link "Xem thiệp của tôi / quay lại"
  hideBack?: boolean;  // ẩn nút quay lại (dung trên preview/editor)
};
```

> Khi thêm template mới: tạo file trong `components/wedding/`, rồi đăng ký vào `TEMPLATES` trong `lib/template-registry.tsx` — editor gallery + preview tự cập nhật.

---

## 5. Editor (`/dashboard/[id]/edit`)

Server wrapper `app/dashboard/[id]/edit/page.tsx` (props `params: Promise<{id}>` + `<Suspense>`) → `wedding-editor.tsx` (client component).

Cấu trúc `wedding-editor.tsx`:

1. **Toolbar**: nút đổi bên trái "Chỉnh sửa / Xem trước" (mobile), nút **Xuất bản**, **Lưu xong** (→ `/dashboard`), **Xoá thiệp**, **Xem thiệp** (→ preview).
2. **Trình tự chỉnh sửa:**
   - **Mẫu thiệp** — 3 card thumbnail, click = `setDraft({ templateId })`, dữ liệu giữ nguyên.
   - **Thông tin cô dâu chú rể** — groom, bride + bố mẹ hai bên.
   - **Ngày giờ & lễ tiệc** — `weddingDate` (datetime-local), `ceremonyTime`, `receptionTime`, `receptionNote`.
   - **Địa điểm** — tên trung tâm tiệc, thành phố, tỉnh, địa chỉ.
   - **Lời mời & câu chuyện** — `introduction`, `coupleStory`.
   - **Ảnh cặp đôi** — `avatar`, `couplePhoto` dùng `PhotoPicker`.
   - **Bộ sưu tập** — `GalleryManager` thêm/xoá nhiều ảnh.
3. **Preview realtime**: panel phải (desktop), tab "Xem trước" (mobile) — render `renderWeddingTemplate(draft.templateId, ...)` với dữ liệu đang sửa.
4. **Autosave**: debounce 600ms → `saveWedding()` → hiện trạng thái `savedAt` ("Đã lưu HH:mm").
5. Ảnh upload: file → `FileReader` → data URL (lưu thẳng vào localStorage) **hoặc** dán URL http.

---

## 6. Luồng sử dụng (chạy tại localhost)

```
/admin@local.com / admin → /dashboard
        │  "Tạo thiệp mới"  (default template = Lãng mạn)
        ▼
/dashboard/create (form nhanh: tên, ngày, địa điểm, ảnh)
        │  "Lưu thiệp"
        ▼
/dashboard (card thiệp mới; thumbnail = avatar, chip = tên template)
        │  "Chỉnh sửa"
        ▼
/dashboard/[id]/edit → mục "Mẫu thiệp" (+) chọn lại template, nhập đầy đủ, upload ảnh
        │  "Xuất bản" / "Lưu xong"
        ▼
/dashboard/[id]/preview (xem như khách) · /preview (demo Lãng mạn với demoWedding)
```

---

## 7. Kiểm chứng phiên này

- [x] `npm run build` — đủ route `/dashboard`, `/dashboard/create`, `/dashboard/[id]/edit`, `/dashboard/[id]/preview`, `/preview`; build sạch.
- [x] `npx eslint` file mới/thay đổi — sạch (0 lỗi).
- [x] Smoke test SSR 3 template (`smoke-test` tạm, đã gỡ) — render OK, đủ nội dung VI + chữ Hỷ.
- [x] curl: `/dashboard` redirect `/auth/login` khi chưa auth; 200 khi có cookie `wispic_local_session=1`.
- [x] Sửa bug: refresh dashboard chưa auth trước đây không redirect; trước đây `next/image` vỡ với ảnh data URL.

---

## 8. Việc tiếp theo (điểm dừng để quay lại)

Theo `PLAN-CLONE-CHUNGDOI.md`, phần đang bỏ dở — ưu tiên khuyến nghị:

1. **Publish flow hoàn chỉnh** — nút Xuất bản hiện chỉ lưu `status`; cần trang thiệp công khai theo token (`/inv/[token]` hay `/wedding/[slug]`) và đổi mẫu giữ data trên thiệp đã publish.
2. **Thêm template** — hiện có 3/20+ mẫu; đăng ký lần lượt qua registry. Thêm **color variant** cho từng mẫu.
3. **Guest management & RSVP** — `/dashboard/[id]/guests`, `/dashboard/[id]/rsvp`, form `/inv/[token]/rsvp` (companions, transport, dietary, note). Schema `guests` đã có trong plan (mục 4).
4. **Public invitation page** — countdown, Google Maps, QR code, đa ngôn ngữ song song.
5. **Migrate Supabase** — hiện storage là localStorage; đưa `weddings`/`wedding_photos` lên DB theo schema plan, giữ **shape dữ liệu** để không phải đổi editor.
6. **Landing page** — hero + CTA, gallery mẫu thiệp, hướng dẫn 3 bước, testimonial, FAQ, footer.

---

## 9. File map

| File | Vai trò |
|---|---|
| `app/dashboard/wedding-list.tsx` | Card thiệp: thumbnail = avatar (fallback ảnh default), chip template |
| `app/dashboard/create/*` | Trang tạo thiệp mới (form nhanh → save → `/dashboard`) |
| `app/dashboard/[id]/edit/page.tsx` | Server wrapper editor |
| `app/dashboard/[id]/edit/wedding-editor.tsx` | **Editor UI** (gallery, form, PhotoPicker, GalleryManager, autosave) |
| `app/dashboard/[id]/preview/wedding-preview.tsx` | Preview theo `templateId` |
| `app/preview/page.tsx` | Thiệp demo (Lãng mạn + `demoWedding`) |
| `lib/wedding-data.ts` | Mô hình dữ liệu + `demoWedding` |
| `lib/wedding-storage.ts` | localStorage CRUD + migration |
| `lib/template-registry.tsx` | Đăng ký + render template |
| `components/wedding/*` | Các template + `TemplateImage` |
| `lib/local-auth.ts` | Session local (`admin@local.com / admin`) |