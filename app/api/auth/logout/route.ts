import { cookies } from 'next/headers'
import { destroySession, SESSION_COOKIE } from '@/lib/session'
import { ok, withErrorHandling } from '@/lib/api-response'

export const POST = withErrorHandling(async () => {
  await destroySession()
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  return ok({ success: true })
}, 'POST /api/auth/logout')
