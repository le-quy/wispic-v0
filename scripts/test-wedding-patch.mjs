/**
 * Kiểm thử PATCH bán phần trên thiệp thật.
 * Chạy: node --env-file=.env scripts/test-wedding-patch.mjs
 *
 * Mọi thay đổi trên DB đều được hoàn tác lại từ /tmp/wispic-b6/pre-b6.json
 * trước khi thoát, kể cả khi script lỗi.
 */
import { readFileSync } from 'node:fs'
import pg from 'pg'

const W = '82c6218a-566e-42f7-828d-a02ad4e453ad'
const BASE = 'http://localhost:3001'
const BACKUP = JSON.parse(readFileSync('/tmp/wispic-b6/pre-b6.json', 'utf8'))
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })

const results = []
function check(name, pass, detail = '') {
  results.push({ name, pass, detail })
  console.log(`  ${pass ? '✓' : '✗'} ${name}${detail ? `  ${detail}` : ''}`)
}

async function wedding() {
  const { rows } = await client.query('SELECT * FROM weddings WHERE id = $1', [W])
  return rows[0]
}
async function count(table) {
  const { rows } = await client.query(`SELECT count(*)::int n FROM ${table} WHERE wedding_id = $1`, [W])
  return rows[0].n
}

async function restore() {
  const w = BACKUP.weddings[0]
  const cols = Object.keys(w).filter((k) => k !== 'id')
  await client.query(
    `UPDATE weddings SET ${cols.map((c, i) => `${c} = $${i + 2}`).join(', ')} WHERE id = $1`,
    [W, ...cols.map((c) => w[c])]
  )
  for (const t of ['wedding_photos', 'timeline_events', 'dress_code_colors']) {
    await client.query(`DELETE FROM ${t} WHERE wedding_id = $1`, [W])
    for (const r of BACKUP[t]) {
      const k = Object.keys(r).filter((c) => c !== 'id')
      await client.query(
        `INSERT INTO ${t} (${k.join(', ')}) VALUES (${k.map((_, i) => `$${i + 1}`).join(', ')})`,
        k.map((c) => r[c])
      )
    }
  }
}

await client.connect()
try {
  const login = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@local.com', password: 'admin' }),
  })
  const cookie = login.headers.get('set-cookie')?.split(';')[0] ?? ''
  const patch = (body) =>
    fetch(`${BASE}/api/weddings/${W}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', cookie },
      body: JSON.stringify(body),
    })

  console.log('\nPATCH bán phần — thiệp ' + W + '\n')

  // 1. Sửa một trường, mọi thứ khác phải giữ nguyên
  const before = await wedding()
  const beforeCounts = {
    photos: await count('wedding_photos'),
    timeline: await count('timeline_events'),
  }
  let res = await patch({ title: 'Tên khác' })
  let now = await wedding()
  check(
    'đổi title giữ nguyên mọi cột khác',
    now.groom === before.groom &&
      now.bride === before.bride &&
      now.groom_parents === before.groom_parents &&
      now.introduction === before.introduction &&
      (await count('wedding_photos')) === beforeCounts.photos &&
      (await count('timeline_events')) === beforeCounts.timeline,
    `HTTP ${res.status}`
  )
  check('đổi title KHÔNG đổi slug', now.slug === before.slug, `slug=${now.slug}`)

  // 2. avatar: null phải gỡ ảnh
  res = await patch({ avatar: null })
  now = await wedding()
  check('avatar:null gỡ được ảnh', now.avatar_url === null, `HTTP ${res.status} avatar_url=${now.avatar_url}`)

  // 3. null khác null: set lại avatar
  res = await patch({ avatar: { url: 'https://images.unsplash.com/photo-1', alt: 'x' } })
  now = await wedding()
  check('set lại avatar được', now.avatar_url === 'https://images.unsplash.com/photo-1' && now.avatar_alt === 'x')

  // 4. false phải được áp dụng (không bị coi là "thiếu")
  res = await patch({ music: { enabled: false } })
  now = await wedding()
  check('music.enabled:false được ghi', now.music_enabled === false)

  // 5. rỗng rõ ràng = xoá
  res = await patch({ photos: [] })
  check('photos:[] xoá album', (await count('wedding_photos')) === 0, `HTTP ${res.status}`)

  // 6. không nhắc tới thì giữ nguyên
  res = await patch({ bride: 'Paoziiee' })
  check('không nhắc photos → giữ album đã xoá, timeline nguyên vẹn', (await count('timeline_events')) === 3)
  res = await patch({ timeline: [] })
  check('timeline:[] xoá timeline', (await count('timeline_events')) === 0, `HTTP ${res.status}`)

  // 7. body rỗng bị từ chối
  res = await patch({})
  const msg = (await res.json().catch(() => ({})))?.error?.message
  check('body rỗng bị từ chối', res.status >= 400, `HTTP ${res.status} "${msg}"`)

  // 8. slug tường minh vẫn được đặt
  res = await patch({ slug: 'wis-paoziiee' })
  now = await wedding()
  check('slug tường minh được áp dụng', now.slug === 'wis-paoziiee')

  // 9. cột không nằm trong allowlist bị bỏ qua
  res = await patch({ userId: '11111111-1111-1111-1111-111111111111', status: 'PUBLISHED' })
  now = await wedding()
  check('không đổi được userId qua body', now.user_id !== '11111111-1111-1111-1111-111111111111')
  await client.query("UPDATE weddings SET status = 'DRAFT' WHERE id = $1", [W])

  const failed = results.filter((r) => !r.pass)
  console.log(`\n  ${results.length - failed.length}/${results.length} đạt`)
  if (failed.length) process.exitCode = 1
} finally {
  await restore()
  const w = (await wedding()).title
  const p = await count('wedding_photos')
  const t = await count('timeline_events')
  console.log(`\n  đã hoàn tác: title="${w}" photos=${p} timeline=${t}`)
  await client.end()
}
