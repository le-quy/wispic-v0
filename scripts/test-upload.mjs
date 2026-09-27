/**
 * Kiểm thử upload ảnh và route phục vụ /media.
 * Chạy: node --env-file=.env scripts/test-upload.mjs
 */
import { readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const BASE = 'http://localhost:3001'
const results = []
function check(name, pass, detail = '') {
  results.push({ name, pass })
  console.log(`  ${pass ? '✓' : '✗'} ${name}${detail ? `  ${detail}` : ''}`)
}

// Ảnh thật 2x2, dựng từ byte tối thiểu hợp lệ cho từng định dạng.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8Dwn4GBgYEJRsAAAD//wMAvL4j9AAAAASUVORK5CYII=',
  'base64'
)
const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

const login = await fetch(BASE + '/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@local.com', password: 'admin' }),
})
const cookie = login.headers.get('set-cookie')?.split(';')[0] ?? ''

async function upload(file, { auth = true, name = 'file' } = {}) {
  const form = new FormData()
  form.append(name, file)
  return fetch(BASE + '/api/uploads', {
    method: 'POST',
    headers: auth ? { cookie } : {},
    body: form,
  })
}

const UPLOADS = join(process.cwd(), '.uploads')
/** readdirSync là đồng bộ — dùng try/catch, không .catch được. */
function listUploads() {
  try { return readdirSync(UPLOADS) } catch { return [] }
}
const before = new Set(listUploads())

console.log('\nUpload ảnh\n')

// 1. Chưa đăng nhập
let res = await upload(new File([PNG], 'a.png', { type: 'image/png' }), { auth: false })
check('chưa đăng nhập bị từ chối', res.status === 401, `HTTP ${res.status}`)

// 2. PNG hợp lệ
res = await upload(new File([PNG], 'a.png', { type: 'image/png' }))
const png = await res.json().catch(() => ({}))
check('PNG hợp lệ được tải lên', res.status === 201 && png.data?.url?.startsWith('/media/'),
  `HTTP ${res.status} ${png.data?.url ?? ''}`)

// 3. Tên file độc hại không được dùng làm tên file trên đĩa
res = await upload(new File([PNG], '../../../etc/passwd.png', { type: 'image/png' }))
const evil = await res.json().catch(() => ({}))
check('tên file ../ bị bỏ qua, dùng UUID',
  /^\/media\/[0-9a-f-]{36}\.png$/.test(evil.data?.url ?? ''), evil.data?.url)

// 4. Nội dung không phải ảnh, dù khai type là image/png
res = await upload(new File([Buffer.from('<script>alert(1)</script>')], 'x.png', { type: 'image/png' }))
const fake = await res.json().catch(() => ({}))
check('HTML giả mạo .png bị từ chối', res.status === 422, `HTTP ${res.status} "${fake.error?.message}"`)

// 5. Đuôi file do server quyết định, không theo tên gốc
res = await upload(new File([GIF], 'ten-tam.png', { type: 'image/png' }))
const gif = await res.json().catch(() => ({}))
check('đuôi file lấy theo byte thật, không theo tên', gif.data?.url?.endsWith('.gif'), gif.data?.url)

// 6. Tệp quá lớn
res = await upload(new File([Buffer.alloc(6 * 1024 * 1024, 0xff)], 'big.png', { type: 'image/png' }))
const big = await res.json().catch(() => ({}))
check('tệp vượt 5 MB bị từ chối', res.status === 422, `HTTP ${res.status} "${big.error?.message}"`)

// 7. Thiếu trường file
res = await fetch(BASE + '/api/uploads', {
  method: 'POST',
  headers: { cookie },
  body: new FormData(),
})
check('thiếu trường "file" bị từ chối', res.status === 422, `HTTP ${res.status}`)

console.log('\nPhục vụ ảnh\n')

// 8. Đọc lại ảnh vừa tải
res = await fetch(BASE + png.data.url)
const bytes = Buffer.from(await res.arrayBuffer())
check('đọc lại ảnh đúng nội dung',
  res.status === 200 && bytes.equals(PNG) && res.headers.get('content-type') === 'image/png',
  `HTTP ${res.status} ${res.headers.get('content-type')} ${bytes.length}B`)

// 9. ETag / 304
const etag = res.headers.get('etag')
res = await fetch(BASE + png.data.url, { headers: { 'if-none-match': etag } })
check('If-None-Match trả 304', res.status === 304, `HTTP ${res.status}`)

// 10. Path traversal
for (const attack of ['/media/../../.env', '/media/%2e%2e%2f%2e%2e%2f.env', '/media/nope.png']) {
  res = await fetch(BASE + attack, { redirect: 'manual' })
  const text = res.status === 200 ? (await res.text()).slice(0, 40) : ''
  check(`tấn công đường dẫn bị chặn: ${attack}`,
    (res.status === 404 || res.status === 400) && !text.includes('DATABASE_URL'),
    `HTTP ${res.status}`)
}

// 11. Không phục vụ file không phải ảnh
res = await fetch(BASE + '/media/abc.html')
check('không phục vụ .html', res.status === 404, `HTTP ${res.status}`)

// 12. Cache header
res = await fetch(BASE + png.data.url)
check('cache immutable + nosniff',
  res.headers.get('cache-control')?.includes('immutable') &&
  res.headers.get('x-content-type-options') === 'nosniff')

// Dọn file test
const after = listUploads()
const created = after.filter((f) => !before.has(f))
for (const f of created) rmSync(join(UPLOADS, f), { force: true })
console.log(`\n  đã xoá ${created.length} file test`)

const failed = results.filter((r) => !r.pass).length
console.log(`\n  ${results.length - failed}/${results.length} đạt`)
if (failed) process.exitCode = 1
