'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Music, MapPin, Calendar } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface InvitationDesign {
  id: string
  nameVi: string
  nameEn: string
  subtitleVi: string
  subtitleEn: string
  categoryVi: string
  categoryEn: string
  previewUrl: string
  descriptionVi: string
  descriptionEn: string
  swatches: [string, string]
  accent: string
  coverImage: string
  coupleVi: string
  coupleEn: string
  dateVi: string
  dateEn: string
  venueVi: string
  venueEn: string
  musicNoteVi: string
  musicNoteEn: string
}

const INVITATION_DESIGNS: InvitationDesign[] = [
  {
    id: 'romantic',
    nameVi: 'Lãng mạn',
    nameEn: 'Romantic',
    subtitleVi: 'Chữ Serif Nghệ thuật & Ánh sáng Tràn viền',
    subtitleEn: 'Editorial Serif & Full Bleed Light',
    categoryVi: 'Nhiếp ảnh Mỹ thuật',
    categoryEn: 'Editorial Fine Art',
    previewUrl: '/preview/romantic',
    descriptionVi: 'Bố cục phong cách tạp chí nghệ thuật châu Âu, typography thanh tao, tương thích hoàn hảo với ảnh cưới khổ lớn.',
    descriptionEn: 'European art journal layout, refined typography, seamlessly paired with large-scale fine art wedding photography.',
    swatches: ['#F7F3EE', '#302B27'],
    accent: '#9B8878',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    coupleVi: 'Minh Tuấn & Phương Anh',
    coupleEn: 'Minh Tuan & Phuong Anh',
    dateVi: 'Thứ Bảy, 18.11.2025',
    dateEn: 'Saturday, Nov 18, 2025',
    venueVi: 'The Deck Saigon · 18:00',
    venueEn: 'The Deck Saigon · 18:00',
    musicNoteVi: 'Clair de Lune — Claude Debussy',
    musicNoteEn: 'Clair de Lune — Claude Debussy',
  },
  {
    id: 'modern',
    nameVi: 'Thanh xuân',
    nameEn: 'Youthful Modern',
    subtitleVi: 'Hiện đại Lệch tâm & Điểm xuyết Ánh cam Wispic',
    subtitleEn: 'Asymmetric Modern & Tangerine Accents',
    categoryVi: 'Tối giản Đương đại',
    categoryEn: 'Contemporary Minimal',
    previewUrl: '/preview/modern',
    descriptionVi: 'Bố cục lệch tinh gọn, tương phản sắc nét giữa màu giấy ấm và màu than đá, điểm xuyết ánh cam đất Wispic.',
    descriptionEn: 'Clean asymmetric layout with crisp contrast between warm paper and charcoal, punctuated by Wispic terracotta accents.',
    swatches: ['#FBFAF7', '#1F1D1B'],
    accent: '#D97832',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
    coupleVi: 'Hoàng Long & Thu Thảo',
    coupleEn: 'Hoang Long & Thu Thao',
    dateVi: 'Chủ Nhật, 26.10.2025',
    dateEn: 'Sunday, Oct 26, 2025',
    venueVi: 'Villa Song Saigon · 17:30',
    venueEn: 'Villa Song Saigon · 17:30',
    musicNoteVi: 'Until I Found You — Stephen Sanchez',
    musicNoteEn: 'Until I Found You — Stephen Sanchez',
  },
  {
    id: 'traditional',
    nameVi: 'Song Hỷ',
    nameEn: 'Song Hy Heritage',
    subtitleVi: 'Di sản Tái hiện & Sắc Đỏ Son Sơn mài',
    subtitleEn: 'Reimagined Heritage & Red Lacquer',
    categoryVi: 'Di sản Việt Nam',
    categoryEn: 'Vietnamese Heritage',
    previewUrl: '/preview/traditional',
    descriptionVi: 'Sắc đỏ son trầm và nhũ vàng cổ điển, giữ trọn sự trang trọng kính mời song thân nhưng với hơi thở thiết kế đương đại.',
    descriptionEn: 'Deep lacquer cinnabar and subtle metallic gold, preserving traditional ceremonial reverence with a contemporary design ethos.',
    swatches: ['#7D1F1F', '#E8C15A'],
    accent: '#C9A227',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
    coupleVi: 'Đức Huy & Thùy Dung',
    coupleEn: 'Duc Huy & Thuy Dung',
    dateVi: 'Thứ Bảy, 12.12.2025',
    dateEn: 'Saturday, Dec 12, 2025',
    venueVi: 'Hội quán Cổ kính · 11:00',
    venueEn: 'Heritage Pavilion · 11:00',
    musicNoteVi: 'Áo Lụa Hà Đông — Hòa tấu thính phòng',
    musicNoteEn: 'Chamber String Quartet — Vietnamese Folk Melody',
  },
  {
    id: 'thanh-van',
    nameVi: 'Thanh Vân',
    nameEn: 'Thanh Van Monograph',
    subtitleVi: 'Khoảng lặng Kiến trúc & Không gian Thuần khiết',
    subtitleEn: 'Architectural Monograph & Pure Space',
    categoryVi: 'Kiến trúc Tối giản',
    categoryEn: 'Architectural Minimal',
    previewUrl: '/preview/romantic',
    descriptionVi: 'Khoảng trắng phóng khoáng, đường nét kỷ hà nhẹ nhàng, tôn vinh ảnh chân dung mang tính biểu tượng.',
    descriptionEn: 'Expansive negative space and delicate hairline rules, honoring iconic couple portraits with silent dignity.',
    swatches: ['#F4EFE6', '#292522'],
    accent: '#6F7558',
    coverImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85',
    coupleVi: 'Thái An & Minh Nguyệt',
    coupleEn: 'Thai An & Minh Nguyet',
    dateVi: 'Thứ Sáu, 05.12.2025',
    dateEn: 'Friday, Dec 05, 2025',
    venueVi: 'Ana Mandara Villas Da Lat · 16:30',
    venueEn: 'Ana Mandara Villas Da Lat · 16:30',
    musicNoteVi: 'Experience — Ludovico Einaudi',
    musicNoteEn: 'Experience — Ludovico Einaudi',
  },
]

