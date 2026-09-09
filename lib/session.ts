import { cookies } from 'next/headers'
import pool from '@/lib/db'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('wispic_session')?.value
    if (!sessionId) return null

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