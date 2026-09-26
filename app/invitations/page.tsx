'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  Music,
  MapPin,
  Calendar,
  CheckCircle,
  QrCode,
  Smartphone,
  ArrowUpRight,
  Eye,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useLanguage } from '@/lib/language-context'

export default function InvitationsLandingPage() {
  const { language, t } = useLanguage()

  const templates = [
    {
      id: 'romantic',
      nameVi: 'Lãng Mạn',
      nameEn: 'Romantic Edition',
      taglineVi: 'Ảnh Khổ Lớn & Typography Châu Âu',
      taglineEn: 'Editorial Full Bleed & Serif Type',
      descriptionVi: 'Bố cục tôn vinh những bức ảnh cưới ngập tràn ánh sáng tự nhiên. Thanh lịch, chậm rãi và ngập tràn chất thơ.',
      descriptionEn: 'Full-bleed imagery paired with timeless serif typography for romantic, natural light photography.',
      cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
      demoUrl: '/preview/romantic',
      badgeVi: 'Được yêu thích nhất',
      badgeEn: 'Bestseller',
    },
    {
      id: 'modern',
      nameVi: 'Thanh Xuân',
      nameEn: 'Youthful Modern',
      taglineVi: 'Tươi Trẻ, Tối Giản & Gần Gũi',
      taglineEn: 'Minimal, Fresh & Intimate',
      descriptionVi: 'Phong cách tối giản hiện đại của Hàn Quốc, màu sắc pastel ấm áp, phù hợp với các đám cưới trẻ trung và thân mật.',
      descriptionEn: 'Korean-inspired minimal layout with soft warm pastel tones, tailored for youthful intimate gatherings.',
      cover: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=85',
      demoUrl: '/preview/modern',
    },
    {
      id: 'traditional',
      nameVi: 'Song Hỷ Di Sản',
      nameEn: 'Song Hy Heritage',
      taglineVi: 'Sắc Đỏ Trầm & Hoài Niệm Cổ Điển',
      taglineEn: 'Cinnabar Lacquer & Cultural Warmth',
      descriptionVi: 'Sự giao thoa giữa nét truyền thống Việt Nam và tư duy thiết kế đương đại. Trang trọng gửi đến họ hàng và song thân.',
      descriptionEn: 'A reverent bridge between Vietnamese cultural heritage and modern typographic dignity.',
      cover: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
      demoUrl: '/preview/traditional',
    },
  ]

  const features = [
    {
      icon: CheckCircle,
      titleVi: 'Hệ Thống RSVP Thông Minh',
      titleEn: 'Smart RSVP Tracking',
      descVi: 'Khách mời xác nhận tham dự, báo số lượng người đi cùng và chọn khẩu phần ăn trực tiếp trên thiệp.',
      descEn: 'Guests RSVP with party count and dietary preferences with real-time tracking.',
    },
    {
      icon: Music,
      titleVi: 'Trình Phát Nhạc Tâm Tình',
      titleEn: 'Ambient Soundtrack',
      descVi: 'Tự động phát bài hát kỷ niệm của hai bạn khi khách mở thiệp, tạo bầu không khí xúc động.',
      descEn: 'Plays your personal love song automatically upon opening to set an emotional mood.',
    },
    {
      icon: MapPin,
      titleVi: 'Bản Đồ Chỉ Đường 1 Chạm',
      titleEn: 'One-Tap Venue Navigation',
      descVi: 'Tích hợp Google Maps trực quan, khách chỉ cần bấm một nút để mở đường đi ngay trên điện thoại.',
      descEn: 'Instant Google Maps link opens navigation directly on any guest smartphone.',
    },
    {
      icon: QrCode,
      titleVi: 'Mã QR In Ấn Sắc Nét',
      titleEn: 'Print-Ready QR Codes',
      descVi: 'Tự động tạo mã QR chất lượng cao để in lên phong bao thư hoặc thiệp giấy truyền thống.',
      descEn: 'High-res vector QR codes ready for traditional paper envelopes and print stationery.',
    },
    {
      icon: Smartphone,
      titleVi: 'Tối Ưu Hoàn Hảo Di Động',
      titleEn: 'Flawless Mobile Experience',
      descVi: 'Tương thích mượt mà trên iPhone và Android, tốc độ tải dưới 1 giây mà không giật lag.',
      descEn: 'Lightning-fast sub-second loading on any iPhone or Android screen.',
    },
    {
      icon: Calendar,
      titleVi: 'Lưu Lịch Cưới & Đếm Ngược',
      titleEn: 'Calendar Sync & Countdown',
      descVi: 'Khách mời có thể thêm ngày cưới vào Apple Calendar / Google Calendar chỉ với 1 chạm.',
      descEn: 'Allows guests to add wedding date directly to their Google or Apple calendar.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#FBF8F2] text-[#292522] selection:bg-terracotta/20 selection:text-charcoal font-sans antialiased">
      <SiteHeader />

      {/* Hero Banner */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 border-b border-sand/70 bg-[#F7F2E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
            <Sparkles className="h-4 w-4" />
            <span>{t('THIỆP CƯỚI ONLINE CAO CẤP', 'PREMIUM DIGITAL WEDDING INVITATIONS')}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-charcoal tracking-tight">
            {t('Thiệp Cưới Tinh Tế & Thông Minh', 'The Wedding Invitation as an Art Object')}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base font-light text-earth/90 leading-relaxed">
            {t(
              'Không chỉ là một tấm thiệp thông báo, đây là một trang web kỷ vật độc bản ghi dấu ngày hạnh phúc của hai bạn. Dễ dàng gửi tới bạn bè qua Messenger, Zalo và lưu giữ mãi mãi.',
              'More than an invitation, this is a bespoke digital keepsake honoring your celebration. Easily shared via messaging apps and preserved forever.'
            )}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/create"
              className="bg-charcoal text-[#F7F2E9] px-7 py-3 text-xs font-medium uppercase tracking-[0.16em] hover:bg-terracotta transition-colors flex items-center gap-2"
            >
              <span>{t('Tự Khởi Tạo Thiệp Ngay', 'Create Your Invitation')}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <a
              href="#templates"
              className="border border-sand bg-white/70 px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-charcoal hover:bg-white transition-colors"
            >
              {t('Xem Mẫu Thiệp Mẫu', 'Browse Templates')}
            </a>
          </div>
        </div>
      </section>

      {/* Templates Showcase Grid */}
      <section id="templates" className="py-20 lg:py-28 border-b border-sand/70">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
              {t('BỘ SƯU TẬP GIAO DIỆN', 'TEMPLATE COLLECTION')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
              {t('Chọn Phong Cách Phù Hợp Cho Hai Bạn', 'Find the Tone of Your Story')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white border border-sand/70 p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand/20">
                    <Image
                      src={tpl.cover}
                      alt={language === 'vi' ? tpl.nameVi : tpl.nameEn}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {tpl.badgeVi && (
                      <div className="absolute top-3 left-3 bg-terracotta text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5">
                        {language === 'vi' ? tpl.badgeVi : tpl.badgeEn}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-terracotta">
                      {language === 'vi' ? tpl.taglineVi : tpl.taglineEn}
                    </p>
                    <h3 className="font-serif text-2xl font-medium text-charcoal">
                      {language === 'vi' ? tpl.nameVi : tpl.nameEn}
                    </h3>
                    <p className="text-xs font-light text-earth/80 pt-1 leading-relaxed">
                      {language === 'vi' ? tpl.descriptionVi : tpl.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-sand/60 flex items-center justify-between gap-3">
                  <Link
                    href={tpl.demoUrl}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-charcoal font-medium hover:text-terracotta transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{t('Xem Mẫu Thật', 'Live Demo')}</span>
                  </Link>

                  <Link
                    href={`/dashboard/create?template=${tpl.id}`}
                    className="bg-charcoal text-[#F7F2E9] px-4 py-2 text-xs uppercase tracking-wider font-medium hover:bg-terracotta transition-colors"
                  >
                    {t('Sử Dụng Mẫu', 'Use Template')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28 bg-[#F5F0E8] border-b border-sand/70">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
              {t('TÍNH NĂNG TƯƠNG TÁC', 'SMART FEATURES')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
              {t('Đầy Đủ Tiện Ích Hiện Đại', 'Thoughtfully Crafted for You & Your Guests')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div key={idx} className="bg-white border border-sand/70 p-6 sm:p-8 space-y-3 shadow-sm">
                  <div className="h-10 w-10 rounded-full bg-sand/30 flex items-center justify-center text-terracotta">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-charcoal">
                    {language === 'vi' ? feat.titleVi : feat.titleEn}
                  </h3>
                  <p className="text-xs font-light text-earth/85 leading-relaxed">
                    {language === 'vi' ? feat.descVi : feat.descEn}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 lg:py-20 text-center">
        <div className="mx-auto max-w-3xl px-6 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
            {t('Tạo chiếc thiệp cưới mang dấu ấn riêng của hai bạn', 'Create your bespoke wedding invitation')}
          </h2>
          <p className="text-xs sm:text-sm font-light text-earth/85 max-w-md mx-auto">
            {t(
              'Chỉ mất 5 phút để nhập thông tin, chọn bản nhạc yêu thích và xem trước trực tiếp trên điện thoại.',
              'Takes only 5 minutes to enter your details, pick a favorite track, and preview on mobile.'
            )}
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 bg-charcoal text-[#F7F2E9] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] hover:bg-terracotta transition-colors"
            >
              <span>{t('Bắt Đầu Tạo Thiệp Miễn Phí', 'Start Creating For Free')}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
