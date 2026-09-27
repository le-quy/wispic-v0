import { listPublishedExplore, listPublishedExploreCategories } from '@/lib/explore'
import { ExploreView } from './explore-view'

export const metadata = {
  title: 'Explore — Wispic',
  description: 'Những câu chuyện, chuyến đi và góc nhìn từ Wispic.',
}

export const dynamic = 'force-dynamic'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  // Bộ lọc chuyên mục chạy hoàn toàn server-side qua searchParams + query SQL,
  // danh mục lấy từ chính các bài đang PUBLISHED trong DB.
  const [articles, categories] = await Promise.all([
    listPublishedExplore({ category }),
    listPublishedExploreCategories(),
  ])

  return (
    <ExploreView
      articles={articles}
      categories={categories}
      activeCategory={category}
    />
  )
}
