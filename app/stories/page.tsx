'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { COUPLE_STORIES } from '@/lib/studio-data'
import { StorySlideReader } from '@/components/story-slide-reader'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

export default function StoriesPage() {
  const { language, t } = useLanguage()
  const [selectedStoryId, setSelectedStoryId] = useState<string>(COUPLE_STORIES[0].id)

  const activeStory =
    COUPLE_STORIES.find((s) => s.id === selectedStoryId) || COUPLE_STORIES[0]

  return (
    <main className="min-h-screen bg-[#FBF8F2] text-[#292522] selection:bg-terracotta/20 selection:text-charcoal font-sans antialiased">
      <SiteHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-14 lg:pt-40 lg:pb-18 border-b border-sand/70 bg-[#F7F2E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
            <Heart className="h-4 w-4 fill-current text-terracotta" />
            <span>{t('CÂU CHUYỆN TÌNH YÊU', 'LOVE STORIES & MOMENTS')}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-charcoal tracking-tight">
            {t('Những Câu Chuyện Thật Đẹp', 'Stories Worth Remembering')}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base font-light text-earth/90 leading-relaxed">
            {t(
              'Không chỉ là những tấm hình đẹp, mỗi bộ ảnh là một trang nhật ký ghi lại cảm xúc rung động, những lời thì thầm và cái ôm siết của hai bạn. Hãy bấm để lật giở từng trang câu chuyện với hiệu ứng slide chuyển động.',
              'Beyond beautiful frames, each shoot is a chapter of raw tenderness, whispered vows, and tight embraces. Flip through each story slide by slide with fluid page transitions.'
            )}
          </p>
        </div>
      </section>

      {/* Interactive Story Slide Reader Hub */}
      <section id="interactive-reader" className="py-12 lg:py-16 border-b border-sand/70">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/60 pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta">
                {t('TRẢI NGHIỆM TƯƠNG TÁC LẬT TRANG', 'INTERACTIVE SLIDE EXPERIENCE')}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal">
                {language === 'vi' ? activeStory.coupleVi : activeStory.coupleEn} ·{' '}
                {language === 'vi' ? activeStory.locationVi : activeStory.locationEn}
              </h2>
            </div>

            {/* Story Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {COUPLE_STORIES.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setSelectedStoryId(story.id)}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border',
                    selectedStoryId === story.id
                      ? 'border-charcoal bg-charcoal text-white font-medium'
                      : 'border-sand/70 bg-white/80 text-earth hover:bg-white hover:text-charcoal'
                  )}
                >
                  {language === 'vi' ? story.coupleVi : story.coupleEn}
                </button>
              ))}
            </div>
          </div>

          {/* Main Slide Reader */}
          <StorySlideReader key={activeStory.id} story={activeStory} />
        </div>
      </section>

      {/* All Stories Archive Grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
          <div className="border-b border-sand/60 pb-6 flex items-baseline justify-between">
            <h2 className="font-serif text-3xl font-normal text-charcoal">
              {t('Tất Cả Câu Chuyện', 'All Love Chronicles')}
            </h2>
            <span className="text-xs font-mono text-earth/70">
              {COUPLE_STORIES.length} {t('bài viết', 'stories')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {COUPLE_STORIES.map((story) => (
              <div
                key={story.id}
                className="group border border-sand/70 bg-white p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/20">
                    <Image
                      src={story.coverImage}
                      alt={language === 'vi' ? story.coupleVi : story.coupleEn}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-charcoal/80 text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5">
                      {language === 'vi' ? story.categoryVi : story.categoryEn}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-earth/70">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-terracotta" />
                        {language === 'vi' ? story.locationVi : story.locationEn}
                      </span>
                      <span>{story.dateVi}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal group-hover:text-terracotta transition-colors">
                      {language === 'vi' ? story.coupleVi : story.coupleEn}
                    </h3>

                    <blockquote className="font-serif italic text-xs text-charcoal/85 border-l-2 border-terracotta/60 pl-2.5 py-0.5">
                      {language === 'vi' ? story.highlightQuoteVi : story.highlightQuoteEn}
                    </blockquote>

                    <p className="text-xs font-light text-earth/80 line-clamp-2 pt-1">
                      {language === 'vi' ? story.synopsisVi : story.synopsisEn}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-sand/50 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-earth/70">
                    {story.pages.length} {t('trang slide', 'slide pages')}
                  </span>

                  <Link
                    href={`/stories/${story.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-terracotta hover:text-charcoal transition-colors"
                  >
                    <span>{t('Xem trang slide', 'Read Story')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
