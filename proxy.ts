import { type NextRequest, NextResponse } from "next/server";

// Session cookie được set bởi POST /api/auth/login
const SESSION_COOKIE = "wispic_session";

export async function proxy(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  // Protected routes: /dashboard (user workspace) và /admin (chỉ quản trị)
  // /protected đã bị gỡ — không còn route nào dùng nó.
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Đã đăng nhập nhưng truy cập trang login/sign-up → về dashboard
  if (session && (pathname === "/auth/login" || pathname.startsWith("/auth/sign-up"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
