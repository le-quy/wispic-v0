'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, X } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface JournalArticle {
  id: string
  titleVi: string
  titleEn: string
  authorVi: string
  authorEn: string
  dateVi: string
  dateEn: string
  readTimeVi: string
  readTimeEn: string
  categoryVi: string
  categoryEn: string
  image: string
  pullQuoteVi?: string
  pullQuoteEn?: string
  excerptVi: string
  excerptEn: string
  contentVi: string[]
  contentEn: string[]
}

const FEATURED_ARTICLE: JournalArticle = {
  id: 'essay-light',
  titleVi: 'Về ánh sáng, sự kiên nhẫn và vì sao chúng mình tạo nên những kỷ vật số mang xúc cảm như trang giấy lụa',
  titleEn: 'On Light, Patience, and Why We Build Keepsakes That Feel Like Paper',
  authorVi: 'Nguyễn Hà · Giám đốc Studio',
  authorEn: 'Nguyen Ha · Studio Director',
  dateVi: 'Tháng 10, 2025',
  dateEn: 'October 2025',
  readTimeVi: '6 phút đọc',
  readTimeEn: '6 min read',
  categoryVi: 'Triết lý Studio',
  categoryEn: 'Studio Philosophy',
  image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=85',
  pullQuoteVi: 'Những bức ảnh sâu lắng nhất chưa từng là sản phẩm của sự dàn dựng; chúng được gom nhặt trong khoảng lặng khe khẽ giữa hai câu nói.',
  pullQuoteEn: 'The most enduring images are never posed; they are caught in the quiet breath between words.',
  excerptVi: 'Những suy tư về lý do chúng mình kiên quyết cự tuyệt sự hoàn hảo vô hồn của thuật toán, và vì sao một tấm thiệp cưới online cần lưu giữ linh hồn mộc mạc của kỹ thuật in dập nổi thủ công.',
  excerptEn: 'A reflection on why we resist algorithmic perfection and why a digital wedding invitation must preserve the tactile soul of letterpress printing.',
  contentVi: [
    'Khi chúng mình khởi đầu Wispic, thế giới ngoài kia không hề thiếu các nền tảng công nghệ làm đám cưới. Điều thế giới thiếu khi ấy là sự dịu dàng.',
    'Phần lớn thiệp cưới kỹ thuật số coi tình yêu như một quy trình xử lý biểu mẫu xác nhận khách mời — những chiếc nút bấm nhấp nháy đèn neon hối hả, đồng hồ đếm ngược từng phút đầy áp lực, và những hình họa mẫu lặp lại vô hồn.',
    'Chúng mình tự hỏi: Điều gì sẽ xảy ra nếu một website được thiết kế như một cuốn tạp chí nhiếp ảnh mỹ thuật? Nếu việc mở một tấm thiệp trên màn hình điện thoại cũng mang lại niềm xúc động tĩnh tại như khi mở một phong bao thư giấy cotton thắt dấu sáp niêm phong?',
    'Để hiện thực hóa điều đó, chúng mình quay về những nguyên lý cốt lõi: nghệ thuật chữ chậm rãi, khoảng trắng bao la, hạt nhiễu tự nhiên và những khung hình được chụp với tất cả lòng kiên nhẫn. Bởi vì những ký ức thực sự quan trọng trong đời chưa bao giờ cần sự ồn ào.',
  ],
  contentEn: [
    'When we began Wispic, the world had no shortage of software platforms for weddings. What the world lacked was tenderness.',
    'Most digital invitations treated love as an RSVP logistics pipeline — buttons that pulsed with neon urgency, banners counting down minutes, templates filled with interchangeable clipart.',
    'We asked ourselves: What if a website felt like an editorial photography journal? What if opening an invitation on a phone gave the same quiet thrill as sliding a thick cotton envelope from its wax seal?',
    'To achieve this, we returned to first principles: slow typography, ample whitespace, natural grain, and photographs taken with patience. Because memories that matter are rarely loud.',
  ],
}

