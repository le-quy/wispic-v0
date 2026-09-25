'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { InquiryDialog } from '@/components/inquiry-dialog'
import { useLanguage } from '@/lib/language-context'

interface ServiceItem {
  id: string
  number: string
  titleVi: string
  titleEn: string
  subtitleVi: string
  subtitleEn: string
  descriptionVi: string
  descriptionEn: string
  deliverablesVi: string[]
  deliverablesEn: string[]
  image: string
  inquiryKey: string
  ctaTextVi: string
  ctaTextEn: string
  ctaHref?: string
}

const SERVICES: ServiceItem[] = [
  {
    id: 'photography',
    number: '01',
    titleVi: 'Nhiếp ảnh',
    titleEn: 'Photography',
    subtitleVi: 'Lễ cưới, Chân dung nghệ thuật & Các dự án Du hành',
    subtitleEn: 'Weddings, Portraiture & Travel Commissions',
    descriptionVi: 'Ghi lại những câu chuyện tình yêu và sự hiện diện của con người khắp Việt Nam và quốc tế. Sử dụng phim 35mm và máy kỹ thuật số khổ medium format với ánh sáng tự nhiên, không gượng gạo.',
    descriptionEn: 'Documenting love stories and human presence across Vietnam and international destinations. Shot on 35mm film and digital medium format with natural, unforced light.',
    deliverablesVi: [
      'Ghi hình trọn vẹn cả ngày hoặc lễ cưới thân mật',
      'Sách ảnh nghệ thuật lưu trữ đóng bìa thủ công',
      'Kho lưu trữ file số độ phân giải cao',
      'Bản phim âm bản và bảng ảnh duyệt contact sheet',
    ],
    deliverablesEn: [
      'Full-day or intimate ceremony coverage',
      'Curated archival print monograph',
      'High-resolution digital archive',
      'Analog film proofs and contact sheets',
    ],
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
    inquiryKey: 'Photography',
    ctaTextVi: 'Đặt lịch Chụp ảnh',
    ctaTextEn: 'Commission Photography',
  },
  {
    id: 'wedding',
    number: '02',
    titleVi: 'Thiệp cưới',
    titleEn: 'Wedding',
    subtitleVi: 'Thiết kế Thiệp cưới Online & Kỷ vật cho Khách mời',
    subtitleEn: 'Digital Invitation Design & Guest Keepsakes',
    descriptionVi: 'Bộ thiệp cưới số cá nhân hóa được xây dựng với nghệ thuật chữ chuẩn mực, tính năng xác nhận tham dự tương tác, bản nhạc nền riêng và câu chuyện ảnh sống động dành tặng khách mời.',
    descriptionEn: 'Bespoke online wedding stationery built with editorial typography, interactive RSVP, personal audio tracks, and custom photo narratives for your guests.',
    deliverablesVi: [
      'Tên miền riêng hoặc đường link thiệp cưới bảo mật',
      'Trang thiệp tương tác tối ưu tuyệt đối trên điện thoại',
      'Hệ thống xác nhận tham dự (RSVP) & khẩu phần ăn chi tiết',
      'Trình phát nhạc nền & bản đồ chỉ đường thông minh',
    ],
    deliverablesEn: [
      'Custom subdomain or private wedding link',
      'Mobile-optimized interactive story card',
      'Guest RSVP & dietary confirmation suite',
      'Music player & venue navigation integration',
    ],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    inquiryKey: 'Wedding',
    ctaTextVi: 'Tạo thiệp Cưới của Bạn',
    ctaTextEn: 'Create Your Invitation',
    ctaHref: '/dashboard/create',
  },
  {
    id: 'creative',
    number: '03',
    titleVi: 'Sáng tạo',
    titleEn: 'Creative',
    subtitleVi: 'Chỉ đạo Nghệ thuật, Xuất bản & Không gian Thị giác',
    subtitleEn: 'Art Direction, Publishing & Spatial Visuals',
    descriptionVi: 'Hợp tác cùng các khách sạn boutique, kiến trúc sư và thương hiệu độc lập để phát triển bộ nhận diện thị giác, ấn phẩm in ấn và các chiến dịch nhiếp ảnh giàu chiều sâu cảm xúc.',
    descriptionEn: 'Collaborating with boutique hotels, architects, and independent brands to develop visual identities, print publications, and evocative photo campaigns.',
    deliverablesVi: [
      'Định hướng sáng tạo & phát triển ý niệm thị giác',
      'Bộ ảnh Lookbook thời trang & sách ấn phẩm nghệ thuật',
      'Ghi hình không gian kiến trúc & nội thất đương đại',
      'Kể chuyện thương hiệu & ấn phẩm số chuyên đề',
    ],
    deliverablesEn: [
      'Creative direction & concept curation',
      'Editorial lookbooks and printed books',
      'Architectural and interior space capture',
      'Brand storytelling and digital monographs',
    ],
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
    inquiryKey: 'Creative',
    ctaTextVi: 'Bắt đầu Dự án',
    ctaTextEn: 'Initiate Project',
  },
]

