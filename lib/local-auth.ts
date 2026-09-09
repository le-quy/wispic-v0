export const LOCAL_SESSION_COOKIE = "wispic_local_session";

/**
 * Sự kiện phát ra trên window khi session local thay đổi
 * (dùng để header/dashboard cập nhật nút Đăng nhập/Đăng xuất).
 */
export const LOCAL_SESSION_EVENT = "wispic:local-session";

export const LOCAL_ROLE_ADMIN = "admin";
export const LOCAL_ROLE_USER = "user";

export type LocalRole = typeof LOCAL_ROLE_ADMIN | typeof LOCAL_ROLE_USER;

export const LOCAL_ADMIN_EMAIL = "admin@local.com";
export const LOCAL_ADMIN_PASSWORD = "admin";

export const LOCAL_USER_EMAIL = "user@local.com";
export const LOCAL_USER_PASSWORD = "user";

/**
 * Email hiển thị cho session local admin — dùng chung ở server, proxy & UI.
 */
export const LOCAL_ADMIN_DISPLAY_EMAIL = LOCAL_ADMIN_EMAIL;

/**
 * Danh sách tài khoản local demo (admin + user).
 */
export const LOCAL_ACCOUNTS: {
  email: string;
  password: string;
  role: LocalRole;
  name: string;
}[] = [
  {
    email: LOCAL_ADMIN_EMAIL,
    password: LOCAL_ADMIN_PASSWORD,
    role: LOCAL_ROLE_ADMIN,
    name: "Quản trị viên",
  },
  {
    email: LOCAL_USER_EMAIL,
    password: LOCAL_USER_PASSWORD,
    role: LOCAL_ROLE_USER,
    name: "Người dùng",
  },
];

/**
 * Kiểm tra thông tin đăng nhập local.
 * Trả về { email, role, name } nếu hợp lệ, ngược lại null.
 */
export function authenticateLocal(
  email: string,
  password: string,
): { email: string; role: LocalRole; name: string } | null {
  const account = LOCAL_ACCOUNTS.find(
    (a) => a.email === email && a.password === password,
  );
  return account
    ? { email: account.email, role: account.role, name: account.name }
    : null;
}

/**
 * Kiểm tra thông tin đăng nhập local admin (giữ tương thích với code cũ).
 */
export function isLocalAdmin(email: string, password: string) {
  return email === LOCAL_ADMIN_EMAIL && password === LOCAL_ADMIN_PASSWORD;
}

/**
 * Giải mã role từ giá trị cookie session local.
 * Cookie có dạng: "1" (admin cũ) hoặc "admin" / "user".
 */
export function roleFromCookieValue(value: string): LocalRole {
  const v = value.trim();
  if (v === LOCAL_ROLE_USER) return LOCAL_ROLE_USER;
  return LOCAL_ROLE_ADMIN;
}

/**
 * Claims giả lập trả về cho session local — dùng chung ở server & proxy
 * để các trang protected coi như đã đăng nhập.
 */
export function localClaimsFor(role: LocalRole = LOCAL_ROLE_ADMIN) {
  const account = LOCAL_ACCOUNTS.find((a) => a.role === role);
  return {
    email: account?.email ?? LOCAL_ADMIN_DISPLAY_EMAIL,
    name: account?.name ?? "Quản trị viên",
    sub: role === LOCAL_ROLE_ADMIN ? "local-admin" : "local-user",
    role: role,
    is_local: true,
  };
}

/**
 * (Tương thích) Claims mặc định admin.
 */
export function localClaims() {
  return localClaimsFor(LOCAL_ROLE_ADMIN);
}

/**
 * Lấy claims local nếu cookie session local tồn tại, ngược lại trả null.
 * `cookieStore.getAll()` có thể truyền để đọc cookie.
 */
export function getLocalClaims(
  getAllCookies: () => { name: string; value: string }[],
): Record<string, unknown> | null {
  const cookies = getAllCookies();
  const session = cookies.find((c) => c.name === LOCAL_SESSION_COOKIE);
  if (!session || session.value === "") return null;
  return localClaimsFor(roleFromCookieValue(session.value));
}

/**
 * Bật manual session cookie (gọi từ client) với role xác định.
 * Cần path cố định & not HttpOnly.
 */
export function setLocalSessionClient(role: LocalRole = LOCAL_ROLE_ADMIN) {
  document.cookie = `${LOCAL_SESSION_COOKIE}=${role}; path=/; max-age=86400; samesite=lax`;
  window.dispatchEvent(new Event(LOCAL_SESSION_EVENT));
}

/**
 * Xoá manual session cookie từ client.
 */
export function clearLocalSessionClient() {
  document.cookie = `${LOCAL_SESSION_COOKIE}=; path=/; max-age=0`;
  window.dispatchEvent(new Event(LOCAL_SESSION_EVENT));
}

/**
 * Chỉ chạy trên client: kiểm tra có session local đang bật không.
 */
export function hasLocalSessionClient() {
  if (typeof window === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${LOCAL_SESSION_COOKIE}=`));
}

/**
 * Chỉ chạy trên client: role của session local (nếu có).
 */
export function localRoleClient(): LocalRole | null {
  if (typeof window === "undefined") return null;
  for (const c of document.cookie.split(";")) {
    const trimmed = c.trim();
    if (trimmed.startsWith(`${LOCAL_SESSION_COOKIE}=`)) {
      const value = trimmed.slice(LOCAL_SESSION_COOKIE.length + 1);
      return roleFromCookieValue(value);
    }
  }
  return null;
}

/**
 * Chỉ chạy trên client: email của session local (nếu có).
 */
export function localEmailClient(): string | null {
  if (typeof window === "undefined") return null;
  for (const c of document.cookie.split(";")) {
    const trimmed = c.trim();
    if (trimmed.startsWith(`${LOCAL_SESSION_COOKIE}=`)) {
      const value = trimmed.slice(LOCAL_SESSION_COOKIE.length + 1);
      const role = roleFromCookieValue(value);
      const account = LOCAL_ACCOUNTS.find((a) => a.role === role);
      return account?.email ?? null;
    }
  }
  return null;
}

/**
 * Email của người dùng local hiện tại (nếu có cookie). Dùng ở client để
 * set `createdBy` khi tạo thiệp & lọc danh sách.
 */
export function currentLocalEmail(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localEmailClient() ??
    (document.cookie
      .split(";")
      .some((c) => c.trim().startsWith(`${LOCAL_SESSION_COOKIE}=`))
      ? LOCAL_USER_EMAIL
      : null)
  );
}
