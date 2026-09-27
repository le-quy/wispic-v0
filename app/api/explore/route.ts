import { listPublishedExplore } from '@/lib/explore'
import { ok, withErrorHandling } from '@/lib/api-response'

/** Bài Explore đã xuất bản. `?category=` lọc theo chuyên mục. */
export const GET = withErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? undefined

  const articles = await listPublishedExplore({ category })
  return ok(articles, { total: articles.length, ...(category ? { category } : {}) })
}, 'GET /api/explore')
