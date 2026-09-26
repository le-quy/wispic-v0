'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { COUPLE_STORIES } from '@/lib/studio-data'
import { StorySlideReader } from '@/components/story-slide-reader'
import { useLanguage } from '@/lib/language-context'

export default function SingleStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { language, t } = useLanguage()

  const story = COUPLE_STORIES.find((s) => s.slug === slug || s.id === slug)

  if (!story) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#FBF8F2] text-[#292522] selection:bg-terracotta/20 selection:text-charcoal font-sans antialiased">
      <SiteHeader />

      <div className="pt-28 lg:pt-36 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between border-b border-sand/60 pb-4">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-earth hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('Quay lại tất cả câu chuyện', 'Back to all stories')}</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-earth/80">
              <span className="font-mono text-terracotta">{story.pages.length}</span>
              <span>{t('trang chuyển động', 'animated pages')}</span>
            </div>
          </div>

          {/* Story Meta Header */}
          <div className="space-y-3 py-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded-full">
                {language === 'vi' ? story.categoryVi : story.categoryEn}
              </span>
              <span className="text-xs font-light text-earth/70 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-terracotta" />
                {language === 'vi' ? story.locationVi : story.locationEn}
              </span>
              <span className="text-xs font-light text-earth/70">· {story.dateVi}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal tracking-tight">
              {language === 'vi' ? story.coupleVi : story.coupleEn}
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-charcoal/90">
              {language === 'vi' ? story.highlightQuoteVi : story.highlightQuoteEn}
            </p>

            <p className="text-sm font-light text-earth/90 leading-relaxed">
              {language === 'vi' ? story.synopsisVi : story.synopsisEn}
            </p>
          </div>

          {/* Interactive Slide Reader with Animated Page Transitions */}
          <div className="mt-4">
            <StorySlideReader story={story} />
          </div>

          {/* Bottom Booking Action */}
          <div className="mt-12 p-8 sm:p-12 border border-sand/70 bg-[#FAF7F2] text-center space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
              {t('KHOẢNH KHẮC CỦA HAI BẠN', 'YOUR OWN MOMENTS')}
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
              {t(
                'Cùng Wispic ghi lại câu chuyện tình yêu của hai bạn',
                'Let us document your honest love story'
              )}
            </h3>
            <p className="text-xs sm:text-sm font-light text-earth/80 max-w-md mx-auto">
              {t(
                'Chúng mình luôn sẵn sàng lắng nghe, tư vấn địa điểm và đồng hành cùng hai bạn trong buổi chụp thảnh thơi nhất.',
                'We are here to listen, recommend scenic locations, and guide you through an effortless shoot.'
              )}
            </p>
            <div className="pt-2 flex items-center justify-center gap-4">
              <Link
                href="/contact"
                className="bg-charcoal text-[#F7F2E9] px-7 py-3 text-xs font-medium uppercase tracking-wider hover:bg-terracotta transition-colors"
              >
                {t('Đặt Lịch Tư Vấn', 'Inquire Now')}
              </Link>
              <Link
                href="/portfolio"
                className="border border-sand bg-white px-6 py-3 text-xs font-medium uppercase tracking-wider text-charcoal hover:bg-sand/30 transition-colors"
              >
                {t('Xem Album Khác', 'More Galleries')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
