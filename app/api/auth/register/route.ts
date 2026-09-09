import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Thiếu email hoặc mật khẩu' }, { status: 400 })
    }

    const { rows: [existing] } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    if (existing) {
      return NextResponse.json({ error: 'Email đã được đăng ký' }, { status: 409 })
    }

    const { rows: [user] } = await pool.query(
      `INSERT INTO users (email, password, name, role)
       VALUES ($1, $2, $3, 'user') RETURNING id, email, name, role`,
      [email, password, name || '']
    )

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 })
  } catch (error) {
    console.error('POST /api/auth/register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}