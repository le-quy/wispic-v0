import Image from 'next/image'
import { BookHeart, Users, Smartphone, Share2 } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const FEATURES = [
  {
    icon: BookHeart,
    title: 'Thiệp mang câu chuyện của riêng bạn',
    desc: 'Thêm chuyện tình, ảnh cưới, dòng thời gian và những lời nhắn thật lòng — để mỗi tấm thiệp là một chương của hai bạn.',
  },
  {
    icon: Users,
    title: 'Quản lý khách mời dễ dàng',
    desc: 'Gửi lời mời, theo dõi RSVP, nắm số người tham dự và quản lý danh sách khách gọn gàng trong một nơi.',
  },
  {
    icon: Smartphone,
    title: 'Đẹp trên mọi thiết bị',
    desc: 'Thiệp hiển thị tinh tế và trọn vẹn trên điện thoại, máy tính bảng và màn hình lớn.',
  },
  {
    icon: Share2,
    title: 'Chia sẻ trong một chạm',
    desc: 'Gửi thiệp qua Messenger, Zalo, Facebook hoặc một đường link duy nhất — nhanh gọn, lịch thiệp.',
  },
]

export function Features() {
  return (
    <section id="tinh-nang" className="wispic-section bg-secondary/40">
      <div className="wispic-container">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Visual */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-sm lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-[0_24px_60px_-40px_rgba(41,37,34,0.4)]">
                <Image
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85"
                  alt="Cặp đôi hạnh phúc trong ảnh cưới ấm áp"
                  width={640}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 max-w-[13rem] rounded-lg border border-border/70 bg-card/95 p-4 shadow-[0_16px_40px_-24px_rgba(41,37,34,0.35)] md:-left-8">
                <p className="font-serif text-sm italic text-earth">
                  “Chuyện của hai đứa, kể theo cách của riêng mình.”
                </p>
              </div>
            </div>
          </Reveal>

          {/* Copy + features */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="wispic-label">Trải nghiệm WISPIC</p>
              <h2 className="wispic-h2">Không chỉ là một chiếc thiệp.</h2>
              <p className="mt-4 max-w-lg text-pretty text-base font-light leading-relaxed text-muted-foreground">
                WISPIC gói trọn câu chuyện, hình ảnh và cảm xúc của ngày cưới
                vào một trải nghiệm được chăm chút như tác phẩm nhiếp ảnh.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <Reveal as="article" key={f.title} delay={i * 90} className="h-full">
                  <div className="flex h-full flex-col gap-4 bg-card p-6 transition-colors hover:bg-background">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                      <f.icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="font-serif text-xl leading-snug text-foreground">
                      {f.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
