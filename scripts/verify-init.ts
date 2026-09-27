/**
 * Kiểm tra init.sql + seed.sql tạo được DB sạch đúng schema Level 2.
 * Tự tạo database tạm rồi xoá, không đụng DB thật.
 *
 *   node --env-file=.env scripts/verify-init.ts
 */
import { Client } from 'pg'
import { readFileSync } from 'node:fs'

const root = process.env.DATABASE_URL
if (!root) throw new Error('Thiếu DATABASE_URL')

const dbName = new URL(root).pathname.slice(1)
const TEST_DB = 'wispic_init_check'

const admin = new Client({ connectionString: root })
await admin.connect()
await admin.query(`DROP DATABASE IF EXISTS ${TEST_DB}`)
await admin.query(`CREATE DATABASE ${TEST_DB}`)
await admin.end()

const test = new Client({ connectionString: root.replace(`/${dbName}`, `/${TEST_DB}`) })
await test.connect()

let failed = false
try {
  await test.query(readFileSync('database/init.sql', 'utf8'))
  console.log('init.sql: OK')

  await test.query(readFileSync('database/seed.sql', 'utf8'))
  console.log('seed.sql: OK')

  const tables = await test.query(
    "select table_name from information_schema.tables where table_schema='public' order by 1"
  )
  console.log('\nBảng (' + tables.rows.length + '):', tables.rows.map((r) => r.table_name).join(', '))

  const expected = [
    'articles',
    'bookings',
    'photos',
    'photography_collections',
    'sessions',
    'templates',
    'weddings',
  ]
  const actual = tables.rows.map((r) => r.table_name)
  const missing = expected.filter((t) => !actual.includes(t))
  if (missing.length) {
    failed = true
    console.error('\nTHIẾU bảng:', missing.join(', '))
  }

  console.log('\nTemplates sau seed:')
  console.table((await test.query('select slug, template_key, status, is_custom from templates order by created_at')).rows)

  console.log('Users sau seed:')
  console.table((await test.query("select email, left(password_hash, 20) || '…' AS hash, role from users")).rows)

  const noHash = await test.query('select count(*)::int n from users where password_hash is null')
  if (noHash.rows[0].n > 0) {
    failed = true
    console.error('\nCÓ user chưa hash:', noHash.rows[0].n)
  } else {
    console.log('\nMọi user đều có password_hash ✓')
  }

  console.log(failed ? '\nKẾT QUẢ: LỖI' : '\nKẾT QUẢ: ĐẠT')
} catch (error) {
  failed = true
  console.error('FAIL:', (error as Error).message)
} finally {
  await test.end()
  const cleanup = new Client({ connectionString: root })
  await cleanup.connect()
  await cleanup.query(`DROP DATABASE IF EXISTS ${TEST_DB}`)
  await cleanup.end()
  console.log(`Đã xoá database tạm ${TEST_DB}`)
}

process.exitCode = failed ? 1 : 0
