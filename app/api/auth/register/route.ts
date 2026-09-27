import { cookies } from 'next/headers'
import { pool } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { createSession, SESSION_COOKIE, SESSION_TTL_DAYS } from '@/lib/session'
import { created, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'
import { FieldErrors, str } from '@/lib/validation'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

export const POST = withErrorHandling(async (request: Request) => {
  const { email, password, name } = await request.json()

  const errors = new FieldErrors()
  const normalizedEmail = str(email).toLowerCase()

  if (!normalizedEmail) errors.add('email', 'Email là bắt buộc')
  else if (!EMAIL_PATTERN.test(normalizedEmail)) errors.add('email', 'Email không hợp lệ')

  if (typeof password !== 'string' || !password) {
    errors.add('password', 'Mật khẩu là bắt buộc')
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.add('password', `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`)
  }

  if (!errors.isEmpty) {
    return fail(ErrorCode.VALIDATION_ERROR, 'Dữ liệu không hợp lệ', { fields: errors.fields })
  }

  const passwordHash = await hashPassword(password)

  // Dựa vào ràng buộc UNIQUE thay vì SELECT rồi INSERT: tránh cửa sổ
  // tranh chấp khi hai người đăng ký cùng email đúng một lúc.
  const { rows } = await pool.query<{ id: string; email: string; name: string; role: 'admin' | 'user' }>(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, 'user')
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, name, role`,
    [normalizedEmail, passwordHash, str(name)]
  )

  const user = rows[0]
  if (!user) {
    return fail(ErrorCode.CONFLICT, 'Email đã được đăng ký', { fields: { email: 'Email đã tồn tại' } })
  }

  const token = await createSession(user.id)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
    path: '/',
  })

  return created({ id: user.id, email: user.email, name: user.name, role: user.role })
}, 'POST /api/auth/register')
