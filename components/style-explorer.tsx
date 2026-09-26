'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface StyleAesthetic {
  id: string
  nameVi: string
  nameEn: string
  taglineVi: string
  taglineEn: string
  descriptionVi: string
  descriptionEn: string
  keywordsVi: string[]
  keywordsEn: string[]
  palette: string[]
  recommendedTemplateVi: string
  recommendedTemplateEn: string
  templateId: string
  photos: [string, string]
}

const STYLES: StyleAesthetic[] = [
  {
    id: 'film-35mm',
    nameVi: 'Cinematic 35mm',
    nameEn: 'Cinematic 35mm',
    taglineVi: 'Ấm áp, hạt phim hoài niệm và những khoảnh khắc bất chợt',
    taglineEn: 'Warm analog grain, golden halation and spontaneous gestures',
    descriptionVi: 'Dành cho những người yêu thích ánh sáng tự nhiên vàng óng, độ nhiễu hạt nhẹ của cuộn phim nhựa và sự tự do không xếp đặt.',
    descriptionEn: 'For lovers of honeyed late sunlight, subtle silver gelatin grain, and the freedom of unchoreographed romance.',
    keywordsVi: ['Nắng chiều vàng', 'Hạt phim hoài niệm', 'Ánh mắt tự nhiên', 'Chuyển động chân thực'],
    keywordsEn: ['Golden Hour', 'Analog Halation', 'Unposed Gaze', 'Candid Motion'],
    palette: ['#D97832', '#A9573F', '#F7F2E9', '#292522'],
    recommendedTemplateVi: 'Mẫu Lãng mạn',
    recommendedTemplateEn: 'Romantic Edition',
    templateId: 'romantic',
    photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    id: 'architectural',
    nameVi: 'Kiến trúc & Tối giản',
    nameEn: 'Architectural & Minimal',
    taglineVi: 'Khoảng lặng kỷ hà, bố cục cân xứng và tính trật tự',
    taglineEn: 'Geometric silence, balanced lines and architectural poise',
    descriptionVi: 'Tôn vinh hình khối công trình, bóng đổ sắc nét và khoảng trắng bao la. Mỗi bức hình như một bản in kiến trúc trang nhã.',
    descriptionEn: 'Honoring sharp geometric shadows, clean monograph lines, and quiet dignity with expansive negative space.',
    keywordsVi: ['Khoảng trắng tĩnh lặng', 'Đường nét kỷ hà', 'Góc độ sắc sảo', 'Thanh lịch chuẩn mực'],
    keywordsEn: ['Negative Space', 'Clean Monograph', 'Sharp Angles', 'Quiet Dignity'],
    palette: ['#292522', '#DED0BD', '#FAF7F2', '#594238'],
    recommendedTemplateVi: 'Mẫu Thanh Vân',
    recommendedTemplateEn: 'Thanh Van Monograph',
    templateId: 'romantic',
    photos: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    id: 'sunlit-organic',
    nameVi: 'Nắng ấm & Thuần mộc',
    nameEn: 'Sunlit & Organic',
    taglineVi: 'Lụa thô, hương cỏ khô và gió biển phóng khoáng',
    taglineEn: 'Raw linen, dried botanicals and coastal sea winds',
    descriptionVi: 'Cảm hứng từ chất liệu hữu cơ, những buổi lễ ngoài trời bên bờ cát hoặc đồi thông, nơi thiên nhiên là người chứng kiến duy nhất.',
    descriptionEn: 'Inspired by tactile organic materials, beachfront vows, and mountain ceremonies where nature is the sole witness.',
    keywordsVi: ['Vải lanh hữu cơ', 'Gió đồi thảo mộc', 'Nắng tán xạ', 'Sắc đất trầm ấm'],
    keywordsEn: ['Raw Linen', 'Botanical Wind', 'Diffuse Sunlight', 'Earthy Nuance'],
    palette: ['#6F7558', '#DED0BD', '#F4EFE6', '#3D342E'],
    recommendedTemplateVi: 'Mẫu Thanh xuân',
    recommendedTemplateEn: 'Youthful Modern',
    templateId: 'modern',
    photos: [
      'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    id: 'nocturne',
    nameVi: 'Đêm hoa đăng & Thi vị',
    nameEn: 'Nocturne & Poetry',
    taglineVi: 'Ánh flash trực diện, tiệc tối muộn và nét thơ ngẫu hứng',
    taglineEn: 'Direct flash, afterparty blur and poetic night energy',
    descriptionVi: 'Phong cách thời trang thập niên 90: bùng nổ, táo bạo và ngập tràn năng lượng khi đêm buông và ly champagne sủi tăm.',
    descriptionEn: '90s editorial fashion energy: bold, evocative, and alive as evening deepens and celebratory glasses clink.',
    keywordsVi: ['Flash trực diện', 'Ánh sáng đêm muộn', 'Tương phản mạnh', 'Ngẫu hứng thi vị'],
    keywordsEn: ['Direct Flash', 'Afterparty Blur', 'High Contrast', 'Poetic Chaos'],
    palette: ['#1F1D1B', '#E8C15A', '#FAF7F2', '#A9573F'],
    recommendedTemplateVi: 'Mẫu Song Hỷ',
    recommendedTemplateEn: 'Song Hy Heritage',
    templateId: 'traditional',
    photos: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=85',
    ],
  },
]

