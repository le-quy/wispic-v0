import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = (body.email || 'user@gmail.com').trim().toLowerCase()
    const name = body.name || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Google User')

    // Find existing user by email
    const { rows: existingRows } = await pool.query(
      'SELECT id, email, name, role FROM users WHERE email = $1',
      [email]
    )

    let user = existingRows[0]

    if (!user) {
      // Create new user for this Gmail account
      const { rows: newRows } = await pool.query(
        `INSERT INTO users (email, password, name, role)
         VALUES ($1, 'google_oauth_authorized', $2, 'user')
         RETURNING id, email, name, role`,
        [email, name]
      )
      user = newRows[0]
    }

    if (!user) {
      return NextResponse.json({ error: 'Không thể tạo phiên đăng nhập Google' }, { status: 500 })
    }

    const cookieStore = await cookies()
    cookieStore.set('wispic_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('POST /api/auth/google error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
