import { notFound } from 'next/navigation'
import { getPublishedExploreArticle, listRelatedExplore } from '@/lib/explore'
import { ExploreDetailView } from './explore-detail-view'

export const dynamic = 'force-dynamic'

export default async function ExploreArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Bản nháp/bị ẩn trả về 404 — bộ lọc PUBLISHED nằm trực tiếp trong SQL
  // ở `lib/explore.ts` để không rò rỉ dữ liệu nháp ở bất kỳ cấp độ nào.
  const article = await getPublishedExploreArticle(slug)
  if (!article) notFound()

  // 3 bài viết cùng category gần nhất (loại trừ bài hiện tại)
  const relatedArticles = await listRelatedExplore(article.slug, article.category, 3)

  return <ExploreDetailView article={article} relatedArticles={relatedArticles} />
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getPublishedExploreArticle(slug)
  if (!article) return { title: 'Không tìm thấy bài viết — Wispic' }

  return {
    title: `${article.title} — Explore Wispic`,
    description: article.excerpt || article.title,
    openGraph: {
      title: `${article.title} — Wispic`,
      description: article.excerpt || article.title,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
  }
}
