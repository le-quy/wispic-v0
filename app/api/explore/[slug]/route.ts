import { getPublishedExploreArticle } from '@/lib/explore'
import { ok, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'

export const GET = withErrorHandling(
  async (_request: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params

    const article = await getPublishedExploreArticle(slug)
    if (!article) return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy bài viết')

    return ok(article, { slug })
  },
  'GET /api/explore/[slug]'
)
