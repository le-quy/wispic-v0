'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Camera,
  MapPin,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PORTFOLIO_ALBUMS, PortfolioAlbum } from '@/lib/studio-data'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

export default function PortfolioPage() {
  const { language, t } = useLanguage()
  const [filter, setFilter] = useState<'all' | 'wedding-day' | 'pre-wedding' | 'concept' | 'destination'>('all')
  const [activeAlbum, setActiveAlbum] = useState<PortfolioAlbum | null>(null)
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0)

  const filteredAlbums =
    filter === 'all'
      ? PORTFOLIO_ALBUMS
      : PORTFOLIO_ALBUMS.filter((a) => a.category === filter)

  const filterTabs = [
    { id: 'all', labelVi: 'Tất Cả', labelEn: 'All Albums' },
    { id: 'pre-wedding', labelVi: 'Pre-wedding Ngoại cảnh', labelEn: 'Outdoor Pre-wedding' },
    { id: 'wedding-day', labelVi: 'Phóng sự Ngày cưới', labelEn: 'Wedding Day' },
    { id: 'concept', labelVi: 'Concept & Studio', labelEn: 'Concept & Studio' },
    { id: 'destination', labelVi: 'Destination Wedding', labelEn: 'Destination' },
  ]

  const openAlbumModal = (album: PortfolioAlbum) => {
    setActiveAlbum(album)
    setActivePhotoIdx(0)
  }

  return (
    <main className="min-h-screen bg-[#FBF8F2] text-[#292522] selection:bg-terracotta/20 selection:text-charcoal font-sans antialiased">
      <SiteHeader />

      {/* Hero Banner */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 border-b border-sand/70 bg-[#F7F2E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
            <Camera className="h-4 w-4" />
            <span>{t('KHO ẢNH CƯỚI WISPIC', 'WISPIC WEDDING ARCHIVE')}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-charcoal tracking-tight">
            {t('Bộ Sưu Tập Ảnh Cưới', 'Our Wedding Portfolio')}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base font-light text-earth/90 leading-relaxed">
            {t(
              'Những khoảnh khắc tự nhiên, ấm áp và đong đầy xúc cảm. Mỗi bộ ảnh là một câu chuyện tình yêu độc bản mà hai bạn cùng Wispic viết nên.',
              'Natural, warm, and emotionally resonant frames. Each gallery is a bespoke love story crafted by you and Wispic.'
            )}
          </p>

          {/* Stats Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs font-light text-earth/80">
            <div>
              <span className="font-serif text-lg font-medium text-charcoal">500+ </span>
              <span>{t('Cặp đôi đã đồng hành', 'Couples documented')}</span>
            </div>
            <span>·</span>
            <div>
              <span className="font-serif text-lg font-medium text-charcoal">100% </span>
              <span>{t('Khoảnh khắc tự nhiên', 'Unscripted moments')}</span>
            </div>
            <span>·</span>
            <div>
              <span className="font-serif text-lg font-medium text-charcoal">Hội An · Đà Lạt · Sài Gòn</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-[69px] z-30 bg-[#FBF8F2]/95 backdrop-blur-md border-b border-sand/70 py-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as never)}
              className={cn(
                'px-4 py-2 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer rounded-none border',
                filter === tab.id
                  ? 'border-charcoal bg-charcoal text-white font-medium shadow-sm'
                  : 'border-sand/70 bg-white/70 text-charcoal/80 hover:bg-white hover:border-charcoal/40 font-light'
              )}
            >
              {language === 'vi' ? tab.labelVi : tab.labelEn}
            </button>
          ))}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {filteredAlbums.map((album) => (
              <motion.div
                key={album.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                onClick={() => openAlbumModal(album)}
                className="group cursor-pointer space-y-3"
              >
                {/* Photo Aspect Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand/30 shadow-sm">
                  <Image
                    src={album.coverImage}
                    alt={language === 'vi' ? album.titleVi : album.titleEn}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 text-charcoal opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-4 w-4" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-charcoal/80 px-2 py-1">
                      {language === 'vi' ? album.categoryLabelVi : album.categoryLabelEn}
                    </span>
                    <span className="text-xs font-mono">
                      {album.gallery.length} {t('ảnh', 'photos')}
                    </span>
                  </div>
                </div>

                {/* Album Details */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl font-medium text-charcoal group-hover:text-terracotta transition-colors leading-snug">
                      {language === 'vi' ? album.titleVi : album.titleEn}
                    </h3>
                    <span className="text-[11px] font-mono text-earth/60 shrink-0">
                      {album.dateVi}
                    </span>
                  </div>
                  <p className="text-xs font-light text-earth flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-terracotta/70" />
                    <span>{language === 'vi' ? album.locationVi : album.locationEn}</span>
                  </p>
                  <p className="text-xs font-light text-earth/75 line-clamp-2 pt-1">
                    {language === 'vi' ? album.storySummaryVi : album.storySummaryEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Consultation Banner */}
      <section className="border-t border-sand/70 bg-[#F4EFE6] py-16 lg:py-20 text-center">
        <div className="mx-auto max-w-3xl px-6 space-y-4">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
            {t('ĐỒNG HÀNH CÙNG WISPIC', 'WORK WITH WISPIC')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
            {t('Bạn đã tìm thấy cảm hứng cho bộ ảnh của mình?', 'Found the visual tone you love?')}
          </h2>
          <p className="text-xs sm:text-sm font-light text-earth/90 leading-relaxed max-w-xl mx-auto">
            {t(
              'Hãy chia sẻ với Wispic về địa điểm mong muốn, trang phục hay câu chuyện của hai bạn. Chúng mình sẽ cùng bạn lên concept hoàn hảo nhất.',
              'Share your dream location, wardrobe ideas, and love story. We’ll curate the ideal concept tailored to you.'
            )}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="bg-charcoal text-[#F7F2E9] px-7 py-3 text-xs font-medium uppercase tracking-[0.16em] hover:bg-terracotta transition-colors"
            >
              {t('Đặt Lịch Tư Vấn Ngay', 'Book a Consultation')}
            </Link>
            <Link
              href="/services"
              className="border border-charcoal/30 bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-charcoal hover:border-charcoal transition-colors"
            >
              {t('Xem Bảng Giá Trọn Gói', 'View Pricing Packages')}
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Album Lightbox Modal */}
      {activeAlbum && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 p-4 sm:p-8 backdrop-blur-md"
        >
          <div className="relative max-h-[92vh] max-w-5xl w-full bg-[#FAF7F2] p-6 sm:p-10 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <button
              type="button"
              onClick={() => setActiveAlbum(null)}
              className="absolute top-4 right-4 p-2 text-earth hover:text-charcoal transition-colors cursor-pointer"
              aria-label={t('Đóng', 'Close')}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-6">
              {/* Header inside modal */}
              <div className="border-b border-sand/70 pb-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-terracotta">
                  {language === 'vi' ? activeAlbum.categoryLabelVi : activeAlbum.categoryLabelEn}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal">
                  {language === 'vi' ? activeAlbum.titleVi : activeAlbum.titleEn}
                </h3>
                <p className="text-xs text-earth/70 font-light mt-1">
                  {language === 'vi' ? activeAlbum.locationVi : activeAlbum.locationEn} · {activeAlbum.dateVi}
                </p>
              </div>

              {/* Main Photo Slide in Lightbox */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/20 shadow-sm">
                <Image
                  src={activeAlbum.gallery[activePhotoIdx]?.src || activeAlbum.coverImage}
                  alt="Gallery frame"
                  fill
                  className="object-cover"
                />

                {/* Left/Right buttons inside lightbox */}
                {activeAlbum.gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePhotoIdx(
                          (activePhotoIdx - 1 + activeAlbum.gallery.length) %
                            activeAlbum.gallery.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full text-charcoal hover:bg-white shadow"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePhotoIdx((activePhotoIdx + 1) % activeAlbum.gallery.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full text-charcoal hover:bg-white shadow"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-earth/80 font-light border-b border-sand/50 pb-3">
                <p className="italic">
                  {language === 'vi'
                    ? activeAlbum.gallery[activePhotoIdx]?.captionVi
                    : activeAlbum.gallery[activePhotoIdx]?.captionEn}
                </p>
                <span className="font-mono text-xs">
                  {activePhotoIdx + 1} / {activeAlbum.gallery.length}
                </span>
              </div>

              {/* Thumbnails row */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {activeAlbum.gallery.map((g, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={cn(
                      'relative h-16 w-20 shrink-0 overflow-hidden border-2 transition-all cursor-pointer',
                      activePhotoIdx === idx ? 'border-terracotta scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <Image src={g.src} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Modal footer CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-light text-earth max-w-md">
                  {language === 'vi' ? activeAlbum.storySummaryVi : activeAlbum.storySummaryEn}
                </p>
                <Link
                  href="/contact"
                  onClick={() => setActiveAlbum(null)}
                  className="bg-charcoal text-[#F7F2E9] px-6 py-2.5 text-xs font-medium uppercase tracking-wider hover:bg-terracotta transition-colors shrink-0"
                >
                  {t('Tư Vấn Gói Chụp Này', 'Inquire This Style')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </main>
  )
}
