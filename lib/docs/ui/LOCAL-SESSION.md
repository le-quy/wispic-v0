# WISPIC Local Session & Auth

> Tài liệu kỹ thuật cho hệ thống xác thực hiện tại của WISPIC-WEDDING — mô tả cách vận hành **local session** và lộ trình chuyển sang quản lý session bằng **PostgreSQL** sau này.

---

## 1. Tổng quan

Hệ thống auth hiện tại có **2 tầng** song song:

| Tầng | Khi nào dùng | Backend |
|---|---|---|
| **Local Session** (chính) | Không có Supabase env, cần login dùng thử | Cookie `wispic_local_session` |
| **Supabase Auth** (fallback) | Khi có đủ `NEXT_PUBLIC_SUPABASE_URL` + key | Cookies do Supabase quản lý |

- Login thử bằng tài khoản local: **`admin@local.com` / `admin`**
- Webapp hoạt động hoàn toàn bình thường dù **chưa cấu hình database**.
- Mở rộng hiện trạng: xoá cookie → tự động rơi vào flow Supabase.

---

## 2. Tài khoản local admin

```ts
// lib/local-auth.ts
export const LOCAL_ADMIN_EMAIL = "admin@local.com";
export const LOCAL_ADMIN_PASSWORD = "admin";
```

- **Email:** `admin@local.com`
- **Mật khẩu:** `admin`
- Claims giả lập trả về: `{ email: "admin@local.com", sub: "local-admin", role: "authenticated", is_local: true }`

> ⚠️ Đây CHỈ là credentials dùng cho demo/local. Khi quản lý tài khoản qua database, phải **xoá** hardcode này và đối chiếu với bảng `users`.

---

## 3. Kiến trúc & luồng dữ liệu

### 3.1 File chính

| File | Vai trò |
|---|---|
| `lib/local-auth.ts` | Helper session local — cookie, claims, sự kiện change |
| `lib/supabase/server.ts` | `getAuthClaims()` — điểm duy nhất server đọc user hiện tại |
| `lib/supabase/proxy.ts` | Middleware proxy — gate route, cho phép local session |
| `lib/supabase/client.ts` | Supabase client (browser) |
| `components/login-form.tsx` | Form đăng nhập — xử lý local + Supabase |
| `components/site-header.tsx` | Header tự đổi nút Đăng nhập ↔ Đăng xuất |
| `components/logout-button.tsx` | Nút đăng xuất dùng lại được |
| `app/dashboard/layout.tsx` | Gate protected route (`redirect` nếu chưa auth) |

### 3.2 Luồng login local

```
User nhập admin@local.com / admin
        │
        ▼
login-form.tsx: isLocalAdmin() true?
        │  true
        ▼
setLocalSessionClient()
  ├─ document.cookie: wispic_local_session=1; path=/; max-age=86400; samesite=lax
  └─ dispatch Event("wispic:local-session")
        │
        ▼
router.push('/dashboard')
        │
        ▼ (request có cookie)
proxy.ts: getLocalClaims() → có cookie → skip Supabase check → pass
        │
        ▼
dashboard/layout.tsx: getAuthClaims() → server.ts đọc cookie → claims hợp lệ → render
```

### 3.3 Luồng logout local

```
Nhấn "Đăng xuất" (header / logout-button)
        │
        ▼
clearLocalSessionClient()
  ├─ document.cookie: wispic_local_session=; path=/; max-age=0
  └─ dispatch Event("wispic:local-session")
        │
        ▼
hasEnvVars ? supabase.auth.signOut() : (bỏ qua)
  └─ chỉ logout Supabase khi có env vars (tránh crash khi chưa cấu hình)
        │
        ▼
router.push('/') → header tự nhận sự kiện → hiện "Đăng nhập"
```

### 3.4 Ghi chú quan trọng (bugs đã fix)

- **Logout lỗi khi chưa có Supabase env:** `createClient().auth.signOut()` sẽ throw vì URL/key là `undefined`. Vì vậy: **chỉ gọi `signOut()` khi `hasEnvVars === true`** (xem `logout-button.tsx`). Header cũng áp dụng cùng guard.
- **Input email:** form login dùng `type="email"` nên `admin` (thiếu `@`) bị browser validation chặn → credentials chuẩn là `admin@local.com`.

---

## 4. Sự kiện thay đổi session

Header cần biết session thay đổi realtime (login/logout) mà không cần reload:

```ts
// lib/local-auth.ts
export const LOCAL_SESSION_EVENT = "wispic:local-session";

// Trong setLocalSessionClient() / clearLocalSessionClient():
window.dispatchEvent(new Event(LOCAL_SESSION_EVENT));

// Trong site-header.tsx: lắng nghe để đổi nút
window.addEventListener(LOCAL_SESSION_EVENT, sync);
```