export function WeddingCollection() {
  const { language, t } = useLanguage()
  const [selectedId, setSelectedId] = useState<string>('romantic')
  const current = INVITATION_DESIGNS.find((d) => d.id === selectedId) || INVITATION_DESIGNS[0]

  return (
    <section id="wedding" className="py-24 lg:py-36 border-t border-sand/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-sand/60">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-terracotta">
              {t('THIỆP CƯỚI TRỰC TUYẾN', 'DIGITAL INVITATIONS')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
              {t('Bộ Sưu Tập Thiệp Cưới Tinh Tế', 'Thoughtful Digital Invitations')}
            </h2>
            <p className="text-sm sm:text-base font-light text-earth/80 leading-relaxed max-w-xl">
              {t(
                'Mỗi chiếc thiệp cưới online là một website độc bản dành riêng cho hai bạn. Tích hợp nhạc nền cảm xúc, xác nhận tham dự (RSVP) tiện lợi, bản đồ chỉ đường Google Maps và câu chuyện tình yêu ngọt ngào.',
                'Each online invitation is a bespoke wedding website designed exclusively for you. Featuring ambient audio, smart RSVP tracking, one-tap Google Maps navigation, and your romantic story.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/invitations"
              className="text-xs font-medium uppercase tracking-wider text-charcoal hover:text-terracotta transition-colors border border-sand bg-white/70 px-4 py-2"
            >
              {t('Xem trang thiệp cưới →', 'View Invitations Page →')}
            </Link>
          </div>
        </div>

        {/* Design Selector Tabs */}
        <div className="pt-10 flex flex-wrap items-center gap-4 border-b border-sand/40 pb-6">
          <span className="text-xs font-light uppercase tracking-[0.2em] text-earth/60 mr-2">
            {t('Các mẫu thiết kế:', 'Designs:')}
          </span>
          {INVITATION_DESIGNS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedId(d.id)}
              className={`transition-all px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                selectedId === d.id
                  ? 'bg-charcoal text-[#F7F2E9] font-medium'
                  : 'bg-white/50 border border-sand/70 text-charcoal hover:border-charcoal/40'
              }`}
            >
              {language === 'vi' ? d.nameVi : d.nameEn}
            </button>
          ))}
        </div>

        {/* Live Invitation Showcase Grid */}
        <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Interactive Mobile / Paper Artifact Preview (6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Paper shadow & texture offset */}
              <div
                aria-hidden
                className="absolute -inset-3 border border-sand/80 bg-white/40 shadow-xl hidden sm:block"
              />

              {/* The Invitation Card Preview */}
              <div className="relative overflow-hidden border border-sand bg-[#FAF7F2] p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(41,37,34,0.3)] space-y-6">
                {/* Header Monogram */}
                <div className="text-center space-y-1 border-b border-sand/50 pb-4">
                  <p className="text-[10px] font-light uppercase tracking-[0.3em] text-earth">
                    {t('Kính Mời Đến Dự Lễ Cưới', 'Save Our Date')}
                  </p>
                  <p className="font-serif text-2xl sm:text-3xl font-normal text-charcoal">
                    {language === 'vi' ? current.coupleVi : current.coupleEn}
                  </p>
                  <p className="text-[11px] font-light text-terracotta tracking-wider">
                    {language === 'vi' ? current.dateVi : current.dateEn}
                  </p>
                </div>

                {/* Cover Photograph Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand/30">
                  <Image
                    src={current.coverImage}
                    alt={language === 'vi' ? current.nameVi : current.nameEn}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-[10px] tracking-widest uppercase font-light">
                    Wispic Invitation Series
                  </div>
                </div>

                {/* Key Invitation Modules */}
                <div className="space-y-3 text-xs font-light text-charcoal/80 pt-1">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-3.5 w-3.5 text-terracotta shrink-0" />
                    <span>{t('Lễ Thành Hôn · ', 'Ceremony · ')}{language === 'vi' ? current.dateVi : current.dateEn}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-3.5 w-3.5 text-terracotta shrink-0" />
                    <span>{language === 'vi' ? current.venueVi : current.venueEn}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-earth">
                    <Music className="h-3.5 w-3.5 text-terracotta shrink-0" />
                    <span className="italic">{language === 'vi' ? current.musicNoteVi : current.musicNoteEn}</span>
                  </div>
                </div>

                {/* Simulated RSVP Bar */}
                <div className="pt-2 border-t border-sand/50 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-earth/70">
                    {t('Xác nhận tham dự', 'Guest Attendance')}
                  </span>
                  <span className="bg-charcoal text-[#F7F2E9] px-3 py-1.5 text-[10px] uppercase tracking-widest font-medium">
                    {t('RSVP · Phản hồi', 'RSVP · Confirm')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Design Details & Storytelling (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-light uppercase tracking-[0.25em] text-terracotta">
                {language === 'vi' ? current.categoryVi : current.categoryEn}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
                {language === 'vi' ? current.nameVi : current.nameEn}
              </h3>
              <p className="font-serif text-lg italic text-earth">
                {language === 'vi' ? current.subtitleVi : current.subtitleEn}
              </p>
            </div>

            <p className="text-sm sm:text-base font-light leading-relaxed text-earth/90 max-w-lg">
              {language === 'vi' ? current.descriptionVi : current.descriptionEn}
            </p>

            {/* Design Specifications list */}
            <div className="pt-2 space-y-3 text-xs font-light text-earth/90">
              <div className="flex items-center gap-3">
                <span className="font-medium text-charcoal uppercase tracking-wider text-[11px] w-24">
                  {t('Bảng màu:', 'Palette:')}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border border-sand"
                    style={{ backgroundColor: current.swatches[0] }}
                    title={t('Nền chủ đạo', 'Primary background')}
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-sand"
                    style={{ backgroundColor: current.swatches[1] }}
                    title={t('Màu chữ chính', 'Text color')}
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-sand"
                    style={{ backgroundColor: current.accent }}
                    title={t('Màu điểm xuyết', 'Accent')}
                  />
                  <span className="text-[11px] text-earth/60 ml-2">
                    Warm Paper &amp; Mineral Tones
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-medium text-charcoal uppercase tracking-wider text-[11px] w-24 shrink-0 pt-0.5">
                  {t('Tính năng:', 'Features:')}
                </span>
                <span>
                  {t(
                    'Phát nhạc tự động · RSVP khách mời · Google Maps dẫn đường · Hộp chúc phúc & mã QR mừng cưới',
                    'Autoplay ambient audio · Guest RSVP · Google Maps routing · Well-wishes guestbook & Gift QR'
                  )}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-medium text-charcoal uppercase tracking-wider text-[11px] w-24 shrink-0 pt-0.5">
                  {t('Xuất bản:', 'Publishing:')}
                </span>
                <span>
                  {t(
                    'Đường link riêng tư kèm ảnh đại diện tối ưu cho Zalo, Facebook, iMessage',
                    'Private URL with rich OpenGraph preview cards for Zalo, Facebook, and iMessage'
                  )}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={`/dashboard/create?template=${current.id}`}
                className="group inline-flex items-center justify-center gap-2.5 bg-charcoal text-[#F7F2E9] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] transition-all hover:bg-terracotta"
              >
                <span>{t('Tạo thiệp với mẫu này', 'Create with this Design')}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href={current.previewUrl}
                target="_blank"
                className="group inline-flex items-center justify-center gap-2 border border-sand/80 bg-white/50 px-6 py-3.5 text-xs font-light uppercase tracking-[0.18em] text-charcoal hover:border-charcoal hover:bg-white transition-all"
              >
                <span>{t('Xem Demo Toàn Màn Hình', 'View Full Screen Demo')}</span>
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
