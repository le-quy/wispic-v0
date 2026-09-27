/**
 * Backfill users.password_hash từ users.password (plaintext) cũ, rồi xoá cột.
 *
 *   node --env-file=.env --experimental-strip-types scripts/hash-passwords.ts --migrate
 *   node --env-file=.env --experimental-strip-types scripts/hash-passwords.ts --print "admin" "user"
 *
 * Quy tắc an toàn: chỉ DROP COLUMN users.password khi KHÔNG còn user nào
 * mang mật khẩu chưa hash. Nếu còn, script báo và dừng.
 */
import { Pool } from 'pg'
import { hashPassword } from '../lib/password.ts'

function createPool() {
  const connectionString = process.env.DATABASE_URL
  const hasCustomHost = !!process.env.DB_HOST && process.env.DB_HOST !== 'localhost'

  if (!connectionString && !hasCustomHost) {
    throw new Error('Thiếu DATABASE_URL hoặc DB_HOST...')
  }

  return new Pool(
    connectionString
      ? { connectionString }
      : {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432'),
          database: process.env.DB_NAME || 'wicpic',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || '',
        }
  )
}

async function migrate() {
  const pool = createPool()
  try {
    const { rows: hasHash } = await pool.query(
      "SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password_hash'"
    )
    if (!hasHash[0]) {
      console.error('Chưa có cột users.password_hash. Hãy chạy migration-2026-09-26-sessions.sql trước.')
      process.exitCode = 1
      return
    }

    const { rows } = await pool.query(
      `SELECT id, email, password, password_hash
         FROM users
        WHERE password_hash IS NULL
        ORDER BY created_at ASC`
    )

    if (rows.length === 0) {
      console.log('Không còn user nào thiếu hash.')
    }

    for (const row of rows) {
      if (!row.password) {
        console.warn(`  BỎ QUA ${row.email}: không có mật khẩu plaintext để hash`)
        continue
      }
      const hash = await hashPassword(row.password)
      await pool.query('UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1', [
        row.id,
        hash,
      ])
      console.log(`  OK  ${row.email}`)
    }

    const { rows: remaining } = await pool.query(
      'SELECT id, email FROM users WHERE password_hash IS NULL'
    )
    if (remaining.length > 0) {
      console.error('\nCòn user chưa có hash — KHÔNG xoá cột password. Cần reset mật khẩu cho các user:')
      remaining.forEach((r) => console.error(`  - ${r.email} (${r.id})`))
      process.exitCode = 1
      return
    }

    await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS password')
    console.log('\nĐã hash toàn bộ và DROP COLUMN users.password.')
  } finally {
    await pool.end()
  }
}

async function print(...passwords: string[]) {
  for (const password of passwords) {
    if (!password) continue
    console.log(`${password}\t${await hashPassword(password)}`)
  }
}

const [command, ...args] = process.argv.slice(2)

if (command === '--migrate') {
  await migrate()
} else if (command === '--print') {
  await print(...args)
} else {
  console.log('Dùng: --migrate | --print <password...>')
  process.exitCode = 1
}
