import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const TEMPLATES = [
  {
    name: 'Thanh Vân',
    category: 'Minimal',
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Diễm Hương',
    category: 'Floral',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Nhật Nguyên',
    category: 'Modern',
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'An Nhiên',
    category: 'Film',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Phượng Hoàng',
    category: 'Traditional',
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bảo Ngọc',
    category: 'Elegant',
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
]

export function TemplateShowcase() {
  return (
    <section id="mau-thiep" className="wispic-section">
      <div className="wispic-container">
        <Reveal className="max-w-2xl">
          <p className="wispic-label">Bộ sưu tập</p>
          <h2 className="wispic-h2">Mẫu thiệp cho câu chuyện của bạn</h2>
          <p className="mt-4 text-pretty text-base font-light leading-relaxed text-muted-foreground">
            Chọn một thiết kế phù hợp với phong cách và câu chuyện tình yêu của
            hai bạn. Mỗi mẫu là một cảm hứng riêng, tinh tế đến từng chi tiết.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((tpl, i) => (
            <Reveal as="article" key={tpl.name} delay={i * 80} className="group">
              <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card">
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={tpl.src}
                    alt={`Mẫu thiệp cưới ${tpl.name} — phong cách ${tpl.category}`}
                    width={600}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <a
                  href="#tao-thiep"
                  className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-2 rounded-full bg-background/95 px-5 py-2.5 text-sm font-medium text-foreground opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Xem mẫu
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-border/50 pt-3">
                <h3 className="font-serif text-xl text-foreground">{tpl.name}</h3>
                <span className="text-xs font-light uppercase tracking-widest text-earth">
                  {tpl.category}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <a
            href="#mau-thiep"
            className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-8 py-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Xem tất cả mẫu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}