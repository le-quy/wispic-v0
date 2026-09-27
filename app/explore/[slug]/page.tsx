import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPublishedExploreArticle } from '@/lib/explore'

export const dynamic = 'force-dynamic'

export default async function ExploreArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Bản nháp/archived trả 404 giống hệt nhau — xem
  // `lib/explore.ts` để thấy bộ lọc nằm ngay trong SQL.
  const article = await getPublishedExploreArticle(slug)
  if (!article) notFound()

  return (
    <article className="wispic-container py-12 md:py-20">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
        Explore
      </Link>

      <header className="mx-auto mt-8 max-w-2xl text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-terracotta">
          {article.category}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          {article.title}
        </h1>
        {article.location && (
          <p className="mt-3 font-light text-muted-foreground">{article.location}</p>
        )}
      </header>

      {article.coverImage && (
        <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 56rem"
            className="object-cover"
            priority
          />
        </div>
      )}

      {article.excerpt && (
        <p className="mx-auto mt-10 max-w-2xl font-serif text-lg italic leading-relaxed text-foreground/80">
          {article.excerpt}
        </p>
      )}

      <div className="mx-auto mt-8 max-w-2xl whitespace-pre-wrap font-light leading-loose text-muted-foreground">
        {article.content}
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getPublishedExploreArticle(slug)
  if (!article) return { title: 'Không tìm thấy bài viết' }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
  }
}
