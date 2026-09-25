'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { InquiryDialog } from '@/components/inquiry-dialog'
import { useLanguage } from '@/lib/language-context'

export function FinalCta() {
  const { t } = useLanguage()
  const [inquiryOpen, setInquiryOpen] = useState(false)

  return (
    <>
      <section className="py-24 lg:py-36 border-t border-sand/70 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="relative border border-sand/70 bg-[#FAF7F2] p-10 sm:p-16 lg:p-24 shadow-[0_24px_60px_-25px_rgba(41,37,34,0.18)]">
            {/* Background subtle photography overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1800&q=85"
                alt="Wispic Final Note"
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="relative z-10 max-w-3xl space-y-6">
              <p className="text-[11px] font-light uppercase tracking-[0.3em] text-terracotta">
                {t('Wispic Studio · Dự án & Kỷ vật Nghệ thuật', 'Wispic Studio · Commissions & Keepsakes')}
              </p>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-charcoal tracking-tight leading-[1.08]">
                {t('Cùng nhau tạo nên điều đáng nhớ.', 'Let\'s create something worth remembering.')}
              </h2>

              <p className="text-sm sm:text-base font-light text-earth/90 leading-relaxed max-w-xl">
                {t(
                  'Dù bạn đang lên kế hoạch cho một lễ cưới thân mật, một bộ ảnh chân dung nghệ thuật, hay một chiếc thiệp cưới số tinh tế cho khách mời — chúng mình luôn lắng nghe câu chuyện của bạn.',
                  'Whether you are planning an intimate vows ceremony, an archival portrait commission, or a thoughtful digital invitation for your guests — we would love to hear your story.'
                )}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  type="button"
                  onClick={() => setInquiryOpen(true)}
                  className="group inline-flex items-center justify-center gap-2.5 bg-charcoal text-[#F7F2E9] px-8 py-4 text-xs font-medium uppercase tracking-[0.18em] transition-all hover:bg-terracotta"
                >
                  <span>{t('Hợp tác cùng Wispic', 'Work with Wispic')}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                <Link
                  href="/dashboard/create"
                  className="group inline-flex items-center justify-center gap-2.5 border border-charcoal/30 bg-white/60 px-8 py-4 text-xs font-medium uppercase tracking-[0.18em] text-charcoal transition-all hover:border-charcoal hover:bg-white"
                >
                  <span>{t('Tạo thiệp cưới', 'Create Invitation')}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="pt-8 border-t border-sand/60 flex flex-wrap items-center gap-6 sm:gap-8 text-[11px] font-light text-earth/70">
                <span>{t('Trao đổi cùng studio: hello@wispic.vn', 'Studio inquiries: hello@wispic.vn')}</span>
                <span>·</span>
                <span>Đà Nẵng · Hội An · Sài Gòn · Đà Lạt</span>
                <span>·</span>
                <span>{t('Phản hồi trong vòng 24 giờ', 'Response within 24 hours')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InquiryDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  )
}
