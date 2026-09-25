'use client'

import { useState } from 'react'
import { X, Check, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface InquiryDialogProps {
  open: boolean
  onClose: () => void
  initialService?: string
}

export function InquiryDialog({ open, onClose, initialService = 'Photography' }: InquiryDialogProps) {
  const { t } = useLanguage()
  const [service, setService] = useState(initialService)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [timeline, setTimeline] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  const handleReset = () => {
    setSubmitted(false)
    setName('')
    setContact('')
    setTimeline('')
    setNote('')
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm transition-opacity"
      />

      {/* Dialog Body */}
      <div className="relative w-full max-w-xl overflow-hidden border border-sand/60 bg-[#FAF7F2] p-8 shadow-2xl transition-all sm:p-10">
        <button
          onClick={onClose}
          aria-label={t('Đóng', 'Close')}
          className="absolute right-6 top-6 text-charcoal/60 transition-colors hover:text-charcoal"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-terracotta/30 bg-terracotta/10 text-terracotta">
              <Check className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <p className="font-serif text-2xl font-normal text-charcoal sm:text-3xl">
              {t('Cảm ơn bạn đã chia sẻ', 'Thank you for reaching out')}
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-earth">
              {t(
                `Wispic Studio đã nhận được lời nhắn của bạn (${contact || 'email'}). Chúng mình sẽ xem xét cẩn trọng và phản hồi cùng bản đề xuất ý tưởng trong vòng 24 giờ.`,
                `Wispic Studio has received your note (${contact || 'email'}). We will review it carefully and respond with creative thoughts within 24 hours.`
              )}
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 border-b border-charcoal pb-0.5 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:text-terracotta hover:border-terracotta"
              >
                {t('Trở lại trang chủ', 'Return to homepage')}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-terracotta">
                {t('DỰ ÁN & LIÊN HỆ', 'COMMISSION & INQUIRY')}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-normal text-charcoal sm:text-3xl">
                {t('Cùng Wispic tạo nên tác phẩm', 'Create something memorable with Wispic')}
              </h3>
              <p className="mt-1 text-xs font-light text-earth/80">
                {t(
                  'Hãy cho chúng mình biết về dự định, ngày kỷ niệm hoặc ý niệm bạn đang ấp ủ.',
                  'Tell us about your upcoming celebration, commission, or artistic vision.'
                )}
              </p>
            </div>

            {/* Service selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
                {t('Dịch vụ bạn quan tâm', 'Service of Interest')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Photography', label: t('Nhiếp ảnh', 'Photography') },
                  { id: 'Wedding', label: t('Thiệp cưới', 'Wedding') },
                  { id: 'Creative', label: t('Creative Studio', 'Creative Studio') },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setService(item.id)}
                    className={`border px-3 py-2.5 text-xs font-light transition-all ${
                      service === item.id
                        ? 'border-charcoal bg-charcoal text-[#F7F2E9]'
                        : 'border-sand/70 bg-white/60 text-charcoal hover:border-charcoal/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Contact */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
                  {t('Tên của bạn *', 'Your Name *')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('Minh Anh & Hoàng Long', 'Your full name')}
                  className="mt-1.5 w-full border border-sand/70 bg-white/70 px-3.5 py-2.5 text-xs font-light text-charcoal placeholder:text-earth/40 focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
                  {t('Email hoặc Số điện thoại *', 'Email or Phone *')}
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="hello@example.com"
                  className="mt-1.5 w-full border border-sand/70 bg-white/70 px-3.5 py-2.5 text-xs font-light text-charcoal placeholder:text-earth/40 focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>

            {/* Timeline / Location */}
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
                {t('Thời gian & Địa điểm dự kiến', 'Estimated Timeline & Location')}
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder={t('Tháng 12 / 2026 — Đà Lạt / Hội An', 'November 2025 — Da Lat / Hoi An')}
                className="mt-1.5 w-full border border-sand/70 bg-white/70 px-3.5 py-2.5 text-xs font-light text-charcoal placeholder:text-earth/40 focus:border-charcoal focus:outline-none"
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
                {t('Ghi chú hoặc ý niệm ban đầu', 'Notes or aesthetic thoughts')}
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t(
                  'Bạn muốn không khí buổi chụp hay thiệp cưới mang cảm giác ra sao...',
                  'Share any thoughts on atmosphere, light, or specific wishes...'
                )}
                className="mt-1.5 w-full resize-none border border-sand/70 bg-white/70 px-3.5 py-2.5 text-xs font-light text-charcoal placeholder:text-earth/40 focus:border-charcoal focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-light text-earth/60">
                {t('Wispic tôn trọng tính riêng tư và bảo mật.', 'Wispic treats all inquiries with confidentiality.')}
              </span>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F2E9] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? t('Đang gửi...', 'Sending...') : t('Gửi yêu cầu', 'Submit Inquiry')}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
