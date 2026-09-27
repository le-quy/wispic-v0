import type { NextResponse } from 'next/server'
import { fail, ErrorCode, isErrorResponse } from './api-response'
import { getSessionUser, type SessionUser } from './session'

/**
 * Guard cho API route. Chỉ kiểm tra ở server — không được dựa vào việc ẩn
 * nút ở client (spec 06-admin.md, 08-user-roles-and-permissions.md).
 */
export async function requireUser(): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser()
  if (!user) {
    return fail(ErrorCode.UNAUTHORIZED, 'Chưa đăng nhập')
  }
  return user
}

export async function requireAdmin(): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser()
  if (!user) {
    return fail(ErrorCode.UNAUTHORIZED, 'Chưa đăng nhập')
  }
  if (user.role !== 'admin') {
    return fail(ErrorCode.FORBIDDEN, 'Cần quyền quản trị viên')
  }
  return user
}

export { isErrorResponse as isAuthError }
