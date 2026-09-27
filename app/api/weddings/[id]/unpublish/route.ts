import { pool } from '@/lib/db'
import { requireUser, isAuthError } from '@/lib/api-auth'
import { WEDDING_SELECT, mapRowToWedding } from '@/lib/wedding-mapper'
import { requireOwnedWedding, WEDDING_NOT_FOUND_MESSAGE } from '@/lib/wedding-access'
import { ok, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'
import { WEDDING_STATUS } from '@/lib/status'

/**
 * Gỡ xuất bản: PUBLISHED -> UNPUBLISHED.
 *
 * Giữ `UNPUBLISHED` thay vì đưa về `DRAFT` để phân biệt "từng xuất bản rồi bị
 * gỡ" với "chưa từng xuất bản" — dashboard cần phân biệt hai trạng thái này.
 */
export const POST = withErrorHandling(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const actor = await requireUser()
    if (isAuthError(actor)) return actor

    const { id } = await params
    const access = await requireOwnedWedding(id, actor)
    if ('error' in access) return access.error

    if (access.row.status === WEDDING_STATUS.UNPUBLISHED) {
      return fail(ErrorCode.CONFLICT, 'Thiệp đã ở trạng thái chưa xuất bản')
    }

    const { rowCount } = await pool.query(
      'UPDATE weddings SET status = $1, updated_at = NOW() WHERE id = $2 AND status = $3',
      [WEDDING_STATUS.UNPUBLISHED, id, WEDDING_STATUS.PUBLISHED]
    )
    if (!rowCount) return fail(ErrorCode.RESOURCE_NOT_FOUND, WEDDING_NOT_FOUND_MESSAGE)

    const { rows } = await pool.query(`${WEDDING_SELECT} WHERE w.id = $1`, [id])
    return ok(mapRowToWedding(rows[0]))
  },
  'POST /api/weddings/[id]/unpublish'
)
