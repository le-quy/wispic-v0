import Image from 'next/image'
import Link from 'next/link'
import { Compass } from 'lucide-react'
import { listPublishedExplore } from '@/lib/explore'

export const metadata = {
  title: 'Explore',
  description: 'Những câu chuyện, chuyến đi và góc nhìn từ Wispic.',
}

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  const articles = await listPublishedExplore()

  return (
    <div className="wispic-container py-12 md:py-20">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Explore
        </h1>
        <p className="mt-4 font-light leading-relaxed text-muted-foreground">
          Chuyến đi, địa điểm và những câu chuyện bên lề mỗi bức ảnh.
        </p>
      </header>

      {articles.length === 0 ? (
        // Empty state thật: bảng `articles` đang rỗng, nên đây không phải
        // trạng thái giả — nội dung sẽ hiện ngay khi admin đăng bài đầu tiên.
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border/70 px-6 py-20 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Compass className="h-6 w-6 text-terracotta" strokeWidth={1.4} />
          </span>
          <h2 className="mt-6 font-serif text-xl font-medium text-foreground">
            Chưa có bài viết nào
          </h2>
          <p className="mt-3 max-w-sm font-light leading-relaxed text-muted-foreground">
            Explore sẽ xuất hiện ở đây ngay khi có bài đầu tiên được đăng.
            Trong lúc đó, bạn có thể xem qua các bộ ảnh cưới của Wispic.
          </p>
          <Link href="/photography" className="wispic-btn-outline mt-8">
            Xem bộ ảnh
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/explore/${article.slug}`}
              className="group wispic-card overflow-hidden"
            >
              {article.coverImage && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-terracotta">
                  {article.category}
                </p>
                <h2 className="mt-2 font-serif text-lg font-medium text-foreground">
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-3 font-light text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