const SMALL_ARTICLES: JournalArticle[] = [
  {
    id: 'essay-spaces',
    titleVi: 'Kiến trúc của những buổi lễ riêng tư: 12 không gian tĩnh lặng khắp Việt Nam',
    titleEn: 'The Architecture of Quiet Ceremonies: 12 intimate spaces across Vietnam',
    authorVi: 'Ban Biên tập',
    authorEn: 'Editorial Desk',
    dateVi: 'Tháng 09, 2025',
    dateEn: 'September 2025',
    readTimeVi: '4 phút đọc',
    readTimeEn: '4 min read',
    categoryVi: 'Không gian & Kiến trúc',
    categoryEn: 'Architecture',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    excerptVi: 'Từ những khoảnh sân giếng trời cổ kính tại Hội An đến quán trà tĩnh tại bên sườn đồi thông Đà Lạt: những chốn bình yên được thiết kế cho ngày vui dưới 50 khách.',
    excerptEn: 'From restored colonial courtyards in Hoi An to cliffside tea pavilions in Da Lat: sanctuaries designed for gatherings under 50 guests.',
    contentVi: [
      'Quy mô quyết định mức độ thân mật. Khi một buổi lễ được chuẩn bị cho hai mươi người thay vì năm trăm người, mối tương quan giữa con người và không gian được biến đổi hoàn toàn.',
      'Trong khảo sát điền dã này, các nhiếp ảnh gia của chúng mình ghi lại 12 không gian nơi kiến trúc tự lùi lại phía sau để thiên nhiên và giọng nói của hai bạn trở thành tâm điểm.',
    ],
    contentEn: [
      'Scale dictates intimacy. When a ceremony is planned for twenty people rather than five hundred, the relationship to space transforms entirely.',
      'In this field survey, our photographers document twelve spaces where architecture steps back to let nature and voices take center stage.',
    ],
  },
  {
    id: 'essay-craft',
    titleVi: 'Cẩm nang đón nhận ánh sáng tự nhiên: Ghi chép từ phòng tối Wispic',
    titleEn: 'A Guide to Natural Light: Notes from our studio darkroom',
    authorVi: 'Vũ Lê · Nhiếp ảnh gia Chủ trì',
    authorEn: 'Vu Le · Lead Photographer',
    dateVi: 'Tháng 08, 2025',
    dateEn: 'August 2025',
    readTimeVi: '3 phút đọc',
    readTimeEn: '3 min read',
    categoryVi: 'Kỹ nghệ & Phim',
    categoryEn: 'Craft & Film',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
    excerptVi: 'Thấu hiểu sự khác biệt giữa ánh nắng gắt gỏng ban trưa và sắc vàng hổ phách dịu dàng, bao dung của hoàng hôn miền biển.',
    excerptEn: 'Understanding the difference between harsh direct midday sun and the diffuse, forgiving amber of coastal dusk.',
    contentVi: [
      'Ánh sáng không chỉ đơn thuần là độ chiếu sáng vật lý; ánh sáng là nhiệt độ cảm xúc của một bức ảnh.',
      'Dưới đây là 5 gợi ý thực tế dành cho các cặp đôi khi sắp xếp thời gian chụp chân dung ngoài trời nhằm tận dụng tối đa ánh sáng môi trường tự nhiên mà không cần đến ánh đèn flash nhân tạo chói lóa.',
    ],
    contentEn: [
      'Light is not merely illumination; it is the emotional temperature of a photograph.',
      'Here are five practical recommendations for couples scheduling outdoor portraits to make the most of natural ambient light without artificial strobes.',
    ],
  },
]

