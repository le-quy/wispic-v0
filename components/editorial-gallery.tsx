'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ZoomIn, ArrowUpRight, Camera } from 'lucide-react'
import { PORTFOLIO_ALBUMS, PortfolioAlbum } from '@/lib/studio-data'
import { useLanguage } from '@/lib/language-context'

export function EditorialGallery() {
  const { language, t } = useLanguage()
  const [activeAlbum, setActiveAlbum] = useState<PortfolioAlbum | null>(null)
  const [filter, setFilter] = useState<'all' | 'wedding-day' | 'pre-wedding' | 'concept'>('all')

  const filteredAlbums =
    filter === 'all'
      ? PORTFOLIO_ALBUMS
      : PORTFOLIO_ALBUMS.filter((a) => a.category === filter)

  return (
    <section id="portfolio" className="py-20 lg:py-28 border-t border-sand/70 bg-[#FBF8F2]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-sand/60">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-terracotta">
              <Camera className="h-3.5 w-3.5" />
              <span>{t('BỘ SƯU TẬP ẢNH CƯỚI', 'WEDDING PORTFOLIO')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
              {t('Khoảnh Khắc Tự Nhiên & Chân Thật', 'Natural & Honest Moments')}
            </h2>
            <p className="text-sm sm:text-base font-light text-earth/80 leading-relaxed max-w-xl">
              {t(
                'Không dàn dựng cầu kỳ, không nụ cười gượng ép. Chúng mình nắm bắt những khoảnh khắc hai bạn vui đùa, cái chạm tay dịu dàng và ánh nhìn chan chứa yêu thương.',
                'No rigid choreography, no artificial smiles. We capture the laughter, tender touch, and genuine affection between two souls.'
              )}
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-light tracking-[0.15em] uppercase text-earth">
            {[
              { id: 'all', labelVi: 'Tất cả', labelEn: 'All Albums' },
              { id: 'pre-wedding', labelVi: 'Pre-wedding', labelEn: 'Pre-wedding' },
              { id: 'wedding-day', labelVi: 'Phóng sự cưới', labelEn: 'Wedding Day' },
              { id: 'concept', labelVi: 'Concept & Studio', labelEn: 'Studio Concept' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as never)}
                className={`transition-all pb-1 cursor-pointer ${
                  filter === tab.id
                    ? 'border-b-2 border-charcoal text-charcoal font-semibold'
                    : 'border-b-2 border-transparent text-earth/60 hover:text-charcoal'
                }`}
              >
                {language === 'vi' ? tab.labelVi : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => setActiveAlbum(album)}
              className="group cursor-pointer space-y-3"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand/20 shadow-sm">
                <Image
                  src={album.coverImage}
                  alt={language === 'vi' ? album.titleVi : album.titleEn}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 text-charcoal opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-4 w-4" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-charcoal/70 px-2 py-1">
                    {language === 'vi' ? album.categoryLabelVi : album.categoryLabelEn}
                  </span>
                </div>
              </div>

              {/* Caption Underneath */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif text-lg font-medium text-charcoal group-hover:text-terracotta transition-colors leading-snug">
                    {language === 'vi' ? album.titleVi : album.titleEn}
                  </h3>
                  <span className="text-[11px] font-mono text-earth/60 shrink-0">
                    {album.dateVi}
                  </span>
                </div>
                <p className="text-xs font-light text-earth/80">
                  {language === 'vi' ? album.locationVi : album.locationEn}
                </p>
                <p className="text-xs font-light text-earth/70 line-clamp-2 pt-0.5">
                  {language === 'vi' ? album.storySummaryVi : album.storySummaryEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link to Full Portfolio Landing Page */}
        <div className="mt-14 pt-8 border-t border-sand/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-light text-earth/80">
            {t(
              'Xem thêm hàng chục bộ ảnh Pre-wedding và Phóng sự cưới được cập nhật mới nhất tại trang Portfolio.',
              'Explore dozens of latest Pre-wedding and Wedding Day galleries on our Portfolio page.'
            )}
          </p>

          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 border border-charcoal bg-charcoal text-[#F7F2E9] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] hover:bg-transparent hover:text-charcoal transition-all shrink-0"
          >
            <span>{t('Xem Toàn Bộ Kho Ảnh', 'Explore Full Portfolio')}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Album Modal Viewer */}
      {activeAlbum && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4 sm:p-8 backdrop-blur-md"
        >
          <div className="relative max-h-[90vh] max-w-4xl w-full bg-[#FAF7F2] p-6 sm:p-8 overflow-y-auto shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveAlbum(null)}
              className="absolute top-4 right-4 p-2 text-earth hover:text-charcoal transition-colors cursor-pointer"
              aria-label={t('Đóng', 'Close')}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-terracotta">
                  {language === 'vi' ? activeAlbum.categoryLabelVi : activeAlbum.categoryLabelEn}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal">
                  {language === 'vi' ? activeAlbum.titleVi : activeAlbum.titleEn}
                </h3>
                <p className="text-xs text-earth/70 font-light mt-1">
                  {language === 'vi' ? activeAlbum.locationVi : activeAlbum.locationEn} · {activeAlbum.dateVi}
                </p>
              </div>

              {/* Main Photo Gallery Grid */}
              <div className="space-y-4">
                {activeAlbum.gallery.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/20">
                      <Image
                        src={item.src}
                        alt={language === 'vi' ? item.captionVi : item.captionEn}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs font-light text-earth/80 italic text-center">
                      {language === 'vi' ? item.captionVi : item.captionEn}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-sand/60 flex items-center justify-between">
                <Link
                  href="/portfolio"
                  onClick={() => setActiveAlbum(null)}
                  className="text-xs uppercase tracking-wider font-medium text-terracotta hover:underline"
                >
                  {t('→ Xem thêm các bộ ảnh khác', '→ View more albums')}
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setActiveAlbum(null)}
                  className="bg-charcoal text-[#F7F2E9] px-5 py-2 text-xs uppercase tracking-wider font-medium hover:bg-terracotta transition-colors"
                >
                  {t('Tư vấn gói chụp tương tự', 'Inquire this style')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
