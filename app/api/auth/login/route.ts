import { cookies } from 'next/headers'
import { pool } from '@/lib/db'
import { verifyPassword, getDummyHash } from '@/lib/password'
import { createSession, SESSION_COOKIE, SESSION_TTL_DAYS } from '@/lib/session'
import { ok, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'
import { str } from '@/lib/validation'

async function setSessionCookie(userId: string) {
  const token = await createSession(userId)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
    path: '/',
  })
}

export const POST = withErrorHandling(async (request: Request) => {
  const { email, password } = await request.json()

  const normalizedEmail = str(email).toLowerCase()
  if (!normalizedEmail || typeof password !== 'string' || !password) {
    return fail(ErrorCode.VALIDATION_ERROR, 'Thiếu email hoặc mật khẩu', {
      fields: { ...(normalizedEmail ? {} : { email: 'Thiếu email' }) },
    })
  }

  const { rows } = await pool.query<{
    id: string
    email: string
    name: string
    role: 'admin' | 'user'
    password_hash: string | null
  }>(
    'SELECT id, email, name, role, password_hash FROM users WHERE email = $1',
    [normalizedEmail]
  )

  const user = rows[0]

  // So sánh với hash giả khi không có user, để không lộ email nào tồn tại
  // và không tiết lộ qua thời gian xử lý rằng email có hay không.
  const passwordMatches = await verifyPassword(
    password,
    user?.password_hash ?? (await getDummyHash())
  )

  if (!user || !user.password_hash || !passwordMatches) {
    return fail(ErrorCode.UNAUTHORIZED, 'Email hoặc mật khẩu không đúng')
  }

  await setSessionCookie(user.id)
  return ok({ id: user.id, email: user.email, name: user.name, role: user.role })
}, 'POST /api/auth/login')
