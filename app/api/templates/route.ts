import { pool } from '@/lib/db'
import { requireAdmin, isAuthError } from '@/lib/api-auth'
import { ok, created, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'
import { mapRowToTemplate } from '@/lib/template-mapper'
import { TEMPLATE_STATUSES, isTemplateStatus } from '@/lib/status'
import { FieldErrors, str } from '@/lib/validation'
import { uniqueSlug } from '@/lib/slug'

/**
 * Danh sách mẫu. Chỉ mẫu `PUBLISHED` mới công khai cho khách.
 * `?status=` để admin xem DRAFT/ARCHIVED.
 */
export const GET = withErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const requestedStatus = searchParams.get('status')
  const includeNonPublished = searchParams.get('includeNonPublished') === 'true'

  if (includeNonPublished) {
    // Màn quản trị cần thấy cả bản nháp để sửa, không chỉ mẫu đang công khai.
    const actor = await requireAdmin()
    if (isAuthError(actor)) return actor

    const { rows } = await pool.query('SELECT * FROM templates ORDER BY created_at ASC')
    return ok(rows.map(mapRowToTemplate), { total: rows.length })
  }

  if (requestedStatus) {
    const actor = await requireAdmin()
    if (isAuthError(actor)) return actor

    if (!isTemplateStatus(requestedStatus)) {
      return fail(ErrorCode.VALIDATION_ERROR, 'Status không hợp lệ', {
        fields: { status: `Phải là một trong: ${TEMPLATE_STATUSES.join(', ')}` },
      })
    }

    const { rows } = await pool.query('SELECT * FROM templates WHERE status = $1 ORDER BY created_at ASC', [
      requestedStatus,
    ])
    return ok(rows.map(mapRowToTemplate), { total: rows.length, status: requestedStatus })
  }

  const { rows } = await pool.query(
    "SELECT * FROM templates WHERE status = 'PUBLISHED' ORDER BY created_at ASC"
  )
  return ok(rows.map(mapRowToTemplate), { total: rows.length })
}, 'GET /api/templates')

/** Tạo mẫu custom: chỉ admin, mặc định `DRAFT` để phải duyệt trước khi lên. */
export const POST = withErrorHandling(async (request: Request) => {
  const actor = await requireAdmin()
  if (isAuthError(actor)) return actor

  const body = await request.json()
  const errors = new FieldErrors()

  const name = errors.required('name', body?.name, 'Tên mẫu')
  errors.maxLength('name', name, 255, 'Tên mẫu')

  const status = body?.status ? errors.oneOf('status', body.status, TEMPLATE_STATUSES) : 'DRAFT'
  if (!errors.isEmpty) {
    return fail(ErrorCode.VALIDATION_ERROR, 'Dữ liệu không hợp lệ', { fields: errors.fields })
  }

  const slug = await uniqueSlug(pool, 'templates', body?.slug || name)

  const { rows: [row] } = await pool.query(
    `INSERT INTO templates
       (name, slug, template_key, preview_image, category, description,
        swatches, accent, html, css, sections, is_custom, status, created_by, updated_by)
     VALUES ($1, $2, NULL, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $13)
     RETURNING *`,
    [
      name,
      slug,
      str(body.previewImage) || null,
      str(body.category) || 'Tùy chỉnh',
      str(body.description),
      JSON.stringify(Array.isArray(body.swatches) && body.swatches.length ? body.swatches : ['#f7f3ee', '#302b27']),
      str(body.accent) || '#9b8878',
      str(body.html),
      str(body.css),
      JSON.stringify(Array.isArray(body.sections) ? body.sections : []),
      body.isCustom ?? true,
      status,
      actor.id,
    ]
  )

  return created(mapRowToTemplate(row))
}, 'POST /api/templates')
