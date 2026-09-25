'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface PhotoItem {
  id: string
  titleVi: string
  titleEn: string
  locationVi: string
  locationEn: string
  year: string
  category: 'portrait' | 'detail' | 'landscape'
  mediumVi: string
  mediumEn: string
  aspect: string
  src: string
  storyVi: string
  storyEn: string
}

const GALLERY_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    titleVi: 'Bậc đá Sơn Trà trong bóng chiều',
    titleEn: 'The Stone Steps of Son Tra',
    locationVi: 'Đà Nẵng, Duyên hải miền Trung',
    locationEn: 'Da Nang, Central Coast',
    year: '2025',
    category: 'portrait',
    mediumVi: 'Medium Format · Nắng tự nhiên',
    mediumEn: 'Medium Format · Natural Sunlight',
    aspect: 'aspect-[3/4]',
    src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
    storyVi: 'Ghi lại vào cuối chiều dưới tán đa cổ thụ. Minh & Hà bước đi tự nhiên không cần chỉ dẫn, tìm thấy sự ấm áp trong khoảng lặng giữa những cơn gió biển.',
    storyEn: 'Captured in the late afternoon beneath ancient banyan canopies. Minh & Ha moved without direction, finding warmth in the stillness between ocean gusts.',
  },
  {
    id: 'photo-2',
    titleVi: 'Khăn voan lụa & Nắng hổ phách',
    titleEn: 'Linen Veil & Amber Afternoon',
    locationVi: 'Phố cổ Hội An',
    locationEn: 'Hoi An Old Quarter',
    year: '2025',
    category: 'detail',
    mediumVi: '35mm Summicron · Phim lưu trữ',
    mediumEn: '35mm Summicron · Archival Film',
    aspect: 'aspect-[4/3]',
    src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=85',
    storyVi: 'Một góc nhìn cận cảnh vào chất vải lanh thô dệt tay bắt trọn ánh nắng 4 giờ chiều len qua khung cửa chớp cổ kính.',
    storyEn: 'A close study of handwoven organic linen catching the 4 PM golden light filtering through vintage louvers.',
  },
  {
    id: 'photo-3',
    titleVi: 'Tiếng cười nơi giếng trời rêu phong',
    titleEn: 'Laughing in the Stucco Courtyard',
    locationVi: 'Sài Gòn, Quận 1',
    locationEn: 'Saigon, District 1',
    year: '2024',
    category: 'portrait',
    mediumVi: 'Phim đen trắng Tri-X · Ánh sáng môi trường',
    mediumEn: '35mm Tri-X Tone · Ambient Flash',
    aspect: 'aspect-[4/3]',
    src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=85',
    storyVi: 'Cơn gió bất chợt thổi qua ban công thời thuộc địa ngay trước khi những hạt mưa đầu mùa rơi xuống mái ngói đỏ.',
    storyEn: 'Spontaneous wind blowing through an open colonial balcony just before rain began to fall upon the tiled rooftops.',
  },
  {
    id: 'photo-4',
    titleVi: 'Rặng thông tĩnh lặng trong sương sớm',
    titleEn: 'Silent Pine Horizons at Dawn',
    locationVi: 'Cao nguyên Đà Lạt, 1.500m',
    locationEn: 'Da Lat Highlands, 1,500m',
    year: '2025',
    category: 'landscape',
    mediumVi: 'Phim khổ rộng Panorama · Sương mờ',
    mediumEn: 'Panoramic Film · Mist & Fog',
    aspect: 'aspect-[21/9]',
    src: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1800&q=85',
    storyVi: 'Bình minh hé rạng trên thung lũng thông Lang Biang. Không khí lành lạnh vùng cao lưu giữ sự tĩnh tại hiếm có nơi phố thị.',
    storyEn: 'Dawn breaking over the pine valleys of Lang Biang. The cool mountain air preserves a quietude rarely found in city life.',
  },
]

