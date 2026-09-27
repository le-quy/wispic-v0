'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Compass } from 'lucide-react'
import type { PublicArticle } from '@/lib/explore'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

function formatDateVN(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function ExploreView({
  articles,
  categories,
  activeCategory,
}: {
  articles: PublicArticle[]
  categories: string[]
  activeCategory?: string
}) {
  const { t } = useLanguage()

  const featured = articles.length > 0 ? articles[0] : null
  const remaining = articles.length > 1 ? articles.slice(1) : []

  return (
    <div className="wispic-container py-12 md:py-20">
      {/* Header */}
      <header className="max-w-2xl">
        <p className="wispic-label">{t('NHẬT KÝ & GÓC NHÌN', 'FIELD JOURNALS & PERSPECTIVES')}</p>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground md:text-5xl">
          {t('Explore', 'Explore')}
        </h1>
        <p className="mt-4 font-light leading-relaxed text-muted-foreground">
          {t(
            'Chuyến đi, địa điểm và những câu chuyện bên lề mỗi bức ảnh.',
            'Journeys, locations, and the intimate stories living behind every photograph.'
          )}
        </p>
      </header>

      {/* Thanh filter category đọc từ chính data (bài PUBLISHED), chạy server-side qua searchParams */}
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border/60 pb-6">
          <span className="mr-2 text-xs font-light text-muted-foreground">
            {t('Chuyên mục:', 'Category:')}
          </span>
          <Link
            href="/explore"
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-light transition-all',
              !activeCategory
                ? 'bg-terracotta text-white shadow-xs'
                : 'border border-border/70 bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground'
            )}
          >
            {t('Tất cả', 'All')}
          </Link>
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <Link
                key={cat}
                href={`/explore?category=${encodeURIComponent(cat)}`}
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-light transition-all',
                  isActive
                    ? 'bg-terracotta text-white shadow-xs'
                    : 'border border-border/70 bg-card text-muted-foreground hover:border-terracotta/40 hover:text-foreground'
                )}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      )}

      {/* Empty state: cấu trúc giữ nguyên từ bản hiện tại, chuẩn hoá đa ngôn ngữ qua t() */}
      {articles.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border/70 px-6 py-20 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Compass className="h-6 w-6 text-terracotta" strokeWidth={1.4} />
          </span>
          <h2 className="mt-6 font-serif text-xl font-medium text-foreground">
            {t('Chưa có bài viết nào', 'No articles yet')}
          </h2>
          <p className="mt-3 max-w-sm font-light leading-relaxed text-muted-foreground">
            {t(
              'Explore sẽ xuất hiện ở đây ngay khi có bài đầu tiên được đăng. Trong lúc đó, bạn có thể xem qua các bộ ảnh cưới của Wispic.',
              'Explore articles will appear here as soon as published. In the meantime, you can explore our wedding photography galleries.'
            )}
          </p>
          <Link href="/photography" className="wispic-btn-outline mt-8">
            {t('Xem bộ ảnh', 'View galleries')}
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {/* Bài đầu tiên là featured: ảnh cỡ lớn bên trái, tiêu đề + excerpt bên phải (bất đối xứng) */}
          {featured && (
            <Link
              href={`/explore/${featured.slug}`}
              className="group block overflow-hidden rounded-[1.25rem] border border-border/70 bg-card transition-all duration-300 hover:border-terracotta/40 hover:shadow-xs"
            >
              <div className="grid grid-cols-1 items-stretch md:grid-cols-12">
                {/* Cột ảnh lớn bên trái */}
                <div className="relative min-h-[280px] sm:min-h-[340px] md:col-span-7 lg:col-span-8 md:min-h-[420px] overflow-hidden">
                  {featured.coverImage ? (
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 65vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary/50">
                      <Compass className="h-12 w-12 text-terracotta/40" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-background/90 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-terracotta backdrop-blur-xs">
                      {t('Bài viết nổi bật', 'Featured Story')}
                    </span>
                  </div>
                </div>

                {/* Cột thông tin tiêu đề + excerpt bên phải */}
                <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-5 lg:col-span-4 md:p-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-terracotta">
                      <span>{featured.category}</span>
                      {featured.location && (
                        <>
                          <span className="text-muted-foreground/60">·</span>
                          <span className="text-muted-foreground">{featured.location}</span>
                        </>
                      )}
                    </div>
                    <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-terracotta sm:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-4 line-clamp-4 text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-4 text-xs font-light text-muted-foreground">
                    <span>{formatDateVN(featured.publishedAt || featured.updatedAt)}</span>
                    <span className="inline-flex items-center gap-1 font-medium text-terracotta group-hover:underline">
                      {t('Đọc bài viết', 'Read story')}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid phần còn lại giữ 3 cột, ảnh group-hover:scale-[1.04], hiện ngày đăng */}
          {remaining.length > 0 && (
            <section>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {remaining.map((article) => (
                  <Link
                    key={article.id}
                    href={`/explore/${article.slug}`}
                    className="group wispic-card flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-terracotta/40 hover:shadow-xs"
                  >
                    <div>
                      {article.coverImage ? (
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center bg-secondary/40">
                          <Compass className="h-8 w-8 text-terracotta/40" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex flex-wrap items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-terracotta">
                          <span>{article.category}</span>
                          {article.location && (
                            <>
                              <span className="text-muted-foreground/60">·</span>
                              <span className="text-muted-foreground">{article.location}</span>
                            </>
                          )}
                        </div>
                        <h3 className="mt-2 font-serif text-lg font-medium text-foreground transition-colors group-hover:text-terracotta">
                          {article.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm font-light leading-relaxed text-muted-foreground">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs font-light text-muted-foreground border-t border-border/40 mt-3 pt-3">
                      <span>{formatDateVN(article.publishedAt || article.updatedAt)}</span>
                      <span className="text-terracotta text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                        {t('Xem bài →', 'Read →')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
