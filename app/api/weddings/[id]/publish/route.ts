import { pool } from '@/lib/db'
import { requireUser, isAuthError } from '@/lib/api-auth'
import { WEDDING_SELECT, mapRowToWedding } from '@/lib/wedding-mapper'
import { requireOwnedWedding, WEDDING_NOT_FOUND_MESSAGE } from '@/lib/wedding-access'
import { ok, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'
import { WEDDING_STATUS } from '@/lib/status'

/**
 * Xuất bản thiệp: DRAFT/UNPUBLISHED -> PUBLISHED.
 *
 * Endpoint riêng thay vì `PUT /api/weddings/[id]` vì PUT thay toàn bộ các cột —
 * gọi PUT chỉ để đổi trạng thái sẽ xoá sạch nội dung thiệp.
 */
export const POST = withErrorHandling(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const actor = await requireUser()
    if (isAuthError(actor)) return actor

    const { id } = await params
    const access = await requireOwnedWedding(id, actor)
    if ('error' in access) return access.error

    if (access.row.status === WEDDING_STATUS.PUBLISHED) {
      return fail(ErrorCode.CONFLICT, 'Thiệp đã được xuất bản')
    }

    const { rowCount } = await pool.query(
      "UPDATE weddings SET status = $1, updated_at = NOW() WHERE id = $2 AND status <> $1",
      [WEDDING_STATUS.PUBLISHED, id]
    )
    if (!rowCount) return fail(ErrorCode.RESOURCE_NOT_FOUND, WEDDING_NOT_FOUND_MESSAGE)

    const { rows } = await pool.query(`${WEDDING_SELECT} WHERE w.id = $1`, [id])
    return ok(mapRowToWedding(rows[0]))
  },
  'POST /api/weddings/[id]/publish'
)
