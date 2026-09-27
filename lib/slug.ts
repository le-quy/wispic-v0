import type { QueryResultRow } from 'pg'

/**
 * Sinh slug thân thiện với tiếng Việt.
 *
 * Dùng NFD để tách dấu ra khỏi ký tự gốc, rồi bỏ combining marks. Riêng
 * đ/Đ không phải là dấu biến thiên nên phải thay tay. Kết quả khớp với
 * slug đã seed trong database/seed.sql: 'Lãng mạn' -> 'lang-man'.
 */
const LETTER_EXCEPTIONS: Record<string, string> = { đ: 'd', Đ: 'D' }

export function slugify(input: string): string {
  const normalized = input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, (c) => LETTER_EXCEPTIONS[c])

  return normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180)
}

/**
 * Bảng nào được phép sinh slug. Whitelist ở đây là để tên bảng nội suy
 * vào SQL luôn — không bao giờ nội suy chuỗi từ người dùng.
 */
export const SLUG_TABLES = ['weddings', 'templates', 'articles', 'photography_collections'] as const
export type SlugTable = (typeof SLUG_TABLES)[number]

const MAX_ATTEMPTS = 200

/**
 * Chỉ cần `query` — nhận được cả `Pool` lẫn `PoolClient` trong transaction.
 * Không import `db` để file này chạy được ngoi Node (script, test) không cần bundler.
 */
type QueryExecutor = {
  query: (text: string, values?: unknown[]) => Promise<{ rows: QueryResultRow[] }>
}

/**
 * Trả về slug chưa tồn tại trong bảng, tự thêm hậu tố -2, -3... nếu trùng.
 * `excludeId` dùng khi đổi slug của chính bản ghi đang sửa.
 */
export async function uniqueSlug(
  db: QueryExecutor,
  table: SlugTable,
  source: string,
  excludeId?: string
): Promise<string> {
  const root = slugify(source) || 'item'

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const candidate = attempt === 1 ? root : `${root}-${attempt}`

    const { rows } = await db.query(
      `SELECT id FROM ${table} WHERE slug = $1 LIMIT 1`,
      [candidate]
    )

    if (rows.length === 0) return candidate
    if (excludeId && rows[0].id === excludeId) return candidate
  }

  throw new Error(`Không tìm được slug khả dụng cho "${source}" sau ${MAX_ATTEMPTS} lần thử`)
}
