import { pool } from '@/lib/db'
import { requireAdmin, isAuthError } from '@/lib/api-auth'
import { ok, fail, ErrorCode, noContent, withErrorHandling } from '@/lib/api-response'
import { mapRowToTemplate } from '@/lib/template-mapper'
import { TEMPLATE_STATUSES, isTemplateStatus } from '@/lib/status'
import { FieldErrors, str } from '@/lib/validation'
import { uniqueSlug } from '@/lib/slug'
import { isUuid } from '@/lib/validation'

/** Mẫu hệ thống (`is_custom = false`) là của hệ thống — không sửa/xoá được. */
const SYSTEM_TEMPLATE_ERROR = 'Mẫu hệ thống không thể sửa hoặc xoá'

export const GET = withErrorHandling(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  if (!isUuid(id)) return fail(ErrorCode.VALIDATION_ERROR, 'Id mẫu không hợp lệ')

  const { rows } = await pool.query('SELECT * FROM templates WHERE id = $1', [id])
  const template = rows[0]
  if (!template) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy mẫu')

  // Bản nháp chỉ admin được xem; PUBLISHED thì ai cũng xem được.
  if (template.status !== 'PUBLISHED') {
    const actor = await requireAdmin()
    if (isAuthError(actor)) return actor
  }

  return ok(mapRowToTemplate(template))
}, 'GET /api/templates/[id]')

export const PUT = withErrorHandling(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const actor = await requireAdmin()
  if (isAuthError(actor)) return actor

  const { id } = await params
  if (!isUuid(id)) return fail(ErrorCode.VALIDATION_ERROR, 'Id mẫu không hợp lệ')

  const { rows: [existing] } = await pool.query(
    'SELECT is_custom, name, status FROM templates WHERE id = $1',
    [id]
  )
  if (!existing) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy mẫu')
  if (!existing.is_custom) return fail(ErrorCode.FORBIDDEN, SYSTEM_TEMPLATE_ERROR)

  const body = await request.json()
  const errors = new FieldErrors()

  if (body.name !== undefined) {
    const name = errors.required('name', body.name, 'Tên mẫu')
    errors.maxLength('name', name, 255, 'Tên mẫu')
  }
  if (body.status !== undefined) errors.oneOf('status', body.status, TEMPLATE_STATUSES)
  if (!errors.isEmpty) {
    return fail(ErrorCode.VALIDATION_ERROR, 'Dữ liệu không hợp lệ', { fields: errors.fields })
  }

  const name = str(body.name) || existing.name
  const slug =
    typeof body.slug === 'string' && body.slug.trim()
      ? await uniqueSlug(pool, 'templates', body.slug, id)
      : await uniqueSlug(pool, 'templates', name, id)

  const { rows } = await pool.query(
    `UPDATE templates SET
      name = COALESCE($1, name),
      slug = $2,
      preview_image = COALESCE($3, preview_image),
      category = COALESCE($4, category),
      description = COALESCE($5, description),
      swatches = COALESCE($6, swatches),
      accent = COALESCE($7, accent),
      html = COALESCE($8, html),
      css = COALESCE($9, css),
      sections = COALESCE($10, sections),
      is_custom = COALESCE($11, is_custom),
      status = COALESCE($12, status),
      updated_by = $13,
      updated_at = NOW()
     WHERE id = $14 RETURNING *`,
    [
      body.name === undefined ? null : name,
      slug,
      body.previewImage === undefined ? null : str(body.previewImage) || null,
      body.category === undefined ? null : str(body.category),
      body.description === undefined ? null : str(body.description),
      body.swatches === undefined ? null : JSON.stringify(body.swatches),
      body.accent === undefined ? null : str(body.accent),
      body.html === undefined ? null : str(body.html),
      body.css === undefined ? null : str(body.css),
      body.sections === undefined ? null : JSON.stringify(body.sections),
      body.isCustom === undefined ? null : Boolean(body.isCustom),
      body.status === undefined ? null : (isTemplateStatus(body.status) ? body.status : existing.status),
      actor.id,
      id,
    ]
  )

  if (!rows[0]) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy mẫu')
  return ok(mapRowToTemplate(rows[0]))
}, 'PUT /api/templates/[id]')

export const DELETE = withErrorHandling(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const actor = await requireAdmin()
  if (isAuthError(actor)) return actor

  const { id } = await params
  if (!isUuid(id)) return fail(ErrorCode.VALIDATION_ERROR, 'Id mẫu không hợp lệ')

  const { rows: [existing] } = await pool.query('SELECT is_custom FROM templates WHERE id = $1', [id])
  if (!existing) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy mẫu')
  if (!existing.is_custom) return fail(ErrorCode.FORBIDDEN, SYSTEM_TEMPLATE_ERROR)

  const { rowCount } = await pool.query('DELETE FROM templates WHERE id = $1', [id])
  if (!rowCount) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy mẫu')
  return noContent()
}, 'DELETE /api/templates/[id]')
