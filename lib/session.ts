import { cookies } from 'next/headers'
import { randomBytes } from 'node:crypto'
import { pool } from './db'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export const SESSION_COOKIE = 'wispic_session'
export const SESSION_TTL_DAYS = 30

const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000

/**
 * Token phiên là chuỗi ngẫu nhiên 32 byte, KHÔNG phải user id.
 * Đọc DB mỗi request nên quyền được lấy từ `users.role` — không có
 * đường nào để tự dựng cookie mà không cần biết mật khẩu.
 */
export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await pool.query(
    'INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)',
    [token, userId, expiresAt]
  )

  return token
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null

    const { rows } = await pool.query<SessionUser>(
      `SELECT u.id, u.email, u.name, u.role
         FROM sessions s
         JOIN users u ON u.id = s.user_id
        WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    )

    return rows[0] ?? null
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await pool.query('DELETE FROM sessions WHERE token = $1', [token])
  }
}

export async function getCurrentRole(): Promise<'admin' | 'user' | null> {
  const user = await getSessionUser()
  return user?.role ?? null
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getSessionUser()
  return user?.id ?? null
}
