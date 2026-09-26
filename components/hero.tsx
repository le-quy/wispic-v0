'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, Camera, MapPin } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section id="top" className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
      {/* Background warm ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(217,120,50,0.06), transparent 60%)',
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 flex-1 flex flex-col justify-between">
        {/* Top Studio Indicator Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand/70 pb-3.5 text-[11px] font-light tracking-[0.2em] text-earth uppercase">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            <span className="font-mono text-terracotta font-medium">
              {t('Wispic Photography Studio', 'Wispic Photography Studio')}
            </span>
            <span>·</span>
            <span>{t('Ảnh Cưới Tự Nhiên & Cảm Xúc', 'Natural Wedding & Documentary')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-earth/80">
            <span>Hội An</span>
            <span>·</span>
            <span>Đà Lạt</span>
            <span>·</span>
            <span>Sài Gòn</span>
            <span>·</span>
            <span>Đà Nẵng</span>
          </div>
          <div className="flex items-center gap-1.5 text-earth/80">
            <MapPin className="h-3 w-3 text-terracotta/70" />
            <span>{t('Mùa cưới 2025 – 2026', 'Wedding Season 2025–2026')}</span>
          </div>
        </div>

        {/* Main Studio Hero Grid */}
        <div className="my-auto py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Typography & Storytelling Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-terracotta">
              <Camera className="h-3.5 w-3.5" />
              <span>
                {t(
                  'CẢM XÚC TỰ NHIÊN · KHÔNG DÀN DỰNG',
                  'UNPOSED · RAW EMOTIONS'
                )}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-charcoal leading-[1.08]">
                {t('Ghi lại những rung động', 'Capturing the heartbeats')}
                <br />
                <span className="italic text-terracotta">
                  {t('chân thật nhất.', 'that stay forever.')}
                </span>
              </h1>
            </div>

            <p className="max-w-md text-sm sm:text-base font-light leading-relaxed text-earth/90">
              {t(
                'Lấy cảm hứng từ sự mộc mạc và ngọt ngào của tình yêu đích thực, Wispic mang đến những bộ ảnh cưới tự nhiên như một buổi hẹn hò thong thả. Không tạo dáng cứng nhắc — chúng mình ở đây để ghi lại nụ cười rạng rỡ, cái siết tay nhẹ và những khoảnh khắc khiến tim bạn rung rinh.',
                'Inspired by honest, tender love, Wispic crafts wedding photos captured like an unhurried romantic date. No forced poses — we document the bright laughter, gentle touch, and quiet glances that make your hearts flutter.'
              )}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/portfolio"
                className="group inline-flex items-center justify-center gap-2.5 bg-charcoal text-[#F7F2E9] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] transition-all hover:bg-terracotta"
              >
                <span>{t('Xem Bộ Ảnh Cưới', 'View Wedding Portfolio')}</span>
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2.5 border border-charcoal/30 bg-white/50 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-charcoal transition-all hover:border-charcoal hover:bg-white"
              >
                <span>{t('Đặt Lịch Tư Vấn', 'Book Consultation')}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Studio key offerings */}
            <div className="pt-4 border-t border-sand/60 grid grid-cols-2 gap-3 text-xs font-light text-earth/80">
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-terracotta" />
                <span>{t('Pre-wedding ngoại cảnh & studio', 'Pre-wedding outdoor & studio')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-terracotta" />
                <span>{t('Phóng sự trọn gói ngày cưới', 'Full wedding day documentary')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-terracotta" />
                <span>{t('Phim cưới Cinematic 4K', 'Cinematic 4K wedding films')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-terracotta" />
                <span>{t('Thiệp cưới online tương tác', 'Interactive online invitations')}</span>
              </div>
            </div>
          </div>

          {/* Photograph Visual Frame (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative group">
              {/* Clean frame border */}
              <div
                aria-hidden
                className="absolute -inset-2.5 border border-sand/70 pointer-events-none transition-all duration-700 group-hover:border-terracotta/40 hidden sm:block"
              />

              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-sand/30 shadow-[0_20px_50px_-20px_rgba(41,37,34,0.2)]">
                <Image
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=85"
                  alt={t(
                    'Ảnh cưới tự nhiên Wispic — Nụ cười rạng rỡ của cặp đôi bên bờ biển',
                    'Wispic Wedding Photography — Natural smiles by the sea'
                  )}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                />

                {/* Subtle vignette gradient */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-transparent opacity-80"
                />

                {/* Overlay Caption on Image */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between text-white/95">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/80">
                      {t('Minh & Hà · Bộ ảnh Pre-wedding', 'Minh & Ha · Pre-wedding Shoot')}
                    </p>
                    <p className="font-serif text-lg sm:text-2xl font-normal italic tracking-wide">
                      {t('“Hoàng hôn bên bờ biển An Bàng”', '“Twilight by An Bang Beach”')}
                    </p>
                  </div>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-white/40 text-white transition-all"
                  >
                    <span>{t('Xem bộ ảnh', 'View Album')}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Bottom annotation */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-light text-earth/70">
                <span>{t('Hội An, Quảng Nam · 16:30 nắng hoàng hôn', 'Hoi An, Vietnam · 16:30 golden hour')}</span>
                <span>{t('Tone màu ấm áp · Ánh sáng tự nhiên', 'Warm tone · 100% natural light')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Studio Ticker */}
        <div className="pt-4 border-t border-sand/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-light text-earth/70">
          <p className="italic font-serif text-sm sm:text-base text-charcoal/80">
            {t(
              '“Mỗi cái chạm tay, mỗi nụ cười đều là duy nhất — Chúng mình trân trọng từng câu chuyện tình yêu của hai bạn.”',
              '“Every touch, every glance is unique — We honor your one-of-a-kind love story.”'
            )}
          </p>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
            <span>{t('Khám phá các bộ ảnh', 'Explore Galleries')}</span>
            <span className="inline-block w-8 h-px bg-terracotta" />
          </div>
        </div>
      </div>
    </section>
  )
}
