'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section id="top" className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden">
      {/* Background subtle tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(217,120,50,0.04), transparent 60%)',
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 flex-1 flex flex-col justify-between">
        {/* Top Folio / Issue Identifier */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand/70 pb-4 text-[11px] font-light tracking-[0.22em] text-earth uppercase">
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-terracotta text-sm">
              {t('Ấn bản số 04', 'Issue No. 04')}
            </span>
            <span>·</span>
            <span>{t('Nhiếp ảnh Đương đại & Tác phẩm Số', 'Contemporary Photography & Objects')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>Đà Nẵng</span>
            <span>·</span>
            <span>Hội An</span>
            <span>·</span>
            <span>Sài Gòn</span>
            <span>·</span>
            <span>Đà Lạt</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{t('Lưu trữ 2024–2026', 'Archive 2024–2026')}</span>
          </div>
        </div>

        {/* Main Editorial Hero Grid */}
        <div className="my-auto py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Typography & Storytelling Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-terracotta">
              {t('Nhiếp ảnh · Du hành · Thiệp cưới · Sáng tạo', 'Photography · Travel · Wedding · Creative')}
            </p>

            <div className="space-y-1">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-charcoal leading-[1.05]">
                Wispic
              </h1>
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl italic font-light text-charcoal/90 leading-tight">
                {t('Những câu chuyện đáng nhớ.', 'Stories worth remembering.')}
              </p>
            </div>

            <p className="max-w-md text-sm sm:text-base font-light leading-relaxed text-earth/90 pt-2">
              {t(
                'Một studio nhiếp ảnh và nghệ thuật thị giác độc lập ghi lại sự hiện diện của con người, những khoảng lặng của đất trời và những khoảnh khắc xúc chạm. Chúng mình tạo nên những tác phẩm số tinh tế cho những ngày kỷ niệm xứng đáng nhiều hơn một khuôn mẫu vội vã.',
                'An independent photography and visual studio documenting human presence, quiet landscapes, and tactile moments. We build thoughtful digital artifacts for celebrations that deserve more than fleeting templates.'
              )}
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#photography"
                className="group inline-flex items-center justify-center gap-2.5 bg-charcoal text-[#F7F2E9] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] transition-all hover:bg-terracotta"
              >
                <span>{t('Khám phá Wispic', 'Explore Wispic')}</span>
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </a>

              <Link
                href="/dashboard/create"
                className="group inline-flex items-center justify-center gap-2.5 border border-charcoal/30 bg-white/40 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-charcoal transition-all hover:border-charcoal hover:bg-white"
              >
                <span>{t('Tạo thiệp cưới', 'Create Invitation')}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Quiet metadata line */}
            <div className="pt-6 border-t border-sand/50 flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] font-light text-earth/70">
              <span>{t('Tuyển chọn bởi Ban Biên tập', 'Curated by Editorial Team')}</span>
              <span>·</span>
              <span>{t('Thiệp cưới Online Tinh tế', 'Online Wedding Invitations')}</span>
              <span>·</span>
              <span>{t('Bản in Thủ công Giới hạn', 'Fine Art Prints')}</span>
            </div>
          </div>

          {/* Editorial Photograph Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative group">
              {/* Asymmetric framing lines */}
              <div
                aria-hidden
                className="absolute -inset-2.5 border border-sand/70 pointer-events-none transition-all duration-700 group-hover:border-terracotta/40 hidden sm:block"
              />

              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-sand/30 shadow-[0_20px_50px_-20px_rgba(41,37,34,0.25)]">
                <Image
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=85"
                  alt={t('Nhiếp ảnh Biên tập Wispic — Chân dung cặp đôi ngập tràn ánh sáng tự nhiên', 'Wispic Editorial Photography — Intimate natural light couple portrait')}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                />

                {/* Subtle vignette gradient */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-80"
                />

                {/* Overlay Caption on Image */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between text-white/95">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-light uppercase tracking-[0.25em] text-white/75">
                      {t('Bản ghi số 01 · Lưu trữ', 'Plate No. 01 · Archive')}
                    </p>
                    <p className="font-serif text-lg sm:text-xl font-normal italic tracking-wide">
                      {t('“Trước hoàng hôn bên biển An Bàng”', '“Before Twilight at An Bang”')}
                    </p>
                  </div>
                  <span className="text-[10px] font-light uppercase tracking-[0.2em] text-white/80 hidden sm:inline">
                    {t('35mm · Ánh sáng tự nhiên', '35mm · Natural Light')}
                  </span>
                </div>
              </div>

              {/* Editorial bottom annotation */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-light text-earth/70">
                <span>{t('15°54\'B 108°21\'Đ — Hội An, Việt Nam', '15°54\'N 108°21\'E — Hoi An, Vietnam')}</span>
                <span>{t('Ghi nhận trên chất liệu Phim & Kỹ thuật số', 'Documented on Film & Digital Medium')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Ticker */}
        <div className="pt-4 border-t border-sand/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-light text-earth/70">
          <p className="italic font-serif text-sm text-charcoal/80">
            {t(
              '“Chúng mình chụp ảnh con người theo cách ký ức đọng lại — ấm áp, chậm rãi và chân thành.”',
              '“We photograph people the way memories feel — warm, unhurried, and truthful.”'
            )}
          </p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em]">
            <span>{t('Cuộn để khám phá', 'Scroll to Discover')}</span>
            <span className="inline-block w-8 h-px bg-earth/40" />
          </div>
        </div>
      </div>
    </section>
  )
}
