import { getSessionUser } from '@/lib/session'
import { ok, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'

export const GET = withErrorHandling(async () => {
  const user = await getSessionUser()
  if (!user) return fail(ErrorCode.UNAUTHORIZED, 'Chưa đăng nhập')
  return ok(user)
}, 'GET /api/auth/me')
