'use client'

import { useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useLanguage } from '@/lib/language-context'

export default function ContactPage() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    coupleNames: '',
    phone: '',
    email: '',
    date: '',
    location: '',
    package: 'pre-wedding',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated submission
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#FBF8F2] text-[#292522] selection:bg-terracotta/20 selection:text-charcoal font-sans antialiased">
      <SiteHeader />

      {/* Header Banner */}
      <section className="pt-32 pb-14 lg:pt-40 lg:pb-18 border-b border-sand/70 bg-[#F7F2E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
            <Sparkles className="h-4 w-4" />
            <span>{t('ĐẶT LỊCH CHỤP & TƯ VẤN', 'BOOKING & CONSULTATION')}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-charcoal tracking-tight">
            {t('Liên Hệ Cùng Wispic', 'Get in Touch with Wispic')}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base font-light text-earth/90 leading-relaxed">
            {t(
              'Hãy chia sẻ với chúng mình về ngày vui của hai bạn. Wispic sẽ phản hồi chi tiết trong vòng 24 giờ cùng báo giá và các gợi ý concept phù hợp nhất.',
              'Tell us about your wedding dreams. We will respond within 24 hours with custom packages and tailored concept suggestions.'
            )}
          </p>
        </div>
      </section>

      {/* Main Content: Form & Studio Info */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Interactive Booking Form (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-sand/70 p-6 sm:p-10 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal">
                    {t('Gửi Thông Tin Thành Công!', 'Message Sent Successfully!')}
                  </h3>
                  <p className="text-xs sm:text-sm font-light text-earth/90 max-w-md mx-auto leading-relaxed">
                    {t(
                      'Cảm ơn hai bạn đã tin tưởng Wispic. Chuyên viên tư vấn sẽ liên hệ lại qua điện thoại / Zalo trong vòng 24 giờ để trao đổi chi tiết.',
                      'Thank you for trusting Wispic. Our team will contact you via phone or Zalo within 24 hours with concept details.'
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        coupleNames: '',
                        phone: '',
                        email: '',
                        date: '',
                        location: '',
                        package: 'pre-wedding',
                        message: '',
                      })
                    }}
                    className="mt-4 inline-block text-xs font-mono uppercase tracking-wider text-terracotta hover:underline cursor-pointer"
                  >
                    {t('Gửi thêm yêu cầu khác', 'Send another inquiry')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1 border-b border-sand/60 pb-3">
                    <h3 className="font-serif text-2xl font-medium text-charcoal">
                      {t('Phiếu Tư Vấn Gói Chụp', 'Consultation Form')}
                    </h3>
                    <p className="text-xs font-light text-earth/80">
                      {t('Vui lòng điền thông tin để Wispic hỗ trợ chu đáo nhất.', 'Please fill out your details so we can best assist you.')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-charcoal">
                        {t('Tên cô dâu & chú rể *', 'Couple Names *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.coupleNames}
                        onChange={(e) =>
                          setFormData({ ...formData, coupleNames: e.target.value })
                        }
                        placeholder={t('vd: Minh & Hà', 'e.g. Minh & Ha')}
                        className="w-full border border-sand/80 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-charcoal focus:border-terracotta focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-charcoal">
                        {t('Số điện thoại / Zalo *', 'Phone / Zalo *')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="09xx xxx xxx"
                        className="w-full border border-sand/80 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-charcoal focus:border-terracotta focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-charcoal">
                        {t('Email liên hệ', 'Email Address')}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="yourname@gmail.com"
                        className="w-full border border-sand/80 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-charcoal focus:border-terracotta focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-charcoal">
                        {t('Ngày cưới / chụp dự kiến', 'Expected Date')}
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full border border-sand/80 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-charcoal focus:border-terracotta focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-charcoal">
                        {t('Gói dịch vụ quan tâm *', 'Service Package *')}
                      </label>
                      <select
                        value={formData.package}
                        onChange={(e) =>
                          setFormData({ ...formData, package: e.target.value })
                        }
                        className="w-full border border-sand/80 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-charcoal focus:border-terracotta focus:outline-none"
                      >
                        <option value="pre-wedding">
                          {t('Pre-wedding Ngoại cảnh & Studio', 'Pre-wedding Shoot')}
                        </option>
                        <option value="wedding-day">
                          {t('Phóng sự ngày cưới (Wedding Day)', 'Documentary Wedding Day')}
                        </option>
                        <option value="wedding-film">
                          {t('Phim cưới Cinematic 4K', 'Cinematic Wedding Film')}
                        </option>
                        <option value="digital-invitations">
                          {t('Thiệp cưới Online thông minh', 'Digital Wedding Invitations')}
                        </option>
                        <option value="combo">
                          {t('Combo Trọn Gói (Ảnh + Phim + Thiệp)', 'Full Studio Combo')}
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-charcoal">
                        {t('Địa điểm dự kiến', 'Target Location')}
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder={t('Hội An, Đà Lạt, Sài Gòn...', 'Hoi An, Da Lat, Saigon...')}
                        className="w-full border border-sand/80 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-charcoal focus:border-terracotta focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-charcoal">
                      {t('Lời nhắn gửi hoặc mong muốn riêng', 'Your Story or Special Requests')}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={t(
                        'Hai bạn muốn buổi chụp diễn ra như thế nào? Phong cách nào bạn yêu thích nhất?...',
                        'Tell us what vibe you envision, favorite aesthetic, or any questions...'
                      )}
                      className="w-full border border-sand/80 bg-[#FAF7F2] p-3 text-xs text-charcoal focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-charcoal text-[#F7F2E9] py-3.5 text-xs font-medium uppercase tracking-[0.18em] hover:bg-terracotta transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{t('Gửi Yêu Cầu Tư Vấn', 'Submit Booking Inquiry')}</span>
                  </button>

                  <p className="text-[11px] text-center text-earth/70 font-light">
                    {t(
                      '🔒 Thông tin của hai bạn được bảo mật tuyệt đối và chỉ dùng để gửi báo giá.',
                      '🔒 Your privacy is fully respected and only used for your consultation.'
                    )}
                  </p>
                </form>
              )}
            </div>

            {/* Right: Studio Direct Contact & Sanctuaries (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Quick Contacts */}
              <div className="bg-[#FAF7F2] border border-sand/70 p-6 sm:p-8 space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta">
                    {t('KẾT NỐI TRỰC TIẾP', 'DIRECT CONTACT')}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-charcoal">
                    {t('Hotline & Trò Chuyện Nhanh', 'Call or Message Us')}
                  </h3>
                </div>

                <div className="space-y-4 text-xs font-light text-charcoal">
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-charcoal">Hotline Studio:</p>
                      <p className="text-earth">0905 882 140 (Ms. Hà) · 0935 120 440 (Mr. Vũ)</p>
                      <p className="text-[11px] text-earth/70">{t('Hoạt động từ 8:30 – 21:00 hàng ngày', 'Open daily 8:30 AM – 9:00 PM')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-charcoal">Email:</p>
                      <p className="text-earth">booking@wispic.vn · contact@wispic.vn</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-charcoal">{t('Thời gian phản hồi:', 'Response Time:')}</p>
                      <p className="text-earth">{t('Trong vòng 2 đến 4 giờ làm việc', 'Within 2–4 business hours')}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-sand/60 flex items-center gap-3">
                  <a
                    href="https://zalo.me"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-white border border-sand py-2.5 text-xs uppercase tracking-wider font-medium text-charcoal hover:border-charcoal hover:bg-sand/20 transition-colors"
                  >
                    {t('Chat qua Zalo', 'Chat on Zalo')}
                  </a>
                  <a
                    href="tel:0905882140"
                    className="flex-1 text-center bg-charcoal text-[#F7F2E9] py-2.5 text-xs uppercase tracking-wider font-medium hover:bg-terracotta transition-colors"
                  >
                    {t('Gọi Hotline', 'Call Now')}
                  </a>
                </div>
              </div>

              {/* Physical Studio Locations */}
              <div className="bg-white border border-sand/70 p-6 sm:p-8 space-y-4">
                <h4 className="font-serif text-xl font-medium text-charcoal">
                  {t('Hệ Thống Studio Wispic', 'Studio Branches')}
                </h4>

                <div className="space-y-4 text-xs font-light text-earth/90 divide-y divide-sand/50">
                  <div className="pt-2 space-y-1">
                    <p className="font-medium text-charcoal flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-terracotta" />
                      <span>Hội An & Đà Nẵng</span>
                    </p>
                    <p>88 Cửa Đại, P. Cẩm Châu, TP. Hội An, Quảng Nam</p>
                    <p className="text-[11px] text-earth/70">{t('Không gian nhà vườn đón nắng tự nhiên', 'Garden villa with natural light')}</p>
                  </div>

                  <div className="pt-3 space-y-1">
                    <p className="font-medium text-charcoal flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-terracotta" />
                      <span>Đà Lạt</span>
                    </p>
                    <p>24 Khởi Nghĩa Bắc Sơn, Phường 10, TP. Đà Lạt</p>
                    <p className="text-[11px] text-earth/70">{t('Biệt thự đồi thông se lạnh', 'Pine hill retreat villa')}</p>
                  </div>

                  <div className="pt-3 space-y-1">
                    <p className="font-medium text-charcoal flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-terracotta" />
                      <span>Sài Gòn Atelier</span>
                    </p>
                    <p>42 Lý Tự Trọng, Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
                    <p className="text-[11px] text-earth/70">{t('Phòng tối & không gian trưng bày photobook', 'Darkroom & album showroom')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
