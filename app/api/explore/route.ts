import {
  createExploreArticle,
  listAllExploreArticles,
  listPublishedExplore,
} from '@/lib/explore'
import {
  ErrorCode,
  created,
  fail,
  isErrorResponse,
  ok,
  withErrorHandling,
} from '@/lib/api-response'
import { requireUser } from '@/lib/api-auth'
import { FieldErrors, ValidationError } from '@/lib/validation'
import { ARTICLE_STATUS, isArticleStatus, type ArticleStatus } from '@/lib/status'
import { getSessionUser } from '@/lib/session'

/**
 * GET /api/explore
 * - Khách: xem danh sách bài viết đã PUBLISHED, tuỳ chọn lọc `?category=`.
 * - Admin/đã đăng nhập: nếu truyền `?all=true`, trả về toàn bộ bài viết (kèm DRAFT, UNPUBLISHED).
 */
export const GET = withErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? undefined
  const showAll = searchParams.get('all') === 'true'

  if (showAll) {
    const user = await getSessionUser()
    if (!user) {
      return fail(ErrorCode.UNAUTHORIZED, 'Cần đăng nhập để xem danh sách quản trị')
    }
    const articles = await listAllExploreArticles({ category })
    return ok(articles, { total: articles.length, category })
  }

  const articles = await listPublishedExplore({ category })
  return ok(articles, { total: articles.length, ...(category ? { category } : {}) })
}, 'GET /api/explore')

/**
 * POST /api/explore
 * Tạo bài viết mới. Bọc `requireUser()`, kiểm tra validation server-side.
 */
export const POST = withErrorHandling(async (request: Request) => {
  const actor = await requireUser()
  if (isErrorResponse(actor)) return actor

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return fail(ErrorCode.VALIDATION_ERROR, 'JSON body không hợp lệ')
  }

  const errors = new FieldErrors()
  const title = errors.required('title', body.title, 'Tiêu đề')
  errors.maxLength('title', title, 255, 'Tiêu đề')

  const slug = typeof body.slug === 'string' ? body.slug.trim() : undefined
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : ''
  const content = typeof body.content === 'string' ? body.content : ''
  const coverImage = typeof body.coverImage === 'string' ? body.coverImage : null
  const category = typeof body.category === 'string' && body.category.trim() ? body.category.trim() : 'Chuyến đi'
  const location = typeof body.location === 'string' ? body.location.trim() : null
  const tags = Array.isArray(body.tags) ? body.tags.filter((t) => typeof t === 'string' && t.trim()) : []

  let status: ArticleStatus = ARTICLE_STATUS.DRAFT
  if (body.status !== undefined) {
    if (isArticleStatus(body.status)) {
      status = body.status
    } else {
      errors.add('status', 'Trạng thái bài viết không hợp lệ')
    }
  }

  try {
    errors.throwIfAny()
  } catch (err) {
    if (err instanceof ValidationError) {
      return fail(ErrorCode.VALIDATION_ERROR, err.message, { fields: err.fields })
    }
    throw err
  }

  const article = await createExploreArticle({
    title,
    slug,
    excerpt,
    content,
    coverImage,
    category,
    tags,
    location,
    authorId: actor.id,
    status,
  })

  return created(article)
}, 'POST /api/explore')
