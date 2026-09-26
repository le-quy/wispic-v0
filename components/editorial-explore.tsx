'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, X } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface ExploreStory {
  id: string
  tagVi: string
  tagEn: string
  titleVi: string
  titleEn: string
  subtitleVi: string
  subtitleEn: string
  locationVi: string
  locationEn: string
  readTimeVi: string
  readTimeEn: string
  cover: string
  excerptVi: string
  excerptEn: string
  bodyVi: string[]
  bodyEn: string[]
}

const EXPLORE_STORIES: ExploreStory[] = [
  {
    id: 'story-travel',
    tagVi: 'Du hành',
    tagEn: 'Travel',
    titleVi: 'Nơi vách đá chạm tới chân trời',
    titleEn: 'Where Limestone Meets the Sky',
    subtitleVi: 'Ninh Bình & Những thung lũng miền Bắc tĩnh mịch',
    subtitleEn: 'Ninh Binh & The Quiet Northern Valleys',
    locationVi: 'Tràng An, Ninh Bình',
    locationEn: 'Trang An, Ninh Binh',
    readTimeVi: '4 phút đọc',
    readTimeEn: '4 min read',
    cover: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85',
    excerptVi: 'Lướt thuyền trên làn nước ngọc bích trước bình minh, nơi những ngọn núi karst sừng sững phản chiếu trong sự tĩnh lặng tuyệt đối.',
    excerptEn: 'Drifting along emerald waters before dawn, where towering karst mountains reflect in perfect stillness.',
    bodyVi: [
      'Du hành cùng Wispic chưa bao giờ là cuộc vội vã giữa những điểm check-in danh thắng. Đó là trải nghiệm quan sát cách ánh sáng chạm vào mặt đất khi vạn vật vẫn còn đang chìm trong giấc ngủ.',
      'Tại Ninh Bình, trước khi những mái chèo du lịch khua nước, những vách đá vôi nhô lên qua màn sương sớm như bức tranh thủy mặc trên nền lụa thô. Tiếng nước khẽ vỗ vào đám lau sậy là nhịp điệu duy nhất.',
      'Chúng mình dành ba ngày ghi chép lại sự chuyển giao từ bình minh ẩm ướt đến hoàng hôn dát vàng. Nơi đây, các cặp đôi tìm thấy chốn cất lên lời hẹn thề không cần khán giả — chỉ có đá, trời xanh và làn nước biếc.',
    ],
    bodyEn: [
      'Travel for Wispic is never about rushing between landmarks. It is an exercise in seeing how light touches earth when the world is still waking.',
      'In Ninh Binh, before the tour skiffs unlock their oars, the limestone cliffs emerge through morning mist like ink wash paintings on raw silk. The sound of water lapping against river reeds is the only tempo.',
      'We spent three days documenting the slow transition from damp dawn to golden dusk. Here, couples can find places to speak their promises without an audience — just stone, sky, and emerald water.',
    ],
  },
  {
    id: 'story-locations',
    tagVi: 'Địa điểm',
    tagEn: 'Locations',
    titleVi: 'Những chốn an trú bằng vôi vữa bên biển An Bàng',
    titleEn: 'The Stucco Sanctuaries of An Bang',
    subtitleVi: 'Kiến trúc mở đón gió trời và bóng râm tự nhiên',
    subtitleEn: 'Architecture designed for wind and natural shade',
    locationVi: 'Bờ biển Quảng Nam',
    locationEn: 'Quang Nam Coast',
    readTimeVi: '3 phút đọc',
    readTimeEn: '3 min read',
    cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    excerptVi: 'Tuyển tập biệt thự ven biển và khu vườn rợp mát lý tưởng cho những lễ cưới thân mật dưới 50 khách mời.',
    excerptEn: 'A curated selection of private coastal villas and shaded gardens ideal for ceremonies under 50 guests.',
    bodyVi: [
      'Những buổi lễ kỷ niệm đương đại dường như đã vượt ra ngoài không gian của các sảnh tiệc dát vàng ngột ngạt. Những không gian chạm đến cảm xúc hôm nay đều mang kích thước vừa vặn với con người, được dựng xây từ vật liệu biết thở như vữa vôi thô, gỗ tếch tái chế và gạch nung xốp.',
      'Dọc dải ven biển giữa Đà Nẵng và Hội An, một ngôn ngữ kiến trúc mới đã thành hình: những căn biệt thự mở toang đón làn gió đại dương, nơi khách mời có thể đi chân trần từ sân tiệc bước thẳng ra bờ cát trắng mịn.',
      'Wispic lưu giữ một danh mục độc quyền những chốn riêng tư và tư dinh mà chủ nhân chỉ mở cửa cho những dự án nghệ thuật biên tập và những buổi trao lời thề kín đáo.',
    ],
    bodyEn: [
      'Contemporary celebrations have outgrown gilded banquet halls. The spaces that resonate today are human in scale, built with breathing materials like raw lime plaster, reclaimed teak, and porous terracotta tiles.',
      'Along the coastal corridor between Da Nang and Hoi An, a new vernacular has emerged: villas that open completely to oceanic breezes, where guests walk barefoot from the reception courtyard to the sand.',
      'Wispic maintains an exclusive archive of venues and private homes whose owners open their doors exclusively for editorial productions and intimate vows.',
    ],
  },
  {
    id: 'story-human',
    tagVi: 'Ký ức',
    tagEn: 'Stories',
    titleVi: 'Lời hẹn ước bên triền thông reo',
    titleEn: 'A Vow at the Edge of the Pines',
    subtitleVi: 'Buổi sum họp tháng 11 ấm cúng của Minh & Lan',
    subtitleEn: 'Minh & Lan’s quiet November gathering',
    locationVi: 'Hồ Tuyền Lâm, Đà Lạt',
    locationEn: 'Tuyen Lam Lake, Da Lat',
    readTimeVi: '5 phút đọc',
    readTimeEn: '5 min read',
    cover: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
    excerptVi: 'Hai mươi tư khách mời, một cây đàn cello mộc và lời hứa cất lên giữa hương thông nồng nàn tháng 11.',
    excerptEn: 'Twenty-four guests, a single acoustic cello, and promises made amidst damp November pine fragrance.',
    bodyVi: [
      '“Tụi mình không muốn một buổi trình diễn,” Lan chia sẻ khi gặp chúng mình tại xưởng rang cà phê nhỏ ở Sài Gòn. “Tụi mình muốn một ngày mà tất cả những người thân yêu có thể nghe rõ giọng nói của nhau.”',
      'Buổi lễ diễn ra trên sườn đồi cỏ nhìn ra mặt hồ Tuyền Lâm phẳng lặng. Thay vì tờ chương trình in hàng loạt, khách mời nhận được tấm thiệp bằng giấy cotton dập nổi kèm đường link kỷ vật số do Wispic thiết kế riêng.',
      'Khi hoàng hôn buông xuống, những ngọn đèn bão được thắp sáng dọc hiên gỗ. Những bức ảnh đêm hôm ấy vẫn là tác phẩm chúng mình trân quý nhất — không vì sự tráng lệ, mà vì sự chân thành không tì vết.',
    ],
    bodyEn: [
      '“We did not want a performance,” Lan told us when we first met at a small coffee roastery in Saigon. “We wanted a day where everyone we love could hear our voices clearly.”',
      'The ceremony took place on a grassy knoll overlooking Tuyen Lam Lake. Instead of printed programs, guests received hand-pressed cotton invitations created with Wispic’s digital keepsake companion.',
      'As evening descended, kerosene lanterns were lit along the wooden deck. The photographs from that evening remain among our most cherished works — not for their grandiosity, but for their utter honesty.',
    ],
  },
]