export function EditorialJournal() {
  const { language, t } = useLanguage()
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null)

  return (
    <section id="journal" className="py-24 lg:py-36 border-t border-sand/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-sand/60">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-light uppercase tracking-[0.28em] text-terracotta">
              {t('05 / TẠP CHÍ BIÊN TẬP', '05 / THE JOURNAL')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
              {t('Tiểu luận về Ánh sáng, Ký ức & Lễ cưới', 'Essays on Light, Memory & Ceremony')}
            </h2>
            <p className="text-sm sm:text-base font-light text-earth/80 leading-relaxed">
              {t(
                'Những suy tư từ các nhiếp ảnh gia, nghệ nhân in ấn và nhóm thiết kế Wispic về nghệ thuật nắm bắt sự kết nối giữa người với người không chút khiên cưỡng.',
                'Reflections from our photographers, printers, and design team on the craft of capturing human connection without artifice.'
              )}
            </p>
          </div>

          <div className="text-[11px] font-light uppercase tracking-[0.2em] text-earth/70">
            {t('Ấn phẩm Wispic · Định kỳ', 'Wispic Publications · Quarterly')}
          </div>
        </div>

        {/* Magazine Editorial Spread */}
        <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Large Featured Article */}
          <article
            onClick={() => setSelectedArticle(FEATURED_ARTICLE)}
            className="lg:col-span-7 group cursor-pointer space-y-6"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/30 shadow-[0_20px_50px_-20px_rgba(41,37,34,0.2)]">
              <Image
                src={FEATURED_ARTICLE.image}
                alt={language === 'vi' ? FEATURED_ARTICLE.titleVi : FEATURED_ARTICLE.titleEn}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-60"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-tangerine" />
                <span>{t('Bài viết Tiêu điểm', 'Featured Essay')}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[11px] font-light uppercase tracking-[0.2em] text-earth/80">
                <span>{language === 'vi' ? FEATURED_ARTICLE.categoryVi : FEATURED_ARTICLE.categoryEn}</span>
                <span>·</span>
                <span>{language === 'vi' ? FEATURED_ARTICLE.authorVi : FEATURED_ARTICLE.authorEn}</span>
                <span>·</span>
                <span>{language === 'vi' ? FEATURED_ARTICLE.readTimeVi : FEATURED_ARTICLE.readTimeEn}</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal group-hover:text-terracotta transition-colors leading-snug">
                {language === 'vi' ? FEATURED_ARTICLE.titleVi : FEATURED_ARTICLE.titleEn}
              </h3>

              {(FEATURED_ARTICLE.pullQuoteVi || FEATURED_ARTICLE.pullQuoteEn) && (
                <blockquote className="border-l-2 border-terracotta pl-4 py-1 italic font-serif text-lg text-charcoal/90">
                  &ldquo;{language === 'vi' ? FEATURED_ARTICLE.pullQuoteVi : FEATURED_ARTICLE.pullQuoteEn}&rdquo;
                </blockquote>
              )}

              <p className="text-sm font-light leading-relaxed text-earth/90">
                {language === 'vi' ? FEATURED_ARTICLE.excerptVi : FEATURED_ARTICLE.excerptEn}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-charcoal group-hover:text-terracotta">
                <span>{t('Đọc toàn bộ bài viết', 'Read Full Essay')}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </article>

          {/* Two Smaller Editorial Stories */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-10">
            {SMALL_ARTICLES.map((article) => (
              <article
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group cursor-pointer border-b border-sand/70 pb-8 space-y-4"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-sand/30">
                  <Image
                    src={article.image}
                    alt={language === 'vi' ? article.titleVi : article.titleEn}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-3 left-3 text-[10px] font-light uppercase tracking-widest text-white/90 bg-charcoal/60 px-2 py-0.5">
                    {language === 'vi' ? article.categoryVi : article.categoryEn}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-light uppercase tracking-[0.2em] text-earth/70">
                    <span>{language === 'vi' ? article.dateVi : article.dateEn}</span>
                    <span>·</span>
                    <span>{language === 'vi' ? article.readTimeVi : article.readTimeEn}</span>
                  </div>

                  <h4 className="font-serif text-2xl font-normal text-charcoal group-hover:text-terracotta transition-colors leading-snug">
                    {language === 'vi' ? article.titleVi : article.titleEn}
                  </h4>

                  <p className="text-xs font-light text-earth/80 line-clamp-2 leading-relaxed">
                    {language === 'vi' ? article.excerptVi : article.excerptEn}
                  </p>

                  <div className="pt-2 flex items-center gap-1.5 text-xs font-light uppercase tracking-[0.14em] text-charcoal">
                    <span>{t('Đọc bài viết', 'Explore Article')}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-charcoal/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#FAF7F2] p-8 sm:p-12 shadow-2xl border border-sand">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 text-charcoal/60 hover:text-charcoal p-1 transition-colors"
              aria-label={t('Đóng bài viết', 'Close article')}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-[11px] font-light uppercase tracking-[0.24em] text-terracotta">
                <span>{language === 'vi' ? selectedArticle.categoryVi : selectedArticle.categoryEn}</span>
                <span>·</span>
                <span>{language === 'vi' ? selectedArticle.authorVi : selectedArticle.authorEn}</span>
                <span>·</span>
                <span>{language === 'vi' ? selectedArticle.readTimeVi : selectedArticle.readTimeEn}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal leading-tight">
                {language === 'vi' ? selectedArticle.titleVi : selectedArticle.titleEn}
              </h2>

              <div className="relative aspect-[16/9] w-full overflow-hidden my-4">
                <Image
                  src={selectedArticle.image}
                  alt={language === 'vi' ? selectedArticle.titleVi : selectedArticle.titleEn}
                  fill
                  className="object-cover"
                />
              </div>

              {(selectedArticle.pullQuoteVi || selectedArticle.pullQuoteEn) && (
                <blockquote className="border-l-2 border-terracotta pl-4 py-2 italic font-serif text-xl text-charcoal">
                  &ldquo;{language === 'vi' ? selectedArticle.pullQuoteVi : selectedArticle.pullQuoteEn}&rdquo;
                </blockquote>
              )}

              <div className="space-y-4 pt-2 text-sm font-light text-charcoal/90 leading-relaxed">
                {(language === 'vi' ? selectedArticle.contentVi : selectedArticle.contentEn).map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="pt-6 border-t border-sand/60 flex items-center justify-between text-xs text-earth/70">
                <span>{t('Tạp chí Biên tập Wispic', 'Wispic Editorial Journal')}</span>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
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
