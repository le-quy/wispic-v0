/**
 * Vòng lưu thật của editor: GET -> PATCH lại đúng payload đó -> so sánh.
 * Đây là kịch bản đã từng xoá sạch dữ liệu khi PUT full-replace.
 * Chạy: node --env-file=.env scripts/test-wedding-roundtrip.mjs
 */
import { readFileSync } from 'node:fs'
import pg from 'pg'

const W = '82c6218a-566e-42f7-828d-a02ad4e453ad'
const BACKUP = JSON.parse(readFileSync('/tmp/wispic-b6/pre-b6.json', 'utf8'))
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })

/** Bỏ các trường do server sở hữu — giống hệt serverOwnedFields() ở client. */
function editorPayload(draft) {
  const { id, userId, createdBy, createdAt, updatedAt, ...rest } = draft
  void id; void userId; void createdBy; void createdAt; void updatedAt
  return rest
}

async function snapshot() {
  const { rows: [w] } = await client.query('SELECT * FROM weddings WHERE id = $1', [W])
  const subs = {}
  for (const t of ['wedding_photos', 'timeline_events', 'dress_code_colors']) {
    const { rows } = await client.query(
      `SELECT * FROM ${t} WHERE wedding_id = $1 ORDER BY sort_order`, [W]
    )
    // id/created_at sinh mới mỗi lần chèn — không so sánh
    subs[t] = rows.map((r) => {
      const { id, created_at, ...rest } = r
      void id; void created_at
      return rest
    })
  }
  const { updated_at, ...wRest } = w
  void updated_at
  return { wedding: wRest, subs }
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
  const BASE = 'http://localhost:3001'
  const login = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@local.com', password: 'admin' }),
  })
  const cookie = login.headers.get('set-cookie')?.split(';')[0] ?? ''

  const before = await snapshot()
  const draft = (await (await fetch(`${BASE}/api/weddings/${W}`, { headers: { cookie } })).json()).data

  // Vòng lưu: gửi lại nguyên payload editor vừa nhận.
  const res = await fetch(`${BASE}/api/weddings/${W}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify(editorPayload(draft)),
  })
  console.log(`  PATCH vòng lưu editor: HTTP ${res.status}`)

  // Sửa thêm một trường như editor autosave, rồi lưu lại lần nữa.
  draft.bride = 'Paoziiee'
  const res2 = await fetch(`${BASE}/api/weddings/${W}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify(editorPayload(draft)),
  })
  console.log(`  PATCH lần 2:           HTTP ${res2.status}`)

  const after = await snapshot()
  const diffs = []
  for (const k of Object.keys(before.wedding)) {
    if (k === 'updated_at') continue
    if (JSON.stringify(before.wedding[k]) !== JSON.stringify(after.wedding[k])) {
      diffs.push(`weddings.${k}: ${JSON.stringify(before.wedding[k])?.slice(0, 40)} -> ${JSON.stringify(after.wedding[k])?.slice(0, 40)}`)
    }
  }
  for (const t of Object.keys(before.subs)) {
    if (JSON.stringify(before.subs[t]) !== JSON.stringify(after.subs[t])) {
      diffs.push(`${t}: ${before.subs[t].length} -> ${after.subs[t].length} dòng`)
    }
  }
  console.log(diffs.length === 0
    ? '  ✓ dữ liệu giống hệt sau 2 vòng lưu (0 khác biệt)'
    : '  ✗ khác biệt:\n' + diffs.map((d) => '     ' + d).join('\n'))

  const expected = before.wedding.bride === 'Paoziiee'
  console.log(`  ${expected ? '✓' : '✗'} thay đổi của editor được ghi nhận`)
  if (diffs.length || !expected) process.exitCode = 1
} finally {
  await restore()
  const { rows: [w] } = await client.query(
    'SELECT title, groom, bride, status FROM weddings WHERE id = $1', [W]
  )
  const { rows: [p] } = await client.query('SELECT count(*)::int n FROM wedding_photos')
  console.log(`  đã hoàn tác: "${w.title}" ${w.groom} & ${w.bride} · photos=${p.n} · ${w.status}`)
  await client.end()
}