export function EditorialExplore() {
  const { language, t } = useLanguage()
  const [activeStory, setActiveStory] = useState<ExploreStory | null>(null)

  return (
    <section id="explore" className="py-24 lg:py-36 border-t border-sand/70 bg-[#F4EFE6]/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-sand/60">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-terracotta">
              {t('ĐỊA ĐIỂM & ĐIỂM ĐẾN', 'DESTINATIONS & VENUES')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
              {t('Những Điểm Chụp Ảnh Cưới Tuyệt Đẹp', 'Scenic Wedding Destinations')}
            </h2>
            <p className="text-sm sm:text-base font-light text-earth/80 leading-relaxed">
              {t(
                'Từ bình minh trên đồi thông Đà Lạt, hoàng hôn biển cát An Bàng đến vẻ cổ kính của phố cổ Hội An. Những điểm đến lý tưởng để hai bạn vừa du lịch vừa ghi lại bộ ảnh cưới để đời.',
                'From highland sunrise in Da Lat pine forests to golden dusk along An Bang coast and vintage alleys in Hoi An. Ideal destinations for unforgettable wedding getaways.'
              )}
            </p>
          </div>

          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-terracotta">
            {t('Hội An · Đà Lạt · Ninh Bình · Phú Quốc', 'Hoi An · Da Lat · Ninh Binh · Phu Quoc')}
          </div>
        </div>

        {/* 3 Large Editorial Vignettes */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {EXPLORE_STORIES.map((story) => (
            <article
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Large Editorial Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand/30 shadow-[0_16px_40px_-20px_rgba(41,37,34,0.18)]">
                  <Image
                    src={story.cover}
                    alt={language === 'vi' ? story.titleVi : story.titleEn}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  />

                  {/* Top tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-tangerine" />
                    <span>{language === 'vi' ? story.tagVi : story.tagEn}</span>
                    <span>·</span>
                    <span>{language === 'vi' ? story.readTimeVi : story.readTimeEn}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[11px] font-light text-white/80">
                      {language === 'vi' ? story.locationVi : story.locationEn}
                    </p>
                  </div>
                </div>

                {/* Text Content */}
                <div className="mt-5 space-y-2">
                  <h3 className="font-serif text-2xl font-normal text-charcoal group-hover:text-terracotta transition-colors leading-snug">
                    {language === 'vi' ? story.titleVi : story.titleEn}
                  </h3>
                  <p className="text-xs font-light text-earth/80 line-clamp-2 leading-relaxed">
                    {language === 'vi' ? story.excerptVi : story.excerptEn}
                  </p>
                </div>
              </div>

              {/* Read Story link */}
              <div className="mt-4 pt-3 border-t border-sand/40 flex items-center justify-between text-xs font-light tracking-[0.16em] uppercase text-charcoal/80 group-hover:text-charcoal">
                <span>{t('Đọc bài viết', 'Read Story')}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Story Reader Modal */}
      {activeStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-charcoal/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#FAF7F2] p-8 sm:p-12 shadow-2xl border border-sand">
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-6 right-6 text-charcoal/60 hover:text-charcoal p-1 transition-colors"
              aria-label={t('Đóng bài viết', 'Close story')}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-[11px] font-light uppercase tracking-[0.24em] text-terracotta">
                <span>{language === 'vi' ? activeStory.tagVi : activeStory.tagEn}</span>
                <span>·</span>
                <span>{language === 'vi' ? activeStory.locationVi : activeStory.locationEn}</span>
                <span>·</span>
                <span>{language === 'vi' ? activeStory.readTimeVi : activeStory.readTimeEn}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal leading-tight">
                {language === 'vi' ? activeStory.titleVi : activeStory.titleEn}
              </h2>
              <p className="font-serif italic text-lg text-earth">
                {language === 'vi' ? activeStory.subtitleVi : activeStory.subtitleEn}
              </p>

              <div className="relative aspect-[16/9] w-full overflow-hidden my-4">
                <Image
                  src={activeStory.cover}
                  alt={language === 'vi' ? activeStory.titleVi : activeStory.titleEn}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4 pt-2 text-sm font-light text-charcoal/90 leading-relaxed">
                {(language === 'vi' ? activeStory.bodyVi : activeStory.bodyEn).map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="pt-6 border-t border-sand/60 flex items-center justify-between text-xs text-earth/70">
                <span>Wispic Editorial Archive · 2025</span>
                <button
                  type="button"
                  onClick={() => setActiveStory(null)}
                  className="border-b border-charcoal text-charcoal pb-0.5 uppercase tracking-widest text-[11px]"
                >
                  {t('Đóng', 'Close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
