import { pool } from './db'
import type { SessionUser } from './session'
import { fail, ErrorCode } from './api-response'
import { isUuid } from './validation'

export const WEDDING_NOT_FOUND_MESSAGE = 'Không tìm thấy thiệp'

export type OwnedWeddingRow = {
  id: string
  user_id: string
  title: string
  slug: string
  status: string
}

/**
 * Nạp thiệp kèm kiểm tra quyền.
 *
 * Trả 404 chứ không phải 403 khi người gọi không phải chủ sở hữu, để không tiết
 * lộ sự tồn tại của thiệp người khác.
 */
export async function requireOwnedWedding(
  id: string,
  actor: SessionUser
): Promise<{ row: OwnedWeddingRow } | { error: ReturnType<typeof fail> }> {
  if (!isUuid(id)) {
    return { error: fail(ErrorCode.VALIDATION_ERROR, 'Id thiệp không hợp lệ') }
  }

  const { rows } = await pool.query(
    'SELECT id, user_id, title, slug, status FROM weddings WHERE id = $1',
    [id]
  )
  const row = rows[0]
  if (!row) return { error: fail(ErrorCode.RESOURCE_NOT_FOUND, WEDDING_NOT_FOUND_MESSAGE) }
  if (row.user_id !== actor.id && actor.role !== 'admin') {
    return { error: fail(ErrorCode.RESOURCE_NOT_FOUND, WEDDING_NOT_FOUND_MESSAGE) }
  }
  return { row }
}
