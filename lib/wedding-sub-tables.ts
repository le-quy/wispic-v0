import type { PoolClient } from 'pg'

const SUB_TABLES = [
  'wedding_photos',
  'rsvp_questions',
  'gift_accounts',
  'timeline_events',
  'dress_code_colors',
  'guestbook_questions',
] as const

type SubTable = (typeof SUB_TABLES)[number]

/** Bảng con nào được thay thế, theo nhóm trường trong body. */
const TABLE_FOR_FIELD: { table: SubTable; has: (body: any) => boolean }[] = [
  { table: 'wedding_photos', has: (body) => Array.isArray(body?.photos) },
  { table: 'rsvp_questions', has: (body) => Array.isArray(body?.rsvp?.questions) },
  { table: 'gift_accounts', has: (body) => Array.isArray(body?.gift?.accounts) },
  { table: 'timeline_events', has: (body) => Array.isArray(body?.timeline) },
  { table: 'dress_code_colors', has: (body) => Array.isArray(body?.dressCode?.colors) },
  { table: 'guestbook_questions', has: (body) => Array.isArray(body?.guestbook?.questions) },
]

export async function insertWeddingSubTables(client: PoolClient, weddingId: string, body: any) {
  const photos: any[] = body?.photos ?? []
  for (let i = 0; i < photos.length; i++) {
    await client.query(
      'INSERT INTO wedding_photos (wedding_id, url, alt, sort_order) VALUES ($1, $2, $3, $4)',
      [weddingId, photos[i].url, photos[i].alt || '', i]
    )
  }

  const rsvpQuestions: any[] = body?.rsvp?.questions ?? []
  for (let i = 0; i < rsvpQuestions.length; i++) {
    await client.query(
      'INSERT INTO rsvp_questions (wedding_id, text, type, sort_order) VALUES ($1, $2, $3, $4)',
      [weddingId, rsvpQuestions[i].text, rsvpQuestions[i].type, i]
    )
  }

  const accounts: any[] = body?.gift?.accounts ?? []
  for (let i = 0; i < accounts.length; i++) {
    await client.query(
      `INSERT INTO gift_accounts (wedding_id, bank_name, account_number, holder_name, qr_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        weddingId,
        accounts[i].bankName,
        accounts[i].accountNumber,
        accounts[i].holderName,
        accounts[i].qrUrl || '',
        i,
      ]
    )
  }

  const timeline: any[] = body?.timeline ?? []
  for (let i = 0; i < timeline.length; i++) {
    await client.query(
      'INSERT INTO timeline_events (wedding_id, time, title, sort_order) VALUES ($1, $2, $3, $4)',
      [weddingId, timeline[i].time, timeline[i].title, i]
    )
  }

  const colors: string[] = body?.dressCode?.colors ?? []
  for (let i = 0; i < colors.length; i++) {
    await client.query(
      'INSERT INTO dress_code_colors (wedding_id, color, sort_order) VALUES ($1, $2, $3)',
      [weddingId, colors[i], i]
    )
  }

  const guestbookQuestions: any[] = body?.guestbook?.questions ?? []
  for (let i = 0; i < guestbookQuestions.length; i++) {
    await client.query(
      'INSERT INTO guestbook_questions (wedding_id, text, type, sort_order) VALUES ($1, $2, $3, $4)',
      [weddingId, guestbookQuestions[i].text, guestbookQuestions[i].type, i]
    )
  }
}

/**
 * Xoá rồi chèn lại toàn bộ bảng con. Phải nằm trong cùng transaction với
 * UPDATE chính, nếu không lỗi giữa chừng sẽ để lại thiệp mất sạch ảnh/câu hỏi.
 */
export async function replaceWeddingSubTables(client: PoolClient, weddingId: string, body: any) {
  for (const table of SUB_TABLES) {
    await client.query(`DELETE FROM ${table} WHERE wedding_id = $1`, [weddingId])
  }
  await insertWeddingSubTables(client, weddingId, body)
}

/** Body có nhắc tới ít nhất một nhóm bảng con hay không. */
export function hasWeddingSubTableFields(body: any) {
  return TABLE_FOR_FIELD.some((entry) => entry.has(body))
}

/**
 * Bản PATCH: chỉ thay nhóm bảng con thực sự có trong body.
 *
 * `replaceWeddingSubTables` xoá cả 6 bảng rồi chèn lại theo body, nên body
 * không có `photos` sẽ xoá sạch album của thiệp. Bản này giữ nguyên nhóm không
 * được nhắc tới.
 */
export async function patchWeddingSubTables(client: PoolClient, weddingId: string, body: any) {
  const targeted = TABLE_FOR_FIELD.filter((entry) => entry.has(body))
  if (targeted.length === 0) return

  for (const { table } of targeted) {
    await client.query(`DELETE FROM ${table} WHERE wedding_id = $1`, [weddingId])
  }
  await insertWeddingSubTables(client, weddingId, body)
}
