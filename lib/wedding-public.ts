import { pool } from './db'
import { WEDDING_SELECT, mapRowToWedding } from './wedding-mapper'
import { PUBLISHED } from './status'
import type { WeddingDraft } from './wedding-storage'

/**
 * Đọc thiệp đã xuất bản theo slug, phục vụ route public `/w/[slug]`.
 *
 * Luôn kèo điều kiện `status = 'PUBLISHED'`: DRAFT và UNPUBLISHED phải trả 404
 * y như thiệp không tồn tại, không phân biệt — nếu trả 403 thì chỉ cần đoán slug
 * là biết thiệp nào tồn tại và ai đang sở hữu.
 *
 * Trả cả `template` để server component render mẫu custom mà không cần gọi
 * API thứ hai.
 */
export async function getPublishedWeddingBySlug(slug: string) {
  const { rows } = await pool.query(
    `${WEDDING_SELECT} WHERE w.slug = $1 AND w.status = $2`,
    [slug, PUBLISHED]
  )
  const row = rows[0]
  if (!row) return null

  let template: { html: string | null; css: string | null; sections: unknown } | null = null
  if (row.template_id) {
    const { rows: [tpl] } = await pool.query(
      'SELECT html, css, sections FROM templates WHERE id = $1',
      [row.template_id]
    )
    if (tpl) {
      template = {
        html: tpl.html,
        css: tpl.css,
        sections: typeof tpl.sections === 'string' ? safeParse(tpl.sections) : tpl.sections,
      }
    }
  }

  return { wedding: mapRowToWedding(row) as WeddingDraft, template }
}

function safeParse(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

/**
 * Dữ liệu trả về cho client. Bỏ các trường do server sở hữu: thiệp public không
 * cần biết ai sở hữu, và timestamp kỹ thuật cũng không dùng tới.
 *
 * `id` vẫn được trả. Trang public render server-side nên không cần nó, nhưng
 * endpoint này dành cho client ngoài và bỏ đi cũng không thêm an toàn nào — nó
 * không phải bí mật, chỉ là khoá đọc bản ghi.
 */
export function toPublicWedding(wedding: WeddingDraft) {
  const { userId, createdBy, createdAt, updatedAt, ...rest } = wedding
  void userId
  void createdBy
  void createdAt
  void updatedAt
  return rest
}
