import { cookies } from 'next/headers'
import pool from '@/lib/db'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export const MOCK_ADMIN_USER: SessionUser = {
  id: 'a0000000-0000-0000-0000-000000000001',
  email: 'admin@local.com',
  name: 'Quản trị viên (Admin Demo)',
  role: 'admin',
}

export const MOCK_NORMAL_USER: SessionUser = {
  id: 'a0000000-0000-0000-0000-000000000002',
  email: 'user@local.com',
  name: 'Cặp đôi (User Demo)',
  role: 'user',
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('wispic_session')?.value
    if (!sessionId) return null

    // Check predefined mock IDs
    if (sessionId === MOCK_ADMIN_USER.id) return MOCK_ADMIN_USER
    if (sessionId === MOCK_NORMAL_USER.id) return MOCK_NORMAL_USER

    const { rows } = await pool.query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [sessionId]
    )
    return rows[0] || null
  } catch {
    return null
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
