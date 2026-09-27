import { getPublishedWeddingBySlug, toPublicWedding } from '@/lib/wedding-public'
import { ok, fail, ErrorCode, withErrorHandling } from '@/lib/api-response'

/**
 * Thiệp public theo slug — không cần đăng nhập.
 * Chỉ trả về thiệp `PUBLISHED`; mọi trạng thái khác trả 404 giống hệt nhau.
 */
export const GET = withErrorHandling(
  async (_request: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params

    const result = await getPublishedWeddingBySlug(slug)
    if (!result) {
      return fail(ErrorCode.RESOURCE_NOT_FOUND, 'Không tìm thấy thiệp')
    }

    return ok(toPublicWedding(result.wedding), { slug })
  },
  'GET /api/public/wedding/[slug]'
)
