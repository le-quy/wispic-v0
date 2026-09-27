import { pool, withTransaction } from '@/lib/db'
import { requireUser, isAuthError } from '@/lib/api-auth'
import { WEDDING_SELECT, mapRowToWedding } from '@/lib/wedding-mapper'
import { insertWeddingSubTables } from '@/lib/wedding-sub-tables'
import { weddingInsertParams } from '@/lib/wedding-write'
import { uniqueSlug } from '@/lib/slug'
import { ok, created, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'
import { isWeddingStatus } from '@/lib/status'
import { isUuid } from '@/lib/validation'

const MAX_LIMIT = 200

export const GET = withErrorHandling(async (request: Request) => {
  const actor = await requireUser()
  if (isAuthError(actor)) return actor

  const { searchParams } = new URL(request.url)
  const params: unknown[] = []
  const conditions: string[] = []

  // USER chỉ thấy thiệp của chính mình — không có đường nào để yêu cầu
  // userId khác (trước đây ?userId= đọc được draft của mọi người).
  if (actor.role === 'admin') {
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (userId) {
      if (!isUuid(userId)) {
        return fail(ErrorCode.VALIDATION_ERROR, 'userId không hợp lệ')
      }
      params.push(userId)
      conditions.push(`w.user_id = $${params.length}`)
    }
    if (status) {
      if (!isWeddingStatus(status)) {
        return fail(ErrorCode.VALIDATION_ERROR, 'status không hợp lệ')
      }
      params.push(status)
      conditions.push(`w.status = $${params.length}`)
    }
  } else {
    params.push(actor.id)
    conditions.push(`w.user_id = $${params.length}`)
  }

  params.push(MAX_LIMIT)
  const limitParam = `$${params.length}`

  const query =
    WEDDING_SELECT +
    (conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '') +
    ` ORDER BY w.updated_at DESC LIMIT ${limitParam}`

  const result = await pool.query(query, params)
  return ok(result.rows.map(mapRowToWedding), { total: result.rows.length })
}, 'GET /api/weddings')

export const POST = withErrorHandling(async (request: Request) => {
  const actor = await requireUser()
  if (isAuthError(actor)) return actor

  const body = await request.json()

  // `id` và `userId` trong body bị bỏ qua: server tự sinh id và gán chủ sở hữu.
  const weddingId = await withTransaction(async (client) => {
    const slug = await uniqueSlug(client, 'weddings', body?.title || 'wedding')

    const { rows } = await client.query(
      `INSERT INTO weddings (
        user_id, template_id, template_key, title, slug, status,
        groom, bride, groom_parents, bride_parents, wedding_date,
        ceremony, reception, location,
        introduction, couple_story,
        avatar_url, avatar_alt, couple_photo_url, couple_photo_alt,
        rsvp_enabled, rsvp_display_mode, rsvp_max_guest_count,
        gift_enabled, gift_display_mode, gift_title,
        dress_code_enabled, dress_code_title, dress_code_subtitle,
        music_enabled, music_url, music_title,
        guestbook_enabled, envelope_greeting,
        og_style, og_custom_url,
        map_embed_url, map_address
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14,
        $15, $16,
        $17, $18, $19, $20,
        $21, $22, $23,
        $24, $25, $26,
        $27, $28, $29,
        $30, $31, $32,
        $33, $34,
        $35, $36,
        $37, $38
      ) RETURNING id`,
      weddingInsertParams(actor.id, body, { slug })
    )

    const id: string = rows[0].id
    await insertWeddingSubTables(client, id, body)
    return id
  })

  const result = await pool.query(`${WEDDING_SELECT} WHERE w.id = $1`, [weddingId])
  return created(mapRowToWedding(result.rows[0]))
}, 'POST /api/weddings')
