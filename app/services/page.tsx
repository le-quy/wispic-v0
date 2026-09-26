'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  Check,
  ShieldCheck,
  Clock,
  HeartHandshake,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { STUDIO_SERVICES } from '@/lib/studio-data'
import { InquiryDialog } from '@/components/inquiry-dialog'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

export default function ServicesPage() {
  const { language, t } = useLanguage()
  const [inquiryOpen, setInquiryOpen] = useState(false)

  const workflowSteps = [
    {
      number: '01',
      titleVi: 'Lắng Nghe & Lên Ý Tưởng Concept',
      titleEn: 'Listen & Curate Concept',
      descVi: 'Gặp gỡ trực tiếp hoặc qua video call. Wispic cùng hai bạn chọn địa điểm, thời gian đón ánh sáng đẹp nhất, cũng như tư vấn trang phục phù hợp với vóc dáng và tính cách.',
      descEn: 'Meet in person or over video call. We select scenic locations, optimal lighting hours, and tailor outfits matching your personalities.',
    },
    {
      number: '02',
      titleVi: 'Buổi Chụp Thong Thả Như Hẹn Hò',
      titleEn: 'Relaxed Shoot Like a Weekend Date',
      descVi: 'Không tạo dáng căng thẳng, không đếm 1-2-3 cười. Nhiếp ảnh gia Wispic tạo không khí thoải mái nhất để hai bạn tự nhiên trò chuyện, đi dạo và trao nhau những cử chỉ chân thật.',
      descEn: 'No awkward poses or artificial countdowns. We foster a comfortable space where you stroll, laugh, and share genuine tenderness.',
    },
    {
      number: '03',
      titleVi: 'Hậu Kỳ Tinh Tế & Tone Màu Độc Quyền',
      titleEn: 'Artisanal Color Grading & Retouch',
      descVi: 'Mỗi khung hình được blend màu thủ công với tone ấm áp, trong trẻo đặc trưng của Wispic. Giữ trọn làn da tự nhiên và chiều sâu ánh sáng.',
      descEn: 'Each frame is hand-graded in our signature warm, luminous palette. Preserving natural skin glow and tonal depth.',
    },
    {
      number: '04',
      titleVi: 'Bàn Giao Album & Kỷ Vật Trọn Đời',
      titleEn: 'Delivering Keepsakes & High-Res Gallery',
      descVi: 'Nhận toàn bộ file gốc trong 24h. Album photobook bìa vải linen cao cấp hoặc khung ảnh pha lê được đóng gói cẩn trọng và gửi tận tay hai bạn.',
      descEn: 'Full raw gallery delivered in 24 hours. Luxury linen photobooks and fine art prints hand-packaged and delivered to your doorstep.',
    },
  ]

  const faqs = [
    {
      qVi: 'Wispic có đi chụp ở các tỉnh thành khác hoặc nước ngoài không?',
      qEn: 'Does Wispic travel for destination weddings across Vietnam & abroad?',
      aVi: 'Có! Ekip Wispic thường xuyên chụp tại Hội An, Đà Lạt, Phú Quốc, Ninh Bình, Hà Giang, cũng như các điểm đến quốc tế. Chi phí di chuyển và lưu trú sẽ được tính toán tối ưu và minh bạch nhất cho hai bạn.',
      aEn: 'Yes! Our team regularly shoots in Hoi An, Da Lat, Phu Quoc, Ninh Binh, and international destinations. Travel logistics are optimized and fully transparent.',
    },
    {
      qVi: 'Nếu chúng mình không biết tạo dáng trước ống kính thì sao?',
      qEn: 'What if we feel awkward in front of the camera?',
      aVi: 'Đó chính là lý do các cặp đôi tìm đến Wispic! Bạn không cần phải là người mẫu hay biết cách diễn. Nhiếp ảnh gia sẽ gợi mở những câu chuyện, trò đùa và hoạt động để bạn hoàn toàn quên đi sự hiện diện của máy ảnh.',
      aEn: 'That is precisely why couples choose Wispic! You don’t need to pose or act. We guide spontaneous interactions so you forget the camera is even there.',
    },
    {
      qVi: 'Thời gian đặt lịch trước bao lâu là tốt nhất?',
      qEn: 'How far in advance should we book?',
      aVi: 'Vào mùa cao điểm cưới (từ tháng 9 đến tháng 3 năm sau), các ngày cuối tuần thường kín lịch sớm. Hai bạn nên liên hệ trước từ 2 đến 4 tháng để Wispic chuẩn bị chu đáo nhất.',
      aEn: 'During peak wedding season (September to March), weekends fill up quickly. We recommend contacting us 2 to 4 months in advance.',
    },
    {
      qVi: 'Bao lâu sau buổi chụp chúng mình nhận được ảnh?',
      qEn: 'When will we receive the finished photos?',
      aVi: 'Toàn bộ file ảnh gốc sẽ được gửi qua link lưu trữ trực tuyến trong vòng 24 đến 48 giờ. Ảnh retouch hoàn thiện và album photobook in ấn sẽ được bàn giao trong 2 đến 3 tuần.',
      aEn: 'All raw digital files are delivered via private cloud gallery within 24–48 hours. Master retouched photos and printed photobooks are completed in 2–3 weeks.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#FBF8F2] text-[#292522] selection:bg-terracotta/20 selection:text-charcoal font-sans antialiased">
      <SiteHeader />

      {/* Hero Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 border-b border-sand/70 bg-[#F7F2E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
            <Sparkles className="h-4 w-4" />
            <span>{t('DỊCH VỤ & BÁO GIÁ', 'SERVICES & PACKAGES')}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-charcoal tracking-tight">
            {t('Gói Chụp Ảnh Cưới Trọn Gói', 'Wedding Photography & Cinema')}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base font-light text-earth/90 leading-relaxed">
            {t(
              'Trọn vẹn, minh bạch và không phát sinh chi phí. Chúng mình cam kết mang lại trải nghiệm chụp ảnh thoải mái nhất cùng những sản phẩm lưu giữ giá trị vượt thời gian.',
              'Comprehensive, transparent, with zero hidden surprises. We promise a relaxed experience and timeless visual keepsakes.'
            )}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-earth/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-terracotta" />
              {t('Cam kết không phát sinh chi phí', 'No hidden fees guaranteed')}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-terracotta" />
              {t('Bàn giao file gốc trong 24h', 'Raw gallery in 24 hours')}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-terracotta" />
              {t('Tư vấn concept độc bản', 'Custom bespoke concepts')}
            </span>
          </div>
        </div>
      </section>

      {/* Main Packages Display */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">
          {STUDIO_SERVICES.map((service, sIndex) => {
            const isReversed = sIndex % 2 === 1

            return (
              <div
                key={service.id}
                id={service.id}
                className="border border-sand/70 bg-white p-6 sm:p-10 lg:p-12 shadow-sm transition-all hover:shadow-md"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                  {/* Image Column */}
                  <div
                    className={cn(
                      'lg:col-span-6 relative aspect-[4/3] w-full overflow-hidden bg-sand/20 shadow-sm',
                      isReversed && 'lg:order-2'
                    )}
                  >
                    <Image
                      src={service.featuredImage}
                      alt={language === 'vi' ? service.titleVi : service.titleEn}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-charcoal/85 text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1">
                      {service.number} · {language === 'vi' ? service.badgeVi : service.badgeEn}
                    </div>
                  </div>

                  {/* Content Column */}
                  <div
                    className={cn(
                      'lg:col-span-6 space-y-6',
                      isReversed && 'lg:order-1'
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
                          {language === 'vi' ? service.titleVi : service.titleEn}
                        </h2>
                        <span className="font-serif text-2xl font-semibold text-terracotta">
                          {language === 'vi' ? service.priceVi : service.priceEn}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-light text-earth/90 leading-relaxed">
                        {language === 'vi' ? service.descriptionVi : service.descriptionEn}
                      </p>
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-2 border-t border-sand/60 pt-4">
                      <p className="text-xs font-mono uppercase tracking-wider text-charcoal font-semibold">
                        {t('Dịch vụ bao gồm:', 'Package Inclusions:')}
                      </p>
                      <ul className="grid grid-cols-1 gap-2 text-xs font-light text-earth/85">
                        {(language === 'vi' ? service.inclusionsVi : service.inclusionsEn).map(
                          (item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-2.5">
                              <Check className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Deliverables */}
                    <div className="space-y-2 border-t border-sand/60 pt-4">
                      <p className="text-xs font-mono uppercase tracking-wider text-charcoal font-semibold">
                        {t('Sản phẩm bàn giao:', 'Deliverables & Keepsakes:')}
                      </p>
                      <ul className="grid grid-cols-1 gap-1.5 text-xs font-light text-earth/85">
                        {(language === 'vi' ? service.deliverablesVi : service.deliverablesEn).map(
                          (item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-terracotta shrink-0 mt-1.5" />
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 border-t border-sand/60 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setInquiryOpen(true)}
                        className="bg-charcoal text-[#F7F2E9] px-7 py-3 text-xs font-medium uppercase tracking-[0.16em] hover:bg-terracotta transition-colors cursor-pointer"
                      >
                        {t('Đặt Lịch Gói Này', 'Book This Package')}
                      </button>

                      <Link
                        href="/contact"
                        className="border border-sand bg-white/70 px-5 py-3 text-xs font-light uppercase tracking-[0.14em] text-charcoal hover:bg-sand/30 transition-colors"
                      >
                        {t('Tư Vấn Miễn Phí', 'Free Consultation')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4-Step Workflow Section */}
      <section id="process" className="py-20 lg:py-28 bg-[#F5F0E8] border-t border-sand/70">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 pb-14">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
              {t('QUY TRÌNH 4 BƯỚC', 'OUR 4-STEP PROCESS')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
              {t('Trải Nghiệm Chụp Ảnh Thảnh Thơi', 'A Seamless & Joyful Experience')}
            </h2>
            <p className="text-xs sm:text-sm font-light text-earth/85 leading-relaxed">
              {t(
                'Từ cuộc trò chuyện đầu tiên cho đến khi cầm trên tay cuốn album hoàn thiện, chúng mình luôn đồng hành và lắng nghe mọi mong muốn của hai bạn.',
                'From our first conversation to the day you hold your finished photobook, we walk beside you every step of the journey.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {workflowSteps.map((step) => (
              <div
                key={step.number}
                className="bg-white border border-sand/70 p-6 sm:p-8 space-y-4 shadow-sm"
              >
                <span className="font-mono text-3xl font-light text-terracotta">
                  {step.number}
                </span>
                <h3 className="font-serif text-xl font-medium text-charcoal">
                  {language === 'vi' ? step.titleVi : step.titleEn}
                </h3>
                <p className="text-xs font-light text-earth/85 leading-relaxed">
                  {language === 'vi' ? step.descVi : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 border-t border-sand/70">
        <div className="mx-auto max-w-4xl px-6 lg:px-12 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
              {t('CÂU HỎI THƯỜNG GẶP', 'FREQUENTLY ASKED QUESTIONS')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
              {t('Giải Đáp Thắc Mắc Cùng Wispic', 'Everything You Need to Know')}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="border border-sand/70 bg-white/70 p-6 space-y-2 rounded-none"
              >
                <h4 className="font-serif text-lg font-medium text-charcoal flex items-start gap-3">
                  <span className="text-terracotta font-mono text-sm">Q.</span>
                  <span>{language === 'vi' ? faq.qVi : faq.qEn}</span>
                </h4>
                <p className="text-xs sm:text-sm font-light text-earth/90 pl-6 leading-relaxed">
                  {language === 'vi' ? faq.aVi : faq.aEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Dialog */}
      <InquiryDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} />

      <SiteFooter />
    </main>
  )
}