**State resolvestacking:**
1. Nếu có cookie local → `authed = true` (không đụng Supabase).
2. Nếu `hasEnvVars` → gọi `supabase.auth.getUser()` → authed theo user thật.
3. Không có gì → `authed = false`.

---

## 5. Route protection

| Route | Bảo vệ bởi | Hành vi khi chưa auth |
|---|---|---|
| `/dashboard/**` | `app/dashboard/layout.tsx` + `proxy.ts` | `redirect('/auth/login')` |
| Toàn bộ trang (trừ `/`, `/auth/**`) | `proxy.ts` | redirect về `/auth/login` |
| `/auth/login` | — | Public, luôn truy cập được |

`proxy.ts` logic:

```
Nếu có cookie local session → passthrough (bỏ qua check Supabase)
Ngược lại:
  - Nếu !hasEnvVars → passthrough (chưa setup, không gate)
  - Nếu có Supabase claims → passthrough
  - Nếu path != "/" và không thuộc /auth → redirect /auth/login
```

---

## 6. Lộ trình: quản lý session qua PostgreSQL

> Đây là mục tiêu tương lai — khi đưa database (PostgreSQL, dự kiến Supabase) vào quản lý thật.

### 6.1 Bảng đề xuất (schema draft)

```sql
-- users: tài khoản người dùng
create table users (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  password    text not null,            -- hash (bcrypt/argon2), không lưu plaintext
  full_name   text,
  role        text default 'user',      -- 'admin' | 'user' | ...
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- sessions: token phiên đăng nhập
create table sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  token       text unique not null,     -- hash của session token
  user_agent  text,
  ip          inet,
  expires_at  timestamptz not null,
  created_at  timestamptz default now()
);
```

### 6.2 Thay thế hardcode credentials

- Bỏ `LOCAL_ADMIN_EMAIL` / `LOCAL_ADMIN_PASSWORD` trong `lib/local-auth.ts`.
- Login: truy vấn `users.email` + verify password hash; lỗi → trả message.
- Không còn khái niệm `isLocalAdmin()` riêng — mọi user đều được xác thực qua DB.

### 6.3 Thay thế cookie hardcode bằng session token

- Hiện tại: cookie `wispic_local_session=1` (giá trị cố định, không an toàn).
- Tương lai: khi login, sinh `token` ngẫu nhiên (crypto), `INSERT INTO sessions`, set cookie giá trị token đó, `HttpOnly` (nếu set qua API route/server).
- `getLocalClaims()` → thay bằng truy vấn `sessions` + `users` theo token; trả về claims thật (id, email, role).
- Logout: `DELETE FROM sessions WHERE token = ...` thay vì chỉ clear cookie.

### 6.4 Claims thật khi migrate

Claims giả lập hiện tại:

```ts
{ email, sub: "local-admin", role: "authenticated", is_local: true }
```

Sau migrate, claims nên dựng từ DB:

```ts
{ email: user.email, sub: user.id, role: user.role, is_local: false }
```

**Checklist migration:**

- [ ] Tạo bảng `users`, `sessions` (schema ở trên)
- [ ] Viết hàm hash/verify password (`bcryptjs`, `argon2`, hoặc `@supabase/supabase-js` admin)
- [ ] Sửa `login-form.tsx`: bỏ `isLocalAdmin`, gọi API login → tạo session
- [ ] Sửa `lib/local-auth.ts`: xoá hardcode, đọc token từ DB
- [ ] Sửa `logout-button.tsx` / header: logout gọi API `DELETE session`
- [ ] Sửa `proxy.ts` + `getAuthClaims()`: nguồn claims từ DB, không cần `hasEnvVars` guard
- [ ] Mã hoá cookie session (`HttpOnly`, `Secure`, `SameSite=Lax`) qua server action/route

---

## 7. Checklist phát triển

Khi thêm/tuỳ chỉnh auth, kiểm tra:

- [ ] Đăng nhập local `admin@local.com / admin` vẫn vào được `/dashboard`
- [ ] Header đổi Đăng nhập ↔ Đăng xuất đúng theo session (desktop + mobile)
- [ ] Logout hoạt động khi KHÔNG có Supabase env (không crash)
- [ ] Logout hoạt động khi CÓ Supabase env (gọi `signOut()` + clear cookie)
- [ ] Route guard `proxy.ts` redirect đúng về `/auth/login` khi chưa auth
- [ ] Không leak mật khẩu/hardcode credential ra ngoài khi migrate DB