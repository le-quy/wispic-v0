'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Copy, Share2, Compass } from 'lucide-react'
import type { PublicArticle } from '@/lib/explore'
import { useLanguage } from '@/lib/language-context'

function formatDateVN(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function ExploreDetailView({
  article,
  relatedArticles,
}: {
  article: PublicArticle
  relatedArticles: PublicArticle[]
}) {
  const { t } = useLanguage()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  // Thanh tiến trình đọc bài (reading progress bar mảnh trên top)
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) {
        setScrollProgress(0)
        return
      }
      const current = window.scrollY
      const pct = Math.min(100, Math.max(0, (current / scrollHeight) * 100))
      setScrollProgress(pct)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // Clipboard API fallback
    }
  }

  const authorDisplay =
    article.authorName && article.authorName.trim()
      ? article.authorName.trim()
      : t('Ban biên tập Wispic', 'Wispic Editorial Team')

  const formattedDate = formatDateVN(article.publishedAt || article.updatedAt)

  return (
    <>
      {/* Reading Progress Bar mảnh trên đỉnh màn hình */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-terracotta/15"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-terracotta transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="wispic-container py-10 md:py-16">
        {/* Navigation row & Nút copy link chia sẻ */}
        <div className="flex items-center justify-between border-b border-border/50 pb-5">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
            {t('Quay lại Explore', 'Back to Explore')}
          </Link>

          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={t('Sao chép liên kết bài viết', 'Copy article link')}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-light text-muted-foreground transition-all hover:border-terracotta/50 hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
                <span className="text-emerald-700 font-medium">
                  {t('Đã sao chép liên kết', 'Link copied')}
                </span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" strokeWidth={1.6} />
                <span>{t('Sao chép liên kết', 'Copy link')}</span>
              </>
            )}
          </button>
        </div>

        {/* Header bài viết */}
        <header className="mx-auto mt-10 max-w-3xl text-center">
          {/* Eyebrow: Category + Location */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
            <span>{article.category}</span>
            {article.location && (
              <>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-muted-foreground">{article.location}</span>
              </>
            )}
          </div>

          {/* H1 Serif */}
          <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl lg:text-6xl">
            {article.title}
          </h1>

          {/* Meta row: Tác giả & Ngày đăng định dạng tiếng Việt dd/mm/yyyy */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-light text-muted-foreground">
            <span>
              {t('Tác giả:', 'Author:')}{' '}
              <span className="font-medium text-foreground">{authorDisplay}</span>
            </span>
            {formattedDate && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <time dateTime={article.publishedAt || article.updatedAt}>{formattedDate}</time>
              </>
            )}
          </div>
        </header>

        {/* Cover image khổ lớn, bo góc tối đa 1.25rem */}
        {article.coverImage && (
          <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-[1.25rem] border border-border/60 bg-muted shadow-xs">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56rem"
              className="object-cover"
            />
          </div>
        )}

        {/* Excerpt dạng serif italic dẫn dắt */}
        {article.excerpt && (
          <div className="mx-auto mt-12 max-w-[68ch]">
            <p className="border-l-2 border-terracotta/70 pl-6 font-serif text-xl italic leading-relaxed text-foreground/85 sm:text-2xl">
              {article.excerpt}
            </p>
          </div>
        )}

        {/* Body max-w-[68ch] leading-relaxed */}
        <div className="mx-auto mt-10 max-w-[68ch] whitespace-pre-wrap font-sans text-base font-light leading-relaxed text-foreground/90 md:text-lg">
          {article.content}
        </div>

        {/* Tags nếu có */}
        {article.tags && article.tags.length > 0 && (
          <div className="mx-auto mt-12 flex max-w-[68ch] flex-wrap items-center gap-2 border-t border-border/50 pt-6">
            <span className="text-xs font-light text-muted-foreground">{t('Chủ đề:', 'Tags:')}</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary/70 px-3 py-1 text-xs font-light text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer chia sẻ bài viết */}
        <div className="mx-auto mt-10 flex max-w-[68ch] items-center justify-between border-t border-border/50 pt-6">
          <p className="text-xs font-light text-muted-foreground">
            {t('Thấy bài viết này thú vị?', 'Enjoyed this journal?')}
          </p>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-light text-foreground transition-colors hover:border-terracotta hover:bg-secondary/40"
          >
            <Share2 className="h-3.5 w-3.5 text-terracotta" />
            {copied ? t('Đã sao chép liên kết!', 'Link copied!') : t('Chia sẻ bài viết', 'Share story')}
          </button>
        </div>

        {/* Footer "Bài liên quan" = 3 bài cùng category gần nhất (loại trừ bài hiện tại) */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 border-t border-border/60 pt-12 md:mt-24 md:pt-16">
            <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="wispic-label">{t('GỢI Ý ĐỌC THÊM', 'FURTHER READING')}</p>
                <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                  {t('Bài viết liên quan', 'Related Articles')}
                </h2>
              </div>
              <Link
                href={`/explore?category=${encodeURIComponent(article.category)}`}
                className="text-xs font-medium text-terracotta transition-colors hover:text-foreground"
              >
                {t('Xem thêm chuyên mục này →', 'More from this category →')}
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/explore/${item.slug}`}
                  className="group wispic-card flex flex-col justify-between overflow-hidden transition-all hover:border-terracotta/40"
                >
                  <div>
                    {item.coverImage ? (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-secondary/50">
                        <Compass className="h-8 w-8 text-terracotta/40" />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-terracotta">
                        {item.category}
                      </p>
                      <h3 className="mt-2 font-serif text-lg font-medium text-foreground transition-colors group-hover:text-terracotta">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs font-light leading-relaxed text-muted-foreground">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-0 text-xs font-light text-muted-foreground">
                    {formatDateVN(item.publishedAt || item.updatedAt)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
