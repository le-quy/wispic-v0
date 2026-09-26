'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Sparkles, SlidersHorizontal } from 'lucide-react'
import { COUPLE_STORIES } from '@/lib/studio-data'
import { StorySlideReader } from '@/components/story-slide-reader'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

export function CoupleStoriesSlider() {
  const { language, t } = useLanguage()
  const [selectedStoryId, setSelectedStoryId] = useState<string>(COUPLE_STORIES[0].id)

  const activeStory =
    COUPLE_STORIES.find((s) => s.id === selectedStoryId) || COUPLE_STORIES[0]

  return (
    <section id="stories" className="py-20 lg:py-28 bg-[#F7F2E9] border-t border-sand/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-sand/60">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-terracotta">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t('CÂU CHUYỆN & KHOẢNH KHẮC', 'STORIES & MOMENTS')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
              {t('Những Chuyện Tình Đầy Rung Động', 'Unscripted Love Stories')}
            </h2>
            <p className="text-sm sm:text-base font-light text-earth/80 leading-relaxed max-w-xl">
              {t(
                'Mỗi bộ ảnh cưới là một cuốn tiểu thuyết hình ảnh nhỏ. Hãy bấm lật giở từng trang để cảm nhận trọn vẹn nhịp đập cảm xúc tự nhiên của các cặp đôi cùng Wispic.',
                'Each wedding series is a visual novella. Turn through each slide page to experience the raw, genuine rhythm of couples documented by Wispic.'
              )}
            </p>
          </div>

          {/* Quick Landing Page Link */}
          <Link
            href="/stories"
            className="group inline-flex items-center gap-2 border border-charcoal/30 bg-white/60 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-charcoal hover:bg-charcoal hover:text-white transition-all shrink-0"
          >
            <span>{t('Xem tất cả câu chuyện', 'View All Stories')}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Story Selector Tabs */}
        <div className="pt-8 pb-6 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 text-xs font-light text-earth/60 mr-2 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{t('Chọn câu chuyện:', 'Select story:')}</span>
          </div>

          {COUPLE_STORIES.map((story) => {
            const isSelected = story.id === selectedStoryId
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => setSelectedStoryId(story.id)}
                className={cn(
                  'px-4 py-2 text-xs uppercase tracking-wider rounded-none transition-all shrink-0 border',
                  isSelected
                    ? 'border-charcoal bg-charcoal text-white font-medium shadow-sm'
                    : 'border-sand/80 bg-white/70 text-charcoal hover:bg-white hover:border-charcoal/50 font-light'
                )}
              >
                <span>{language === 'vi' ? story.coupleVi : story.coupleEn}</span>
                <span className="ml-1.5 opacity-60 text-[10px]">
                  · {language === 'vi' ? story.locationVi.split(',')[0] : story.locationEn.split(',')[0]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Interactive Slide Reader Component */}
        <div className="mt-4">
          <StorySlideReader key={activeStory.id} story={activeStory} />
        </div>

        {/* Bottom Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-light text-earth/70 gap-2 border-t border-sand/50 pt-4">
          <p>
            {t(
              '💡 Mẹo: Sử dụng phím mũi tên [ ← ] và [ → ] trên bàn phím để chuyển trang mượt mà.',
              '💡 Tip: Use keyboard arrow keys [ ← ] and [ → ] to flip through pages smoothly.'
            )}
          </p>
          <p className="font-mono text-[11px]">
            {t('Ảnh chụp màu tự nhiên · Không chỉnh sửa sai lệch', 'Organic color tones · True to life')}
          </p>
        </div>
      </div>
    </section>
  )
}
