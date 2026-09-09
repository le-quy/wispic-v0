import { type NextRequest, NextResponse } from "next/server";

// Session cookie được set bởi POST /api/auth/login
const SESSION_COOKIE = "wispic_session";

export async function proxy(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  // Protected routes: /dashboard và /protected
  const isProtected =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/protected");

  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Đã đăng nhập nhưng truy cập trang login/sign-up → về dashboard
  if (session && (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname.startsWith("/auth/sign-up"))) {
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