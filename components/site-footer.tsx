'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { useLanguage } from '@/lib/language-context'

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-sand/70 bg-[#F4EFE6]/60 text-charcoal">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        {/* Top Colophon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-sand/60">
          {/* Brand & Manifesto (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <Logo showMark />
            </Link>
            <p className="font-serif italic text-lg text-earth">
              {t('Những câu chuyện đáng nhớ.', 'Stories worth remembering.')}
            </p>
            <p className="max-w-sm text-xs font-light text-earth/80 leading-relaxed">
              {t(
                'Wispic là studio nhiếp ảnh độc lập và nhà xuất bản thiệp cưới nghệ thuật số. Chúng mình sáng tạo các câu chuyện thị giác và thiệp cưới online mang vẻ đẹp tĩnh tại của những ấn phẩm sách ảnh thủ công.',
                'Wispic is an independent photography studio and digital stationery publisher. We craft visual narratives and digital wedding invitations with the quiet beauty of printed monographs.'
              )}
            </p>

            <div className="pt-2 text-[11px] font-light text-earth/70 space-y-1">
              <p>Email: studio@wispic.vn · commissions@wispic.vn</p>
              <p>Hotline Studio: +84 (0) 905 882 140</p>
            </div>
          </div>

          {/* Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-earth">
              {t('Biên tập', 'Editorial')}
            </p>
            <ul className="space-y-2 text-xs font-light text-charcoal/80">
              <li>
                <a href="#photography" className="hover:text-terracotta transition-colors">
                  {t('Lưu trữ Nhiếp ảnh', 'Photography Archive')}
                </a>
              </li>
              <li>
                <a href="#explore" className="hover:text-terracotta transition-colors">
                  {t('Du hành & Địa điểm', 'Travel & Locations')}
                </a>
              </li>
              <li>
                <a href="#wedding" className="hover:text-terracotta transition-colors">
                  {t('Thiệp cưới Online', 'Wedding Invitations')}
                </a>
              </li>
              <li>
                <a href="#style" className="hover:text-terracotta transition-colors">
                  {t('Định hình Phong cách', 'Style Explorer')}
                </a>
              </li>
              <li>
                <a href="#journal" className="hover:text-terracotta transition-colors">
                  {t('Tạp chí Biên tập', 'The Journal')}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-terracotta transition-colors">
                  {t('Dịch vụ Studio', 'Studio Services')}
                </a>
              </li>
            </ul>
          </div>

          {/* Invitation Suite (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-earth">
              {t('Thiệp cưới', 'Invitations')}
            </p>
            <ul className="space-y-2 text-xs font-light text-charcoal/80">
              <li>
                <Link href="/preview/romantic" className="hover:text-terracotta transition-colors">
                  {t('Mẫu Lãng mạn', 'Romantic Edition')}
                </Link>
              </li>
              <li>
                <Link href="/preview/modern" className="hover:text-terracotta transition-colors">
                  {t('Mẫu Thanh xuân', 'Youthful Modern')}
                </Link>
              </li>
              <li>
                <Link href="/preview/traditional" className="hover:text-terracotta transition-colors">
                  {t('Mẫu Song Hỷ', 'Song Hy Heritage')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create" className="hover:text-terracotta transition-colors">
                  {t('Khởi tạo thiệp mới', 'Create New Invitation')}
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-terracotta transition-colors">
                  {t('Quản lý khách mời', 'Guest RSVP Management')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Locations (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-earth">
              {t('Địa chỉ Studio', 'Studio Locations')}
            </p>
            <div className="space-y-3 text-xs font-light text-earth/80">
              <div>
                <p className="font-medium text-charcoal">
                  {t('Duyên hải Miền Trung & Phòng tối', 'Central Coast & Darkroom')}
                </p>
                <p>Bãi biển An Bàng, Cẩm An, Hội An, Quảng Nam</p>
              </div>
              <div>
                <p className="font-medium text-charcoal">
                  {t('Xưởng chế tác Vùng cao', 'Highlands Production')}
                </p>
                <p>Hồ Tuyền Lâm, Phường 4, Đà Lạt</p>
              </div>
              <div>
                <p className="font-medium text-charcoal">
                  {t('Atelier Sáng tạo Sài Gòn', 'Saigon Creative Atelier')}
                </p>
                <p>Đồng Khởi, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Notes */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-light text-earth/60">
          <div>
            {t(
              '© 2024–2026 WISPIC Studio. Toàn bộ bản quyền được bảo lưu. Kiểu chữ biên tập Cormorant Garamond & Be Vietnam Pro.',
              '© 2024–2026 WISPIC Studio. All rights reserved. Editorial typography set in Cormorant Garamond & Be Vietnam Pro.'
            )}
          </div>
          <div className="flex items-center gap-6">
            <span>{t('Ấn bản Số 04', 'Archive No. 04')}</span>
            <span>·</span>
            <span>{t('In ấn & Xuất bản tại Việt Nam', 'Printed & Published in Vietnam')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
