'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useLanguage } from '@/lib/language-context'

export default function AboutPage() {
  const { language, t } = useLanguage()

  const values = [
    {
      titleVi: 'Cảm Xúc Tự Nhiên Là Trên Hết',
      titleEn: 'Natural Emotion First',
      descVi: 'Chúng mình không ép buộc cặp đôi phải tạo dáng kiểu mẫu. Chúng mình trân trọng những nụ cười ngô nghê, cái nghiêng đầu tựa vai hay phút giây xúc động rơi nước mắt.',
      descEn: 'We never enforce stiff posing. We cherish spontaneous laughter, a gentle lean on the shoulder, and raw tears of joy.',
    },
    {
      titleVi: 'Tone Màu Ấm Áp & Vượt Thời Gian',
      titleEn: 'Warm & Timeless Palette',
      descVi: 'Lấy cảm hứng từ chất phim nhựa 35mm hoài niệm và ánh nắng vàng 16h30. Nước ảnh trong trẻo, giữ trọn sắc thái làn da tự nhiên để 20 năm sau nhìn lại vẫn vẹn nguyên cảm xúc.',
      descEn: 'Inspired by 35mm analog film grain and 4:30 PM golden hour. Luminous skin tones that remain modern decades later.',
    },
    {
      titleVi: 'Buổi Chụp Thảnh Thơi Như Hẹn Hò',
      titleEn: 'Unhurried Like a Real Date',
      descVi: 'Không vội vã chạy theo số lượng cảnh chụp. Chúng mình cùng hai bạn đi dạo, uống cà phê và ghi lại những kỷ niệm đẹp đẽ như một chuyến du lịch.',
      descEn: 'No rushed checklists. We take a slow walk, sip local coffee, and document your love just like a relaxing holiday.',
    },
  ]

  const team = [
    {
      name: 'Vũ Lê',
      roleVi: 'Nhiếp ảnh gia Sáng lập & Giám đốc Nghệ thuật',
      roleEn: 'Founder & Lead Art Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      bioVi: 'Hơn 8 năm thực hành nhiếp ảnh phim và phóng sự cưới tài liệu khắp Việt Nam.',
      bioEn: 'Over 8 years documenting documentary wedding films and analog photography across Vietnam.',
    },
    {
      name: 'Hà Nguyễn',
      roleVi: 'Trưởng nhóm Stylist & Chuyên gia Ý tưởng',
      roleEn: 'Head of Styling & Concept Curator',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      bioVi: 'Đam mê chất liệu lụa thô, trang phục cưới tối giản và hoa cưới tự nhiên.',
      bioEn: 'Passionate about raw silk textures, minimal bridal gowns, and organic florals.',
    },
    {
      name: 'Tuấn Trần',
      roleVi: 'Đạo diễn Phim Cưới Cinematic',
      roleEn: 'Cinematic Wedding Film Director',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      bioVi: 'Ghi lại lời thề nguyện và những khoảnh khắc cử động với nhịp điệu điện ảnh sâu lắng.',
      bioEn: 'Capturing vows and authentic motion with deep cinematic pacing and true sound.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#FBF8F2] text-[#292522] selection:bg-terracotta/20 selection:text-charcoal font-sans antialiased">
      <SiteHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 border-b border-sand/70 bg-[#F7F2E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
              {t('VỀ CHÚNG MÌNH · WISPIC STUDIO', 'ABOUT US · WISPIC STUDIO')}
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-charcoal tracking-tight leading-[1.08]">
              {t('Tình yêu ngọt ngào,', 'Honest, tender love,')}
              <br />
              <span className="italic text-terracotta">
                {t('tự nhiên và nguyên bản.', 'raw and timeless.')}
              </span>
            </h1>

            <p className="text-sm sm:text-base font-light text-earth/90 leading-relaxed pt-2">
              {t(
                'Wispic ra đời từ mong muốn mang lại một làn gió mới cho nhiếp ảnh cưới tại Việt Nam: nơi những tấm ảnh không còn là sự gồng mình tạo dáng hay nụ cười máy móc, mà là nơi bạn được là chính mình bên người thương.',
                'Wispic was born to bring a breath of fresh air to wedding photography in Vietnam: where photos are no longer forced poses or robotic smiles, but a sanctuary where you can simply be yourself beside your loved one.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Story & Philosophy Grid */}
      <section id="philosophy" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Visual Frame */}
            <div className="lg:col-span-6 relative aspect-[4/3] w-full overflow-hidden bg-sand/30 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85"
                alt="Wispic shoot"
                fill
                className="object-cover"
              />
            </div>

            {/* Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
                {t('TRIẾT LÝ NHIẾP ẢNH', 'OUR PHILOSOPHY')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
                {t('Không có kịch bản nào đẹp bằng tình yêu thật.', 'No script is as beautiful as real love.')}
              </h2>
              <p className="text-xs sm:text-sm font-light text-earth/90 leading-relaxed">
                {t(
                  'Khi nhìn vào một bức ảnh cưới, điều đầu tiên chạm vào mắt bạn không nên là chiếc váy đắt tiền hay khung cảnh lộng lẫy, mà phải là ánh mắt hai người nhìn nhau. Chúng mình kiên trì theo đuổi phong cách chụp ảnh tài liệu kết hợp thẩm mỹ điện ảnh hiện đại.',
                  'When gazing upon a wedding photograph, the first thing that strikes you should not be an expensive gown or extravagant backdrop, but the way two souls look at one another. We dedicate ourselves to documentary storytelling woven with modern cinematic poise.'
                )}
              </p>
              <p className="text-xs sm:text-sm font-light text-earth/90 leading-relaxed">
                {t(
                  'Từ bờ biển An Bàng gió thổi lồng lộng đến sườn đồi thông Đà Lạt se lạnh, Wispic luôn tìm kiếm những khoảng lặng ấm áp để hai bạn quên đi sự hiện diện của ống kính.',
                  'From windswept An Bang beaches to cool Da Lat pine ridges, Wispic seeks gentle pauses where you forget the camera entirely.'
                )}
              </p>
            </div>
          </div>

          {/* 3 Core Values Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-sand/60">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white border border-sand/70 p-6 sm:p-8 space-y-3 shadow-sm">
                <span className="font-mono text-2xl font-light text-terracotta">
                  0{idx + 1}
                </span>
                <h3 className="font-serif text-xl font-medium text-charcoal">
                  {language === 'vi' ? val.titleVi : val.titleEn}
                </h3>
                <p className="text-xs font-light text-earth/85 leading-relaxed">
                  {language === 'vi' ? val.descVi : val.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Aesthetic Section */}
      <section id="aesthetic" className="py-20 lg:py-28 bg-[#F4EFE6] border-t border-sand/70">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
              {t('TONE MÀU & CHẤT LIỆU', 'SIGNATURE COLOR TONES')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
              {t('Ánh Sáng Ấm Áp & Hạt Phim Hoài Niệm', 'Warm Golden Light & Analog Grain')}
            </h2>
            <p className="text-xs sm:text-sm font-light text-earth/85 leading-relaxed">
              {t(
                'Màu sắc của Wispic được căn chỉnh độc quyền theo từng bối cảnh địa phương: sắc vàng mật ong miền Trung, màu sương khói mờ ảo của cao nguyên và chất đen trắng giàu tương phản.',
                'Our palettes are tailored uniquely to each Vietnamese locale: honeyed amber along the central coast, misty twilight over highland pines, and rich monochrome contrast.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 space-y-2 border border-sand/70 shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/20">
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                  alt="Amber tone"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-serif text-base font-medium text-charcoal">
                {t('Nắng Hoàng Hôn Hổ Phách', 'Golden Amber Dusk')}
              </h4>
              <p className="text-[11px] font-light text-earth/70">
                {t('Ấm áp, tôn da tự nhiên và ngọt ngào.', 'Warm, flattering, and gentle on skin.')}
              </p>
            </div>

            <div className="bg-white p-4 space-y-2 border border-sand/70 shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/20">
                <Image
                  src="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=600&q=80"
                  alt="Highland mist"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-serif text-base font-medium text-charcoal">
                {t('Sương Sớm Cao Nguyên', 'Highland Morning Mist')}
              </h4>
              <p className="text-[11px] font-light text-earth/70">
                {t('Thanh mát, mơ màng và tĩnh tại.', 'Crisp, dreamy, and peaceful stillness.')}
              </p>
            </div>

            <div className="bg-white p-4 space-y-2 border border-sand/70 shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/20">
                <Image
                  src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80"
                  alt="Noir classic"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-serif text-base font-medium text-charcoal">
                {t('Đen Trắng Cổ Điển', 'Classic Noir Monograph')}
              </h4>
              <p className="text-[11px] font-light text-earth/70">
                {t('Chiều sâu ánh sáng và cảm xúc thuần khiết.', 'Deep contrast and pure emotion.')}
              </p>
            </div>

            <div className="bg-white p-4 space-y-2 border border-sand/70 shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/20">
                <Image
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80"
                  alt="Organic tone"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-serif text-base font-medium text-charcoal">
                {t('Tối Giản & Tinh Tế', 'Clean & Organic')}
              </h4>
              <p className="text-[11px] font-light text-earth/70">
                {t('Hiện đại, thanh tao và bền vững.', 'Modern, refined, and everlasting.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 lg:py-28 border-t border-sand/70">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta">
              {t('ĐỘI NGŨ WISPIC', 'THE TEAM')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
              {t('Những Người Bạn Đồng Hành Tận Tâm', 'Passionate Storytellers')}
            </h2>
            <p className="text-xs sm:text-sm font-light text-earth/85">
              {t(
                'Chúng mình không chỉ là thợ chụp ảnh — chúng mình là người bạn lắng nghe và đồng hành cùng hai bạn suốt hành trình.',
                'More than photographers — we are trusted friends walking with you through every memorable milestone.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white border border-sand/70 p-6 space-y-4 shadow-sm text-center">
                <div className="relative aspect-square w-36 h-36 mx-auto rounded-full overflow-hidden bg-sand/30 shadow-sm">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-medium text-charcoal">{member.name}</h3>
                  <p className="text-xs font-mono text-terracotta">
                    {language === 'vi' ? member.roleVi : member.roleEn}
                  </p>
                  <p className="text-xs font-light text-earth/80 pt-1 leading-relaxed">
                    {language === 'vi' ? member.bioVi : member.bioEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-sand/70 bg-[#FAF7F2] py-16 text-center">
        <div className="mx-auto max-w-3xl px-6 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
            {t('Trò chuyện cùng Wispic ngay hôm nay', 'Have a chat with Wispic today')}
          </h2>
          <p className="text-xs sm:text-sm font-light text-earth/85 max-w-md mx-auto">
            {t(
              'Ghé thăm studio tại Hội An, Đà Lạt hoặc Sài Gòn để cùng thưởng thức tách trà nóng và ngắm nhìn các cuốn album photobook thực tế.',
              'Drop by our studio in Hoi An, Da Lat or Saigon for a warm cup of tea and browse through physical photobooks.'
            )}
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-charcoal text-[#F7F2E9] px-7 py-3 text-xs font-medium uppercase tracking-wider hover:bg-terracotta transition-colors"
            >
              <span>{t('Liên Hệ Đặt Lịch Hẹn', 'Schedule a Studio Visit')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
