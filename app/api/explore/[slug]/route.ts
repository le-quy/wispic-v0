import {
  deleteExploreArticle,
  getExploreArticleByIdOrSlug,
  getPublishedExploreArticle,
  toggleExploreArticlePublish,
  updateExploreArticle,
} from '@/lib/explore'
import {
  ErrorCode,
  fail,
  isErrorResponse,
  noContent,
  ok,
  withErrorHandling,
} from '@/lib/api-response'
import { requireUser } from '@/lib/api-auth'
import { getSessionUser } from '@/lib/session'
import { FieldErrors, ValidationError } from '@/lib/validation'
import { isArticleStatus, type ArticleStatus } from '@/lib/status'

export const GET = withErrorHandling(
  async (_request: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const user = await getSessionUser()

    // Người dùng đã đăng nhập (admin) được phép xem cả bản nháp qua slug hoặc ID
    if (user) {
      const article = await getExploreArticleByIdOrSlug(slug)
      if (!article) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy bài viết')
      return ok(article, { slug })
    }

    // Khách vãng lai: chỉ đọc bài đã xuất bản (lọc PUBLISHED cố định trong SQL)
    const article = await getPublishedExploreArticle(slug)
    if (!article) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy bài viết')

    return ok(article, { slug })
  },
  'GET /api/explore/[slug]'
)

export const PATCH = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const actor = await requireUser()
    if (isErrorResponse(actor)) return actor

    const { slug } = await params

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return fail(ErrorCode.VALIDATION_ERROR, 'JSON body không hợp lệ')
    }

    // Hỗ trợ shortcut thao tác toggle-publish
    if (body.action === 'toggle-publish') {
      const toggled = await toggleExploreArticlePublish(slug)
      if (!toggled) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy bài viết')
      return ok(toggled)
    }

    const errors = new FieldErrors()

    if (body.title !== undefined) {
      const title = errors.required('title', body.title, 'Tiêu đề')
      errors.maxLength('title', title, 255, 'Tiêu đề')
    }

    if (body.status !== undefined && !isArticleStatus(body.status)) {
      errors.add('status', 'Trạng thái bài viết không hợp lệ')
    }

    try {
      errors.throwIfAny()
    } catch (err) {
      if (err instanceof ValidationError) {
        return fail(ErrorCode.VALIDATION_ERROR, err.message, { fields: err.fields })
      }
      throw err
    }

    const updated = await updateExploreArticle(slug, {
      title: typeof body.title === 'string' ? body.title : undefined,
      slug: typeof body.slug === 'string' ? body.slug : undefined,
      excerpt: typeof body.excerpt === 'string' ? body.excerpt : undefined,
      content: typeof body.content === 'string' ? body.content : undefined,
      coverImage: body.coverImage === null ? null : typeof body.coverImage === 'string' ? body.coverImage : undefined,
      category: typeof body.category === 'string' ? body.category : undefined,
      tags: Array.isArray(body.tags) ? body.tags.filter((t) => typeof t === 'string' && t.trim()) : undefined,
      location: body.location === null ? null : typeof body.location === 'string' ? body.location : undefined,
      status: body.status !== undefined ? (body.status as ArticleStatus) : undefined,
    })

    if (!updated) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy bài viết')
    return ok(updated)
  },
  'PATCH /api/explore/[slug]'
)

export const DELETE = withErrorHandling(
  async (_request: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const actor = await requireUser()
    if (isErrorResponse(actor)) return actor

    const { slug } = await params
    const deleted = await deleteExploreArticle(slug)
    if (!deleted) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy bài viết')

    return noContent()
  },
  'DELETE /api/explore/[slug]'
)
