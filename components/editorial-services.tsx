'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { STUDIO_SERVICES } from '@/lib/studio-data'
import { InquiryDialog } from '@/components/inquiry-dialog'
import { useLanguage } from '@/lib/language-context'

export function EditorialServices() {
  const { language, t } = useLanguage()
  const [inquiryOpen, setInquiryOpen] = useState(false)

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#F5F0E8] border-t border-sand/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-sand/60">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-terracotta">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t('DỊCH VỤ & GÓI CHỤP', 'SERVICES & PACKAGES')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
              {t('Gói Chụp Ảnh & Phim Cưới Trọn Gói', 'Comprehensive Wedding Photography & Film')}
            </h2>
            <p className="text-sm sm:text-base font-light text-earth/80 leading-relaxed max-w-xl">
              {t(
                'Minh bạch, trọn vẹn và không phát sinh chi phí ẩn. Mỗi gói dịch vụ đều được thiết kế kỹ lưỡng để hai bạn có trải nghiệm chụp ảnh thoải mái nhất.',
                'Transparent, comprehensive with no hidden costs. Every package is tailored so you can savor an effortless, joyous shoot.'
              )}
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 border border-charcoal/30 bg-white/60 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-charcoal hover:bg-charcoal hover:text-white transition-all shrink-0"
          >
            <span>{t('Xem Bảng Giá Chi Tiết', 'View Full Pricing')}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {STUDIO_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white/80 border border-sand/70 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-terracotta">
                      {service.number} · {language === 'vi' ? service.badgeVi : service.badgeEn}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal group-hover:text-terracotta transition-colors mt-1">
                      {language === 'vi' ? service.titleVi : service.titleEn}
                    </h3>
                  </div>

                  <span className="font-serif text-lg sm:text-xl font-semibold text-terracotta shrink-0">
                    {language === 'vi' ? service.priceVi : service.priceEn}
                  </span>
                </div>

                <div className="relative aspect-[16/9] w-full overflow-hidden bg-sand/20">
                  <Image
                    src={service.featuredImage}
                    alt={language === 'vi' ? service.titleVi : service.titleEn}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <p className="text-xs sm:text-sm font-light text-earth/90 leading-relaxed">
                  {language === 'vi' ? service.descriptionVi : service.descriptionEn}
                </p>

                {/* Inclusions preview */}
                <div className="pt-3 border-t border-sand/50 space-y-2">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-charcoal font-medium">
                    {t('Bao gồm trong gói:', 'Included in package:')}
                  </p>
                  <ul className="space-y-1.5 text-xs font-light text-earth/80">
                    {(language === 'vi' ? service.inclusionsVi : service.inclusionsEn)
                      .slice(0, 3)
                      .map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-terracotta shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-4 border-t border-sand/60 flex items-center justify-between gap-4">
                <Link
                  href={`/services#${service.id}`}
                  className="text-xs font-medium uppercase tracking-wider text-charcoal hover:text-terracotta transition-colors"
                >
                  {t('Chi tiết gói →', 'Package details →')}
                </Link>

                <button
                  type="button"
                  onClick={() => setInquiryOpen(true)}
                  className="bg-charcoal text-[#F7F2E9] px-5 py-2 text-xs font-medium uppercase tracking-[0.16em] hover:bg-terracotta transition-colors cursor-pointer"
                >
                  {t('Nhận Báo Giá', 'Get Quote')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InquiryDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </section>
  )
}