export function StyleExplorer() {
  const { language, t } = useLanguage()
  const [activeStyleId, setActiveStyleId] = useState<string>('film-35mm')
  const activeStyle = STYLES.find((s) => s.id === activeStyleId) || STYLES[0]

  return (
    <section id="style" className="py-24 lg:py-36 border-t border-sand/70 bg-[#F5EFE6]/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-sand/60">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-terracotta">
              {t('PHONG CÁCH & TONE MÀU', 'AESTHETIC & COLOR TONES')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
              {t('Khám Phá Phong Cách Ảnh Hai Bạn Yêu Thích', 'Find Your Visual Aesthetic')}
            </h2>
            <p className="text-sm sm:text-base font-light text-earth/80 leading-relaxed">
              {t(
                'Mỗi cặp đôi mang một nhịp điệu cảm xúc riêng. Hãy khám phá qua bảng cảm hứng thị giác, hòa sắc và chất liệu để tìm thấy phong cách phản chiếu đúng nhất về hai bạn.',
                'Every couple carries a distinct visual rhythm. Explore through photographic mood boards, color harmonies, and textures to find what feels true to you.'
              )}
            </p>
          </div>

          <div className="text-[11px] font-light uppercase tracking-[0.2em] text-earth/70">
            {t('Khám phá Bằng Hình ảnh · Không Biểu mẫu', 'Interactive Visual Curation · No Forms')}
          </div>
        </div>

        {/* Style Selection Cards */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setActiveStyleId(style.id)}
              className={`group relative text-left p-4 sm:p-5 border transition-all ${
                activeStyleId === style.id
                  ? 'border-charcoal bg-[#FAF7F2] shadow-md'
                  : 'border-sand/70 bg-white/40 hover:border-charcoal/40 hover:bg-white/70'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-light uppercase tracking-wider text-earth/70 mb-2">
                <span>{t('Phong cách', 'Aesthetic')}</span>
                {activeStyleId === style.id && (
                  <span className="h-1.5 w-1.5 rounded-full bg-tangerine" />
                )}
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-charcoal group-hover:text-terracotta transition-colors">
                {language === 'vi' ? style.nameVi : style.nameEn}
              </h3>
              <p className="mt-1 text-[11px] font-light text-earth/80 line-clamp-1">
                {(language === 'vi' ? style.keywordsVi : style.keywordsEn)[0]} · {(language === 'vi' ? style.keywordsVi : style.keywordsEn)[1]}
              </p>
            </button>
          ))}
        </div>

        {/* Active Style Moodboard Showcase */}
        <div className="mt-10 border border-sand/80 bg-[#FAF7F2] p-8 sm:p-12 shadow-[0_20px_50px_-20px_rgba(41,37,34,0.15)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Photography Pair (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand/30 shadow-md">
                <Image
                  src={activeStyle.photos[0]}
                  alt={`${language === 'vi' ? activeStyle.nameVi : activeStyle.nameEn} photography sample`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest text-white/90 bg-charcoal/60 px-2 py-0.5">
                  Plate A
                </div>
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand/30 shadow-md mt-6 sm:mt-10">
                <Image
                  src={activeStyle.photos[1]}
                  alt={`${language === 'vi' ? activeStyle.nameVi : activeStyle.nameEn} photography detail`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest text-white/90 bg-charcoal/60 px-2 py-0.5">
                  Plate B
                </div>
              </div>
            </div>

            {/* Aesthetic Narrative & Palette (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] font-light uppercase tracking-[0.25em] text-terracotta">
                  {t('Tuyển tập Phong cách', 'Curated Aesthetic')}
                </p>
                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
                  {language === 'vi' ? activeStyle.nameVi : activeStyle.nameEn}
                </h3>
                <p className="font-serif italic text-base sm:text-lg text-earth">
                  {language === 'vi' ? activeStyle.taglineVi : activeStyle.taglineEn}
                </p>
              </div>

              <p className="text-xs sm:text-sm font-light leading-relaxed text-earth/90">
                {language === 'vi' ? activeStyle.descriptionVi : activeStyle.descriptionEn}
              </p>

              {/* Keywords */}
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-earth/70 mb-2">
                  {t('Cảm xúc chủ đạo', 'Key Sensations')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(language === 'vi' ? activeStyle.keywordsVi : activeStyle.keywordsEn).map((kw) => (
                    <span
                      key={kw}
                      className="border border-sand bg-white/70 px-2.5 py-1 text-[11px] font-light text-charcoal"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tonal Harmony Palette */}
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-earth/70 mb-2">
                  {t('Hòa sắc Đặc trưng', 'Tonal Harmony')}
                </p>
                <div className="flex items-center gap-2">
                  {activeStyle.palette.map((color, idx) => (
                    <span
                      key={idx}
                      className="h-6 w-8 border border-sand"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Recommended Invitation Pairing */}
              <div className="pt-4 border-t border-sand/60">
                <p className="text-[11px] text-earth/80">
                  {t('Mẫu thiệp tương thích: ', 'Matching invitation: ')}
                  <strong className="font-medium text-charcoal">
                    {language === 'vi' ? activeStyle.recommendedTemplateVi : activeStyle.recommendedTemplateEn}
                  </strong>
                </p>
                <div className="mt-4">
                  <Link
                    href={`/dashboard/create?template=${activeStyle.templateId}`}
                    className="inline-flex items-center gap-2 bg-charcoal text-[#F7F2E9] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] transition-all hover:bg-terracotta"
                  >
                    <span>{t('Tạo thiệp theo phong cách này', 'Create with this Aesthetic')}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
