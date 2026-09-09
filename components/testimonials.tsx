import Image from 'next/image'
import { Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const REVIEWS = [
  {
    name: 'Đặng Thế Bảo',
    initial: 'Đ',
    text: 'Thiệp đẹp, mẫu mã đa dạng, mình chọn được mẫu ưng ý ngay. Chức năng RSVP tiện lắm, biết được bao nhiêu người tới dự. Rất hài lòng.',
  },
  {
    name: 'Vũ Nhân',
    initial: 'V',
    text: 'Rất tiện ích cho các cặp đôi sắp cưới. Giao diện nhẹ nhàng, dễ dùng và nhìn rất sang.',
  },
  {
    name: 'Điều Hoàng',
    initial: 'Đ',
    text: 'Uy tín, đội ngũ hỗ trợ nhiệt tình. Thiệp đủ các kiểu cho mình chọn thoải mái.',
  },
  {
    name: 'Annie Le',
    initial: 'A',
    text: 'Dịch vụ tuyệt vời và những mẫu thiệp cưới rất đẹp. Mình sẽ giới thiệu cho bạn bè.',
  },
  {
    name: 'Nguyễn Thảo Linh',
    initial: 'N',
    text: 'Mẫu thiệp đẹp, admin hỗ trợ nhiệt tình. Mình đặt buổi tối mà vẫn được phản hồi ngay.',
  },
  {
    name: 'QB Đăng Tài',
    initial: 'Q',
    text: 'Dễ dùng, mẫu cũng ok, shop tư vấn tốt. Đáng để thử cho ngày trọng đại.',
  },
]

export function Testimonials() {
  return (
    <section className="wispic-section bg-secondary/40">
      <div className="wispic-container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="wispic-label">
              Lời từ các cặp đôi
            </p>
            <h2 className="wispic-h2">
              Được tin chọn cho ngày trọng đại
            </h2>
            <p className="mt-4 max-w-md text-pretty text-base font-light leading-relaxed text-muted-foreground">
              Những lời nhắn thật lòng từ các cặp đôi đã trao gửi ngày vui của
              mình qua WISPIC.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=88&q=75',
                  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=88&q=75',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=88&q=75',
                ].map((img) => (
                  <span
                    key={img}
                    className="inline-block h-11 w-11 overflow-hidden rounded-full border-2 border-background"
                  >
                    <Image
                      src={img}
                      alt=""
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-tangerine">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-1 text-sm font-light text-muted-foreground">
                  4.9/5 từ hơn 3.200 đánh giá
                </p>
              </div>
            </div>
          </Reveal>

          <div className="columns-1 gap-5 sm:columns-2">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={(i % 2) * 100} className="mb-5 break-inside-avoid">
                <figure className="rounded-lg border border-border/60 bg-card p-6">
                  <div className="flex items-center gap-1 text-tangerine">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-pretty text-sm font-light leading-relaxed text-foreground/90">
                    {r.text}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-terracotta/10 font-serif text-sm text-terracotta">
                      {r.initial}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {r.name}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