export function EditorialGallery() {
  const { language, t } = useLanguage()
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null)
  const [filter, setFilter] = useState<'all' | 'portrait' | 'detail' | 'landscape'>('all')

  const isMatch = (item: PhotoItem) => filter === 'all' || item.category === filter

  const handleNext = () => {
    if (!activePhoto) return
    const idx = GALLERY_PHOTOS.findIndex((p) => p.id === activePhoto.id)
    const nextIdx = (idx + 1) % GALLERY_PHOTOS.length
    setActivePhoto(GALLERY_PHOTOS[nextIdx])
  }

  const handlePrev = () => {
    if (!activePhoto) return
    const idx = GALLERY_PHOTOS.findIndex((p) => p.id === activePhoto.id)
    const prevIdx = (idx - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
    setActivePhoto(GALLERY_PHOTOS[prevIdx])
  }

  return (
    <section id="photography" className="py-24 lg:py-36 border-t border-sand/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-14 border-b border-sand/60">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-light uppercase tracking-[0.28em] text-terracotta">
              {t('01 / LƯU TRỮ NHIẾP ẢNH', '01 / PHOTOGRAPHY ARCHIVE')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
              {t('Nghệ thuật của Khoảnh khắc Thoáng qua', 'The Art of the Ephemeral')}
            </h2>
            <p className="text-sm sm:text-base font-light text-earth/80 leading-relaxed max-w-xl">
              {t(
                'Những cử chỉ không dàn dựng, ngọn gió biển bất chợt và sự chuyển mình tinh tế của ánh sáng tạo nên một đời người. Chúng mình chụp ảnh không gượng ép, để cảm xúc chân thật tự cất lời.',
                'Unstaged gestures, sea breezes, and the subtle shifts in light that define a lifetime. We photograph without rigid choreography, allowing genuine emotion to surface.'
              )}
            </p>
          </div>

          {/* Interactive filter tabs (clean typographic buttons) */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-light tracking-[0.15em] uppercase text-earth">
            {[
              { id: 'all', labelVi: 'Tất cả', labelEn: 'All Plates' },
              { id: 'portrait', labelVi: 'Chân dung', labelEn: 'Portraits' },
              { id: 'detail', labelVi: 'Chi tiết', labelEn: 'Details' },
              { id: 'landscape', labelVi: 'Phong cảnh', labelEn: 'Horizons' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as never)}
                className={`transition-all pb-1 ${
                  filter === tab.id
                    ? 'border-b border-charcoal text-charcoal font-medium'
                    : 'border-b border-transparent text-earth/60 hover:text-charcoal'
                }`}
              >
                {language === 'vi' ? tab.labelVi : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="pt-12 space-y-10 lg:space-y-12">
          {/* Top Asymmetric Pair: 1 Large Vertical + 2 Smaller Stacks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* 1 Large Vertical Image (7 cols) */}
            <div className={`lg:col-span-7 transition-opacity duration-500 ${isMatch(GALLERY_PHOTOS[0]) ? 'opacity-100' : 'opacity-40'}`}>
              <div
                onClick={() => setActivePhoto(GALLERY_PHOTOS[0])}
                className="group relative cursor-pointer overflow-hidden bg-sand/20"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={GALLERY_PHOTOS[0].src}
                    alt={language === 'vi' ? GALLERY_PHOTOS[0].titleVi : GALLERY_PHOTOS[0].titleEn}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#F7F2E9]/80 backdrop-blur-sm p-2 text-charcoal opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                </div>

                {/* Editorial Caption Underneath */}
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-charcoal">
                      {language === 'vi' ? GALLERY_PHOTOS[0].titleVi : GALLERY_PHOTOS[0].titleEn}
                    </h3>
                    <p className="mt-0.5 text-xs font-light text-earth/80">
                      {language === 'vi' ? GALLERY_PHOTOS[0].locationVi : GALLERY_PHOTOS[0].locationEn} · {GALLERY_PHOTOS[0].year}
                    </p>
                  </div>
                  <span className="text-[10px] font-light uppercase tracking-widest text-earth/60 shrink-0">
                    {language === 'vi' ? GALLERY_PHOTOS[0].mediumVi : GALLERY_PHOTOS[0].mediumEn}
                  </span>
                </div>
              </div>
            </div>

            {/* 2 Smaller Images (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8 lg:gap-10">
              {/* Smaller Image 1 */}
              <div
                onClick={() => setActivePhoto(GALLERY_PHOTOS[1])}
                className={`group relative cursor-pointer overflow-hidden bg-sand/20 transition-opacity duration-500 ${isMatch(GALLERY_PHOTOS[1]) ? 'opacity-100' : 'opacity-40'}`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={GALLERY_PHOTOS[1].src}
                    alt={language === 'vi' ? GALLERY_PHOTOS[1].titleVi : GALLERY_PHOTOS[1].titleEn}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#F7F2E9]/80 backdrop-blur-sm p-2 text-charcoal opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <h3 className="font-serif text-lg font-normal text-charcoal">
                    {language === 'vi' ? GALLERY_PHOTOS[1].titleVi : GALLERY_PHOTOS[1].titleEn}
                  </h3>
                  <span className="text-[10px] font-light text-earth/70">
                    {GALLERY_PHOTOS[1].year}
                  </span>
                </div>
              </div>

              {/* Smaller Image 2 */}
              <div
                onClick={() => setActivePhoto(GALLERY_PHOTOS[2])}
                className={`group relative cursor-pointer overflow-hidden bg-sand/20 transition-opacity duration-500 ${isMatch(GALLERY_PHOTOS[2]) ? 'opacity-100' : 'opacity-40'}`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={GALLERY_PHOTOS[2].src}
                    alt={language === 'vi' ? GALLERY_PHOTOS[2].titleVi : GALLERY_PHOTOS[2].titleEn}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#F7F2E9]/80 backdrop-blur-sm p-2 text-charcoal opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <h3 className="font-serif text-lg font-normal text-charcoal">
                    {language === 'vi' ? GALLERY_PHOTOS[2].titleVi : GALLERY_PHOTOS[2].titleEn}
                  </h3>
                  <span className="text-[10px] font-light text-earth/70">
                    {language === 'vi' ? GALLERY_PHOTOS[2].locationVi : GALLERY_PHOTOS[2].locationEn}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Expansive Horizontal Image */}
          <div className={`w-full pt-4 transition-opacity duration-500 ${isMatch(GALLERY_PHOTOS[3]) ? 'opacity-100' : 'opacity-40'}`}>
            <div
              onClick={() => setActivePhoto(GALLERY_PHOTOS[3])}
              className="group relative cursor-pointer overflow-hidden bg-sand/20"
            >
              <div className="relative aspect-[16/7] sm:aspect-[21/9] w-full overflow-hidden">
                <Image
                  src={GALLERY_PHOTOS[3].src}
                  alt={language === 'vi' ? GALLERY_PHOTOS[3].titleVi : GALLERY_PHOTOS[3].titleEn}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-80"
                />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white/95">
                  <div>
                    <p className="text-[10px] font-light uppercase tracking-[0.25em] text-white/70">
                      {t('Khám phá Cao nguyên', 'Highlands Exploration')}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                      {language === 'vi' ? GALLERY_PHOTOS[3].titleVi : GALLERY_PHOTOS[3].titleEn}
                    </h3>
                  </div>
                  <span className="text-xs font-light text-white/80 hidden sm:inline">
                    {language === 'vi' ? GALLERY_PHOTOS[3].locationVi : GALLERY_PHOTOS[3].locationEn} · {language === 'vi' ? GALLERY_PHOTOS[3].mediumVi : GALLERY_PHOTOS[3].mediumEn}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Photo Inspector Lightbox */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-charcoal/90 backdrop-blur-md"
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2"
            aria-label={t('Đóng xem ảnh', 'Close photo viewer')}
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 bg-black/20 hover:bg-black/40 rounded-full"
            aria-label={t('Ảnh trước', 'Previous photo')}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 bg-black/20 hover:bg-black/40 rounded-full"
            aria-label={t('Ảnh sau', 'Next photo')}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="relative max-h-[72vh] w-auto aspect-[4/3] sm:aspect-[3/2] overflow-hidden shadow-2xl">
              <Image
                src={activePhoto.src}
                alt={language === 'vi' ? activePhoto.titleVi : activePhoto.titleEn}
                fill
                className="object-contain"
              />
            </div>

            {/* Note and exif */}
            <div className="mt-6 text-center text-white/90 max-w-xl space-y-2">
              <h3 className="font-serif text-2xl font-normal text-white">
                {language === 'vi' ? activePhoto.titleVi : activePhoto.titleEn}
              </h3>
              <p className="text-xs font-light tracking-[0.2em] text-sand/80 uppercase">
                {language === 'vi' ? activePhoto.locationVi : activePhoto.locationEn} · {activePhoto.year} · {language === 'vi' ? activePhoto.mediumVi : activePhoto.mediumEn}
              </p>
              <p className="text-sm font-light leading-relaxed text-white/75 pt-1">
                {language === 'vi' ? activePhoto.storyVi : activePhoto.storyEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
