/**
 * Upload ảnh -> gắn vào thiệp -> xuất hiện trên trang public -> dọn dẹp.
 * Chạy: node --env-file=.env scripts/test-upload-e2e.mjs
 */
import { readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'

const W = '82c6218a-566e-42f7-828d-a02ad4e453ad'
const UPLOADS = join(process.cwd(), '.uploads')
const BASE = 'http://localhost:3001'
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8Dwn4GBgYEJRsAAAD//wMAvL4j9AAAAASUVORK5CYII=',
  'base64'
)

const before = new Set((() => { try { return readdirSync(UPLOADS) } catch { return [] } })())
const created = []
const results = []
function check(name, pass, detail = '') {
  results.push(pass)
  console.log(`  ${pass ? '✓' : '✗'} ${name}${detail ? `  ${detail}` : ''}`)
}

await client.connect()
try {
  const login = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@local.com', password: 'admin' }),
  })
  const cookie = login.headers.get('set-cookie')?.split(';')[0] ?? ''
  const H = { cookie, 'Content-Type': 'application/json' }

  console.log('\nUpload -> lưu -> hiển thị\n')

  // 1. Tải ảnh lên
  const form = new FormData()
  form.append('file', new File([PNG], 'ky-niem.png', { type: 'image/png' }))
  let res = await fetch(BASE + '/api/uploads', { method: 'POST', headers: { cookie }, body: form })
  const { url } = (await res.json()).data
  created.push(url.split('/').pop())
  check('tải ảnh lên', res.status === 201, url)

  // 2. Gắn vào album thiệp (PATCH)
  const draft = (await (await fetch(`${BASE}/api/weddings/${W}`, { headers: H })).json()).data
  const withPhoto = { ...draft, photos: [...draft.photos, { id: 'tmp-1', url, alt: 'Ảnh vừa tải' }] }
  delete withPhoto.userId; delete withPhoto.createdBy; delete withPhoto.createdAt; delete withPhoto.updatedAt
  res = await fetch(`${BASE}/api/weddings/${W}`, {
    method: 'PATCH', headers: H, body: JSON.stringify(withPhoto),
  })
  check('PATCH gắn ảnh vào album', res.status === 200, `HTTP ${res.status}`)

  // 3. Ảnh nằm trong DB dưới dạng URL, không phải base64
  const { rows } = await client.query(
    'SELECT url, alt FROM wedding_photos WHERE wedding_id = $1 AND url LIKE $2', [W, '/media/%']
  )
  const isUrl = rows[0]?.url === url
  const noBase64 = rows.every((r) => !r.url.startsWith('data:'))
  check('DB lưu URL, không lưu base64', isUrl && noBase64, rows[0]?.url)

  // 4. Ảnh phục vụ được qua /media
  res = await fetch(BASE + url)
  check('ảnh trả về đúng bytes', res.status === 200 && Buffer.from(await res.arrayBuffer()).equals(PNG))

  // 5. Xuất hiện trên trang public khi thiệp PUBLISHED
  await client.query("UPDATE weddings SET status = 'PUBLISHED' WHERE id = $1", [W])
  res = await fetch(`${BASE}/w/wis-paoziiee`)
  const html = await res.text()
  check('ảnh xuất hiện trong HTML thiệp public', html.includes(url), `HTTP ${res.status}`)
  check('không còn base64 trong HTML', !html.includes('data:image'))

  // 6. Ảnh cũ trong DB vẫn hiển thị (không bị mất khi PATCH)
  const { rows: all } = await client.query(
    'SELECT count(*)::int n FROM wedding_photos WHERE wedding_id = $1', [W]
  )
  check('album giữ đủ ảnh cũ + ảnh mới', all[0].n === 4, `${all[0].n} ảnh`)
} finally {
  await client.query("UPDATE weddings SET status = 'DRAFT' WHERE id = $1", [W])
  await client.query("DELETE FROM wedding_photos WHERE wedding_id = $1 AND url LIKE '/media/%'", [W])
  for (const f of created) rmSync(join(UPLOADS, f), { force: true })
  const { rows: [r] } = await client.query(
    'SELECT title, status FROM weddings WHERE id = $1', [W])
  const { rows: [p] } = await client.query(
    'SELECT count(*)::int n FROM wedding_photos WHERE wedding_id = $1', [W])
  const left = readdirSync(UPLOADS).filter((f) => !before.has(f))
  console.log(`\n  đã dọn: "${r.title}" ${r.status} · ${p.n} ảnh · ${left.length} file rác`)
  await client.end()
}

const failed = results.filter((r) => !r).length
console.log(`  ${results.length - failed}/${results.length} đạt`)
if (failed) process.exitCode = 1
