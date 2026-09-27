import { pool, withTransaction } from '@/lib/db'
import { requireUser, isAuthError } from '@/lib/api-auth'
import { WEDDING_SELECT, mapRowToWedding } from '@/lib/wedding-mapper'
import { hasWeddingSubTableFields, patchWeddingSubTables } from '@/lib/wedding-sub-tables'
import { weddingPatchSet } from '@/lib/wedding-write'
import { uniqueSlug } from '@/lib/slug'
import { requireOwnedWedding, WEDDING_NOT_FOUND_MESSAGE } from '@/lib/wedding-access'
import { ok, noContent, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'

export const GET = withErrorHandling(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const actor = await requireUser()
    if (isAuthError(actor)) return actor

    const { id } = await params
    const access = await requireOwnedWedding(id, actor)
    if ('error' in access) return access.error

    const { rows } = await pool.query(`${WEDDING_SELECT} WHERE w.id = $1`, [id])
    if (!rows[0]) return fail(ErrorCode.RESOURCE_NOT_FOUND, WEDDING_NOT_FOUND_MESSAGE)
    return ok(mapRowToWedding(rows[0]))
  },
  'GET /api/weddings/[id]'
)

export const PATCH = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const actor = await requireUser()
    if (isAuthError(actor)) return actor

    const { id } = await params
    const access = await requireOwnedWedding(id, actor)
    if ('error' in access) return access.error
    const existing = access.row

    const body = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return fail(ErrorCode.VALIDATION_ERROR, 'Body không hợp lệ')
    }

    // Không suy ra slug từ tiêu đề. Trước đây sửa tiêu đề là sinh slug mới, nên
    // mỗi lần gõ vào ô tên sẽ đổi URL của thiệp — hỏng link đã gửi cho khách.
    // Slug chỉ được đổi khi client gửi `slug` tường minh, hoặc khi thiệp chưa có
    // slug (dữ liệu cũ trước khi có cột này).
    const wantsExplicitSlug = typeof body.slug === 'string' && body.slug.trim() !== ''
    const hasSlug = typeof existing.slug === 'string' && existing.slug.trim() !== ''

    let slug: string | null = existing.slug
    if (wantsExplicitSlug) {
      slug = await uniqueSlug(pool, 'weddings', body.slug, id)
    } else if (!hasSlug && typeof body.title === 'string' && body.title.trim() !== '') {
      slug = await uniqueSlug(pool, 'weddings', body.title, id)
    }

    // Chỉ đưa slug vào SET khi nó thực sự đổi, tránh ghi lại cột không cần thiết.
    const patch = weddingPatchSet(
      body,
      slug !== existing.slug ? { slug: slug ?? undefined } : {}
    )

    // Body chỉ có `photos`/`timeline`/... vẫn là PATCH hợp lệ: không có cột nào ở
    // bảng chính cần ghi, nhưng bảng con thì có.
    const touchesSubTables = hasWeddingSubTableFields(body)
    if (!patch && !touchesSubTables) {
      return fail(ErrorCode.VALIDATION_ERROR, 'Body không có trường nào để cập nhật')
    }

    // user_id không nằm trong allowlist nên không thể bị đổi chủ sở hữu.
    await withTransaction(async (client) => {
      if (patch) {
        await client.query(
          `UPDATE weddings SET ${patch.set}, updated_at = NOW() WHERE id = $${patch.values.length + 1}`,
          [...patch.values, id]
        )
      }
      await patchWeddingSubTables(client, id, body)
    })

    const { rows } = await pool.query(`${WEDDING_SELECT} WHERE w.id = $1`, [id])
    if (!rows[0]) return fail(ErrorCode.RESOURCE_NOT_FOUND, WEDDING_NOT_FOUND_MESSAGE)
    return ok(mapRowToWedding(rows[0]))
  },
  'PATCH /api/weddings/[id]'
)

/**
 * PUT cũ — giữ làm alias của PATCH cho các client đã mở tab trước lần deploy này.
 * Cả hai đều là cập nhật bán phần; sau khi không còn client nào gọi PUT thì bỏ.
 */
export const PUT = PATCH

export const DELETE = withErrorHandling(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const actor = await requireUser()
    if (isAuthError(actor)) return actor

    const { id } = await params
    const access = await requireOwnedWedding(id, actor)
    if ('error' in access) return access.error

    const { rowCount } = await pool.query('DELETE FROM weddings WHERE id = $1', [id])
    if (!rowCount) return fail(ErrorCode.RESOURCE_NOT_FOUND, WEDDING_NOT_FOUND_MESSAGE)
    return noContent()
  },
  'DELETE /api/weddings/[id]'
)
