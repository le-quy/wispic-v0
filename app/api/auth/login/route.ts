import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const { rows } = await pool.query(
      'SELECT id, email, name, role, password FROM users WHERE email = $1',
      [email]
    )

    const user = rows[0]
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set('wispic_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role })
  } catch (error) {
    console.error('POST /api/auth/login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}