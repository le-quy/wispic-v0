'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  MapPin,
  Heart,
  Share2,
  ArrowRight,
} from 'lucide-react'
import { CoupleStory } from '@/lib/studio-data'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

interface StorySlideReaderProps {
  story: CoupleStory
  className?: string
}

export function StorySlideReader({
  story,
  className,
}: StorySlideReaderProps) {
  const { language, t } = useLanguage()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [direction, setDirection] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  const pages = story.pages
  const currentPage = pages[currentPageIndex]
  const totalPages = pages.length

  const paginate = useCallback(
    (newDirection: number) => {
      const nextIndex = currentPageIndex + newDirection
      if (nextIndex >= 0 && nextIndex < totalPages) {
        setDirection(newDirection)
        setCurrentPageIndex(nextIndex)
      }
    },
    [currentPageIndex, totalPages]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        paginate(1)
      } else if (e.key === 'ArrowLeft') {
        paginate(-1)
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [paginate, isFullscreen])

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 320 : -320,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 30 },
        opacity: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 320 : -320,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  }

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // ignore
    }
  }

  return (
    <div
      className={cn(
        'relative bg-[#F9F6F0] text-charcoal flex flex-col transition-all duration-300 rounded-none overflow-hidden border border-sand/70 shadow-sm',
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none bg-[#F9F6F0] p-4 sm:p-8'
          : 'w-full',
        className
      )}
    >
      {/* Top Bar: Story title, couple names, and page indicators */}
      <div className="flex items-center justify-between border-b border-sand/70 px-4 sm:px-8 py-3.5 bg-white/70 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
            {language === 'vi' ? story.categoryVi : story.categoryEn}
          </span>
          <h4 className="font-serif text-base sm:text-lg font-medium text-charcoal tracking-tight">
            {language === 'vi' ? story.coupleVi : story.coupleEn}
          </h4>
          <span className="hidden sm:inline text-xs text-earth/50">·</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-earth/70 font-light">
            <MapPin className="h-3 w-3 text-terracotta/70" />
            {language === 'vi' ? story.locationVi : story.locationEn}
          </span>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Page Counter & Progress */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-wider font-semibold text-charcoal">
              {String(currentPageIndex + 1).padStart(2, '0')}
            </span>
            <div className="w-12 sm:w-20 h-1 bg-sand/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-charcoal transition-all duration-300"
                style={{
                  width: `${((currentPageIndex + 1) / totalPages) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs font-mono text-earth/60">
              {String(totalPages).padStart(2, '0')}
            </span>
          </div>

          <div className="h-4 w-px bg-sand/80 hidden sm:block" />

          {/* Social / interact */}
          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className={cn(
              'p-1.5 rounded-full transition-colors',
              liked ? 'text-red-500 bg-red-50' : 'text-earth/70 hover:text-charcoal hover:bg-sand/30'
            )}
            title={t('Thích câu chuyện', 'Like story')}
          >
            <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-full text-earth/70 hover:text-charcoal hover:bg-sand/30 transition-colors"
            title={copied ? t('Đã sao chép link!', 'Link copied!') : t('Chia sẻ', 'Share')}
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-full text-earth/70 hover:text-charcoal hover:bg-sand/30 transition-colors"
            title={isFullscreen ? t('Thu nhỏ', 'Minimize') : t('Xem toàn màn hình', 'Fullscreen')}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Slide Body with AnimatePresence */}
      <div className="relative min-h-[500px] lg:min-h-[580px] flex-1 flex flex-col justify-center overflow-hidden p-4 sm:p-8 lg:p-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPageIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-6xl mx-auto"
          >
            {/* Dynamic Layout according to page configuration */}
            {currentPage.layout === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                {/* Left: Narrative content */}
                <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
                  <div className="space-y-1">
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-terracotta">
                      {language === 'vi' ? currentPage.locationVi : currentPage.locationEn}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal tracking-tight leading-tight">
                      {language === 'vi' ? currentPage.titleVi : currentPage.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-earth/80 italic">
                      {language === 'vi' ? currentPage.subtitleVi : currentPage.subtitleEn}
                    </p>
                  </div>

                  {currentPage.quoteVi && (
                    <blockquote className="border-l-2 border-terracotta/70 pl-4 py-1 font-serif italic text-base sm:text-lg text-charcoal/90">
                      {language === 'vi' ? currentPage.quoteVi : currentPage.quoteEn}
                    </blockquote>
                  )}

                  <p className="text-xs sm:text-sm leading-relaxed text-earth/90 font-light">
                    {language === 'vi' ? currentPage.contentVi : currentPage.contentEn}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-light text-earth/60">
                    <span>
                      {t('Trang', 'Page')} {currentPageIndex + 1} {t('trên', 'of')} {totalPages}
                    </span>
                    <span>·</span>
                    <span>{t('Ghi nhận bởi Wispic Studio', 'Documented by Wispic Studio')}</span>
                  </div>
                </div>

                {/* Right: Featured photograph */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="group relative aspect-[4/3] sm:aspect-[4/3] w-full overflow-hidden shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] bg-sand/20">
                    {currentPage.images[0] && (
                      <Image
                        src={currentPage.images[0].src}
                        alt={language === 'vi' ? currentPage.images[0].altVi : currentPage.images[0].altEn}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    )}
                    {currentPage.images[0]?.captionVi && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 to-transparent p-4 pt-8 text-white/95">
                        <p className="text-xs font-light tracking-wide">
                          {language === 'vi' ? currentPage.images[0].captionVi : currentPage.images[0].captionEn}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentPage.layout === 'duo' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-sand/50">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-terracotta">
                      {language === 'vi' ? currentPage.locationVi : currentPage.locationEn}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal tracking-tight">
                      {language === 'vi' ? currentPage.titleVi : currentPage.titleEn}
                    </h3>
                  </div>
                  {currentPage.quoteVi && (
                    <p className="font-serif italic text-sm sm:text-base text-earth max-w-md text-right sm:text-left">
                      {language === 'vi' ? currentPage.quoteVi : currentPage.quoteEn}
                    </p>
                  )}
                </div>

                {/* Two Photo Spread */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                  {currentPage.images.map((img, idx) => (
                    <div key={idx} className="space-y-2 group">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/20 shadow-sm">
                        <Image
                          src={img.src}
                          alt={language === 'vi' ? img.altVi : img.altEn}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />
                      </div>
                      {img.captionVi && (
                        <p className="text-[11px] font-light text-earth/70">
                          {language === 'vi' ? img.captionVi : img.captionEn}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs sm:text-sm font-light text-earth/90 max-w-3xl leading-relaxed pt-2">
                  {language === 'vi' ? currentPage.contentVi : currentPage.contentEn}
                </p>
              </div>
            )}

            {currentPage.layout === 'full-bleed' && (
              <div className="space-y-5">
                <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden shadow-md bg-sand/20 group">
                  {currentPage.images[0] && (
                    <Image
                      src={currentPage.images[0].src}
                      alt={language === 'vi' ? currentPage.images[0].altVi : currentPage.images[0].altEn}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex items-end p-6 sm:p-10 text-white">
                    <div className="space-y-2 max-w-2xl">
                      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/80">
                        {language === 'vi' ? currentPage.locationVi : currentPage.locationEn}
                      </p>
                      <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal italic">
                        {language === 'vi' ? currentPage.titleVi : currentPage.titleEn}
                      </h3>
                      {currentPage.quoteVi && (
                        <p className="text-xs sm:text-sm text-white/90 font-light">
                          {language === 'vi' ? currentPage.quoteVi : currentPage.quoteEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 text-xs font-light text-earth/80 pt-1">
                  <p className="max-w-2xl leading-relaxed">
                    {language === 'vi' ? currentPage.contentVi : currentPage.contentEn}
                  </p>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-terracotta shrink-0">
                    {t('Ảnh chụp màu hoàng hôn', 'Twilight film frame')}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating Side Arrows on Desktop */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          disabled={currentPageIndex === 0}
          aria-label={t('Trang trước', 'Previous page')}
          className={cn(
            'absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-charcoal shadow-md transition-all hover:bg-charcoal hover:text-white',
            currentPageIndex === 0 && 'opacity-20 cursor-not-allowed hover:bg-white/80 hover:text-charcoal'
          )}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          type="button"
          onClick={() => paginate(1)}
          disabled={currentPageIndex === totalPages - 1}
          aria-label={t('Trang tiếp theo', 'Next page')}
          className={cn(
            'absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-charcoal shadow-md transition-all hover:bg-charcoal hover:text-white',
            currentPageIndex === totalPages - 1 &&
              'opacity-20 cursor-not-allowed hover:bg-white/80 hover:text-charcoal'
          )}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Bottom Thumbnail Scrubber & Page Navigation */}
      <div className="border-t border-sand/70 bg-white/80 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
        {/* Page thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {pages.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDirection(idx > currentPageIndex ? 1 : -1)
                setCurrentPageIndex(idx)
              }}
              className={cn(
                'group relative flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all border',
                currentPageIndex === idx
                  ? 'border-charcoal bg-charcoal text-white font-medium'
                  : 'border-sand/70 bg-white text-earth hover:border-charcoal/40 hover:text-charcoal'
              )}
            >
              <span className="font-mono text-[10px]">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="truncate max-w-[100px] sm:max-w-[130px] font-light">
                {language === 'vi' ? p.titleVi : p.titleEn}
              </span>
            </button>
          ))}
        </div>

        {/* View full album CTA */}
        <div className="flex items-center gap-3">
          <Link
            href={`/stories/${story.slug}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-terracotta hover:text-charcoal transition-colors"
          >
            <span>{t('Xem toàn bộ bài viết', 'Read Full Story')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