export function EditorialServices() {
  const { language, t } = useLanguage()
  const [activeServiceId, setActiveServiceId] = useState<string>('photography')
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquiryService, setInquiryService] = useState('Photography')

  const activeService = SERVICES.find((s) => s.id === activeServiceId) || SERVICES[0]

  const handleOpenInquiry = (serviceName: string) => {
    setInquiryService(serviceName)
    setInquiryOpen(true)
  }

  return (
    <>
      <section id="services" className="py-24 lg:py-36 border-t border-sand/70 bg-[#F4EFE6]/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-sand/60">
            <div className="max-w-2xl space-y-3">
              <p className="text-[11px] font-light uppercase tracking-[0.28em] text-terracotta">
                {t('06 / DỊCH VỤ STUDIO', '06 / STUDIO SERVICES')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
                {t('Ba Dịch vụ Trọng tâm', 'Simple, Focused Offerings')}
              </h2>
              <p className="text-sm sm:text-base font-light text-earth/80 leading-relaxed">
                {t(
                  'Ba mảng thực hành chuyên sâu của studio được kết nối bởi sự tôn trọng tính chân thực của nhiếp ảnh và sự tiết chế trong đồ họa.',
                  'Three dedicated studio practices unified by a shared commitment to photographic authenticity and graphic restraint.'
                )}
              </p>
            </div>

            <div className="text-[11px] font-light uppercase tracking-[0.2em] text-earth/70">
              Đà Nẵng · Sài Gòn · Hà Nội
            </div>
          </div>

          {/* Large Typography & Image-Based Navigation Grid */}
          <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Large Typography Service List (6 cols) */}
            <div className="lg:col-span-6 space-y-2">
              {SERVICES.map((s) => {
                const isActive = s.id === activeServiceId
                return (
                  <div
                    key={s.id}
                    onMouseEnter={() => setActiveServiceId(s.id)}
                    onClick={() => setActiveServiceId(s.id)}
                    className={`group cursor-pointer border-b transition-all py-6 sm:py-8 ${
                      isActive ? 'border-charcoal' : 'border-sand/70 hover:border-charcoal/40'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span className="font-serif text-xs sm:text-sm text-terracotta italic">
                          {s.number}
                        </span>
                        <h3
                          className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-normal transition-colors ${
                            isActive
                              ? 'text-charcoal'
                              : 'text-charcoal/50 group-hover:text-charcoal'
                          }`}
                        >
                          {language === 'vi' ? s.titleVi : s.titleEn}
                        </h3>
                      </div>
                      <ArrowUpRight
                        className={`h-5 w-5 transition-transform ${
                          isActive
                            ? 'text-terracotta translate-x-1 -translate-y-1'
                            : 'text-earth/40 group-hover:text-charcoal'
                        }`}
                      />
                    </div>

                    {/* Subtitle preview */}
                    <p className="mt-2 text-xs font-light tracking-wide text-earth/80 pl-8 sm:pl-10">
                      {language === 'vi' ? s.subtitleVi : s.subtitleEn}
                    </p>

                    {/* Mobile expanded details */}
                    {isActive && (
                      <div className="mt-4 pt-3 space-y-3 lg:hidden pl-8">
                        <p className="text-xs font-light text-charcoal/90 leading-relaxed">
                          {language === 'vi' ? s.descriptionVi : s.descriptionEn}
                        </p>
                        <div className="pt-2">
                          {s.ctaHref ? (
                            <Link
                              href={s.ctaHref}
                              className="inline-flex items-center gap-2 bg-charcoal text-[#F7F2E9] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em]"
                            >
                              <span>{language === 'vi' ? s.ctaTextVi : s.ctaTextEn}</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenInquiry(s.inquiryKey)
                              }}
                              className="inline-flex items-center gap-2 bg-charcoal text-[#F7F2E9] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em]"
                            >
                              <span>{language === 'vi' ? s.ctaTextVi : s.ctaTextEn}</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Right: Evocative Image Display & Details (6 cols, desktop) */}
            <div className="hidden lg:block lg:col-span-6">
              <div className="relative overflow-hidden bg-sand/30 shadow-[0_20px_50px_-20px_rgba(41,37,34,0.2)] border border-sand">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    key={activeService.id}
                    src={activeService.image}
                    alt={language === 'vi' ? activeService.titleVi : activeService.titleEn}
                    fill
                    className="object-cover transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-5 left-5 right-5 text-white flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-sand/90">
                        {t('Thực hành ', 'Practice ')}{activeService.number}
                      </span>
                      <h4 className="font-serif text-2xl font-normal">
                        {language === 'vi' ? activeService.titleVi : activeService.titleEn}
                      </h4>
                    </div>
                    <span className="text-xs font-light text-white/80">
                      Wispic Studio
                    </span>
                  </div>
                </div>

                <div className="p-8 bg-[#FAF7F2] space-y-6">
                  <p className="text-sm font-light text-charcoal/90 leading-relaxed">
                    {language === 'vi' ? activeService.descriptionVi : activeService.descriptionEn}
                  </p>

                  <div className="space-y-2 border-t border-sand/60 pt-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-earth">
                      {t('Hạng mục Bàn giao', 'Scope of Work')}
                    </p>
                    <ul className="grid grid-cols-2 gap-2 text-xs font-light text-earth/90">
                      {(language === 'vi' ? activeService.deliverablesVi : activeService.deliverablesEn).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-terracotta">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    {activeService.ctaHref ? (
                      <Link
                        href={activeService.ctaHref}
                        className="inline-flex items-center gap-2 bg-charcoal text-[#F7F2E9] px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-all hover:bg-terracotta"
                      >
                        <span>{language === 'vi' ? activeService.ctaTextVi : activeService.ctaTextEn}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenInquiry(activeService.inquiryKey)}
                        className="inline-flex items-center gap-2 bg-charcoal text-[#F7F2E9] px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-all hover:bg-terracotta"
                      >
                        <span>{language === 'vi' ? activeService.ctaTextVi : activeService.ctaTextEn}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InquiryDialog
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        initialService={inquiryService}
      />
    </>
  )
}
