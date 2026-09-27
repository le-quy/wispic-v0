# Upload & lưu trữ ảnh — Wispic

Tài liệu này mô tả cách ảnh được tải lên, kiểm tra, phục vụ và dọn dẹp. Đọc
phần [Khi triển khai thật](#khi-triển-khai-thật) trước khi deploy — ảnh đang
nằm trên ổ đĩa của container và **sẽ mất nếu không gắn volume**.

---

## 1. Vì sao không nhét base64 vào database

Trước đây editor đọc file người dùng chọn thành data URL rồi lưu thẳng chuỗi
đó vào `weddings` / `wedding_photos`. Hậu quả:

- Một thiệp có 20 ảnh cỡ điện thoại nặng hàng chục MB, và **mỗi lần autosave lại
  gửi toàn bộ chuỗi base64 lên server**.
- Mọi lần đọc thiệp đều phải kéo theo toàn bộ base64, kể cả các màn hình không
  dùng đến ảnh.
- Cột `text` bị ngấm dữ liệu nhị phân, không index/query được.

Nay ảnh nằm trên đĩa, database chỉ giữ URL (`/media/<uuid>.<ext>`). Không còn
hàm `readFileAsDataUrl` trong codebase.

---

## 2. Luồng

```
Trình duyệt                        Server
───────────                        ──────
chọn tệp
  └─ FormData ──POST /api/uploads──▶ requireUser()
                                       saveImage()  ← kiểm tra magic bytes
                                       ghi tệp, sinh tên UUID
                                  ◀── 201 { data: { url, kind, bytes } }

lưu vào ảnh đôi: draft.avatar = { url }
autosave ──PATCH /api/weddings/[id]▶ chỉ ghi cột có trong body
                                  ◀── 200

khách mở thiệp ──GET /media/<uuid>.png──▶ readImage()
                                  ◀── 200 + Cache-Control: immutable
```

Hai bước tách biệt là cố ý: tải lên không phụ thuộc vào việc lưu thiệp, nên
người dùng đổi ý không mất ảnh, và autosave chỉ gửi URL ngắn.

---

## 3. Cấu hình

| Biến | Mặc định | Ý nghĩa |
|------|----------|---------|
| `UPLOAD_DIR` | `.uploads` | Thư mục lưu ảnh, tính tương đối với thư mục gốc dự án |

Thêm vào `.env` khi muốn đổi:

```bash
UPLOAD_DIR=/var/lib/wispic/uploads
```

Thư mục được tạo tự động ở lần ghi đầu tiên. Đã có trong `.env.example` và nằm
trong `.gitignore`.

---

## 4. Kiểm tra an toàn

### 4.1 Định dạng lấy từ byte, không tin header của client

`file.type` do trình duyệt gửi lên có thể bị bịa (`evil.png` khai là
`image/png` nhưng nội dung là HTML/JS). `detectKind()` trong
`lib/image-storage.ts` đọc **magic bytes** ở đầu tệp:

| Định dạng | Chữ ký |
|-----------|--------|
| JPEG | `FF D8 FF` |
| PNG | `89 50 4E 47 0D 0A 1A 0A` |
| GIF | `47 49 46 38` (`GIF87a` / `GIF89a`) |
| WebP | `52 49 46 46 … 57 45 42 50` (`RIFF…WEBP`) |

Không khớp → `422`, tệp không được ghi. Đuôi file lưu xuống đĩu cũng lấy từ
định dạng đã xác minh, **không** lấy từ tên file gửi lên. Tệp HTML tên
`ten-tam.png` bị từ chối; tệp GIF tên `ten-tam.png` được lưu thành `.gif`.

### 4.2 Tên file do server sinh

```ts
const id = `${randomUUID()}${ALLOWED[kind].ext}`
```

Tên do client gửi bị bỏ qua hoàn toàn. Việc này chặn cả hai đường tấn công: ghi
đè lên tệp khác, và giả tên tệp để lách đường dẫn (`../../etc/passwd.png`).
Lệnh ghi dùng cờ `wx` — lỗi nếu tệp đã tồn tại, không bao giờ ghi đè.

### 4.3 Chặn path traversal khi đọc

`readImage()` chặn ở **tầng đọc file**, không phải ở route, để sau này gọi từ
chỗ khác vẫn an toàn:

1. Từ chối `..`, ký tự null `\0`, dấu gạch chéo ngược, đường dẫn tuyệt đối.
2. Chỉ chấp nhận 4 đuôi ảnh — `.html`, `.svg`, `.js` nằm trong thư mục upload
   không được phục vụ.
3. `resolve()` rồi kiểm tra kết quả nằm trong `UPLOAD_DIR`.

### 4.4 Giới hạn

| Hạn mục | Giá trị |
|---------|---------|
| Kích thước tối đa | 5 MB (`MAX_UPLOAD_BYTES`) |
| Định dạng | jpg, png, webp, gif |
| Quyền | chỉ cần đăng nhập |

Chưa có giới hạn số ảnh theo người dùng — xem [Còn thiếu](#còn-thiếu).

### 4.5 Header khi phục vụ

```
Content-Type: image/png
Cache-Control: public, max-age=31536000, immutable
X-Content-Type-Options: nosniff
Content-Disposition: inline
ETag: "…"
```

`nosniff` chặn trình duyệt tự đoán kiểu nội dung cho tệp do người dùng tải lên.
`immutable` an toàn vì tên file là UUID — một URL không bao giờ đổi nội dung.

---

## 5. Vì sao phục vụ qua route mà không bỏ vào `public/`

`next.config.ts` đặt `output: 'standalone'`. Ở chế độ này Next **copy `public/`
lúc build**, nên tệp ghi vào `public/` sau đó sẽ không được phục vụ — Next không
quét lại thư mục này ở mỗi request.

Vì vậy ảnh nằm ngoài `public/`, và route `app/media/[...path]/route.ts` đọc rồi
trả về. Đổi sang S3 sau này chỉ cần thay hai hàm `saveImage` / `readImage`,
route và component không đổi.

---

## 6. Khi triển khai thật

Hiện tại chạy local. Trước khi lên môi trường thật, đọc kỹ phần này.

### 6.1 Gắn volume cho container

**Đây là điểm quan trọng nhất.** Nếu không gắn volume, **mọi ảnh sẽ mất mỗi lần
thay thế container** — DB vẫn còn URL `/media/<uuid>.png` nhưng ảnh trả về 404.

> Repo hiện **chưa có `Dockerfile`/`docker-compose.yml`**. Các ví dụ dưới đây
> là mẫu để dùng khi dựng, chưa áp dụng cho dự án này.

```bash
docker run -p 3000:3000 \
  -v wispic_uploads:/app/.uploads \
  -e UPLOAD_DIR=/app/.uploads \
  --env-file .env \
  my-registry/wispic:latest
```

Nên đặt `UPLOAD_DIR` là đường dẫn tuyệt đối để không phụ thuộc thư mục làm việc:

```yaml
# docker-compose.yml
services:
  app:
    build: .
    env_file: .env
    environment:
      UPLOAD_DIR: /data/uploads
    volumes:
      - wispic_uploads:/data/uploads
    ports: ["3000:3000"]

volumes:
  wispic_uploads:
```

### 6.2 Sao lưu

Ảnh nằm ngoài database, nên phải sao lưu riêng. `pg_dump` **không** bao gồm
ảnh. Nếu mất volume mà không có bản sao, mọi ảnh trong database sẽ hỏng.

### 6.3 Nhiều instance

Ổ đĩa local **không dùng được khi chạy nhiều instance cùng lúc** (2 replica
sẽ tạo ra 2 thư mục upload riêng và mỗi instance chỉ thấy ảnh của mình). Nếu cần
scale ngang, phải chuyển sang S3/R2 hoặc gắn volume dùng chung — xem mục 7.

### 6.4 Cảnh báo build

`npm run build` in:

```
Warning: Dynamic filesystem access causes tracing of the whole project
```

Đây là cảnh báo từ trình đóng gói của Next khi thấy đường dẫn đọc/ghi được tính
lúc chạy. **Vô hại ở đây và không khắc phục được**: ảnh được tải lên *sau khi*
build, nên lúc build chúng chưa tồn tại và tracing không có ý nghĩa gì.
`outputFileTracingExcludes` không tác dụng với Turbopack — đã thử, cả warning
lẫn kích thước bản `standalone` đều không đổi, nên không thêm cấu hình đó.

---

## 7. Chuyển sang S3 / R2

Toàn bộ phần gắn với hệ thống file nằm sau hai hàm trong
`lib/image-storage.ts`:

| Hàm | Trách nhiệm | Khi dùng S3 |
|-----|-------------|-------------|
| `saveImage(file)` | kiểm tra + ghi + trả URL | `PutObject` với `ContentType` đã xác minh |
| `readImage(path)` | đọc + trả bytes | bỏ hẳn; route `/media` chuyển sang 302 tới URL đã ký |

Những thứ **không** cần đổi: `detectKind()`, toàn bộ kiểm tra định dạng, route
`/api/uploads`, component editor, cột trong database.

Gợi ý khi chuyển: sinh tên theo `crypto.randomUUID()` như hiện tại để không phải
xử lý tên lạ; đặt tên sẵn tiền tố theo người dùng để dễ dọn ảnh mồ côi; bật
lifecycle rule xoá sau 30 ngày cho những ảnh không còn được tham chiếu.

---

## 8. Còn thiếu

Ghi lại để không quên trước khi lên thật:

- **Ảnh mồ côi.** Gỡ ảnh khỏi thiệp không xoá tệp trên đĩa. Cần job quét
  `wedding_photos` / `weddings` rồi dọn `/media` không còn ai trỏ tới.
- **Quota.** Chưa giới hạn số ảnh theo người dùng, nên tài khoản miễn phí có
  thể ghi đầy đĩa. Nên giới hạn theo vai trò (cặp đôi vài chục ảnh, admin không
  giới hạn).
- **Resize / WebP.** Ảnh gốc 5 MB được phục vụ nguyên vẹn cho mọi khách xem.
  Nên tạo bản thu nhỏ khi tải lên.
- **Xoá tài khoản.** Xoá user chưa dọn ảnh của họ.

---

## 9. Kiểm thử

```bash
node --env-file=.env scripts/test-upload.mjs      # 14/14 — upload, phát hiện định dạng, path traversal, cache
node --env-file=.env scripts/test-upload-e2e.mjs # 7/7  — upload → PATCH → hiển thị trên trang public
```

Cả hai script tự dọn mọi tệp và dữ liệu tạo ra, kể cả khi thất bại.
