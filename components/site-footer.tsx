'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { useLanguage } from '@/lib/language-context'
import { Phone, Mail } from 'lucide-react'

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-sand/70 bg-[#F4EFE6]/80 text-charcoal">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
        {/* Top Studio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-sand/60">
          {/* Brand & Manifesto (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <Logo showMark />
            </Link>
            <p className="font-serif italic text-lg sm:text-xl text-charcoal">
              {t('Những câu chuyện tình yêu ngọt ngào & chân thật.', 'Stories worth remembering.')}
            </p>
            <p className="max-w-sm text-xs font-light text-earth/80 leading-relaxed">
              {t(
                'Wispic là studio nhiếp ảnh cưới và phim tài liệu độc lập tại Việt Nam. Chúng mình hướng đến những khoảnh khắc tự nhiên, ấm áp và vượt thời gian — nơi tình yêu của hai bạn tự kể câu chuyện của chính mình.',
                'Wispic is an independent wedding photography and cinema studio in Vietnam. We believe in natural, warm, and timeless frames where your love speaks truthfully.'
              )}
            </p>

            <div className="pt-2 text-xs font-light text-earth space-y-1.5">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-terracotta" />
                <span>Hotline: 0905 882 140 · 0935 120 440</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-terracotta" />
                <span>Email: contact@wispic.vn · booking@wispic.vn</span>
              </p>
            </div>
          </div>

          {/* Quick Links: Portfolio & Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-earth">
              {t('Khám Phá', 'Explore')}
            </p>
            <ul className="space-y-2 text-xs font-light text-charcoal/85">
              <li>
                <Link href="/portfolio" className="hover:text-terracotta transition-colors">
                  {t('Bộ Sưu Tập Ảnh Cưới', 'Wedding Portfolio')}
                </Link>
              </li>
              <li>
                <Link href="/portfolio?category=pre-wedding" className="hover:text-terracotta transition-colors">
                  {t('Pre-wedding Ngoại cảnh & Studio', 'Pre-wedding Collection')}
                </Link>
              </li>
              <li>
                <Link href="/portfolio?category=wedding-day" className="hover:text-terracotta transition-colors">
                  {t('Phóng Sự Ngày Cưới', 'Wedding Day Documentary')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-terracotta transition-colors">
                  {t('Dịch Vụ & Báo Giá Trọn Gói', 'Services & Pricing')}
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-terracotta transition-colors">
                  {t('Câu Chuyện Tình Yêu (Slide)', 'Couple Stories Slider')}
                </Link>
              </li>
              <li>
                <Link href="/invitations" className="hover:text-terracotta transition-colors">
                  {t('Thiệp Cưới Online Thông Minh', 'Digital Invitations')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio & Philosophy (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-earth">
              {t('Về Studio', 'About Studio')}
            </p>
            <ul className="space-y-2 text-xs font-light text-charcoal/85">
              <li>
                <Link href="/about" className="hover:text-terracotta transition-colors">
                  {t('Câu Chuyện Thương Hiệu', 'Brand Story')}
                </Link>
              </li>
              <li>
                <Link href="/about#philosophy" className="hover:text-terracotta transition-colors">
                  {t('Triết Lý Nhiếp Ảnh', 'Our Philosophy')}
                </Link>
              </li>
              <li>
                <Link href="/about#team" className="hover:text-terracotta transition-colors">
                  {t('Đội Ngũ Nhiếp Ảnh Gia', 'The Photographers')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-terracotta transition-colors">
                  {t('Đặt Lịch & Tư Vấn', 'Booking Consultation')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create" className="hover:text-terracotta transition-colors text-terracotta font-medium">
                  {t('Tạo Thiệp Cưới Miễn Phí', 'Create Free Invitation')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-earth">
              {t('Địa Chỉ Studio', 'Studio Locations')}
            </p>
            <div className="space-y-2.5 text-xs font-light text-earth/80">
              <div>
                <p className="font-medium text-charcoal">{t('Hội An & Đà Nẵng', 'Hoi An & Da Nang')}</p>
                <p className="text-[11px]">88 Cửa Đại, Hội An, Quảng Nam</p>
              </div>
              <div>
                <p className="font-medium text-charcoal">{t('Đà Lạt', 'Da Lat')}</p>
                <p className="text-[11px]">24 Khởi Nghĩa Bắc Sơn, P.10, Đà Lạt</p>
              </div>
              <div>
                <p className="font-medium text-charcoal">{t('Sài Gòn', 'Saigon Atelier')}</p>
                <p className="text-[11px]">42 Lý Tự Trọng, Bến Nghé, Quận 1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Colophon line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-earth/70">
          <p>© {new Date().getFullYear()} WISPIC Studio. All rights reserved. Ghi dấu cảm xúc tự nhiên.</p>
          <div className="flex items-center gap-6">
            <Link href="/portfolio" className="hover:text-charcoal transition-colors">
              {t('Bộ Ảnh', 'Portfolio')}
            </Link>
            <Link href="/services" className="hover:text-charcoal transition-colors">
              {t('Báo Giá', 'Pricing')}
            </Link>
            <Link href="/contact" className="hover:text-charcoal transition-colors">
              {t('Liên Hệ', 'Contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
