import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-32">
      {/* soft backdrop wash — Terracotta, rất nhạt */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 82% 15%, rgba(169,87,63,0.10), transparent 70%), radial-gradient(50% 40% at 8% 85%, rgba(217,120,50,0.07), transparent 70%)',
        }}
      />

      <div className="wispic-container grid items-center gap-12 pb-16 md:grid-cols-[1.05fr_1fr] md:gap-10 md:pb-24 lg:gap-16">
        {/* Copy */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card px-4 py-1.5 text-xs font-light uppercase tracking-[0.22em] text-earth">
            <span className="h-1 w-1 rounded-full bg-tangerine" aria-hidden />
            Nhiếp ảnh · Thiệp cưới online
          </span>

          <h1 className="mt-6 text-balance font-serif text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Trao lời yêu thương,
            <br />
            <span className="italic text-terracotta">theo cách thật riêng.</span>
          </h1>

          <p className="mt-6 max-w-md text-pretty text-base font-light leading-relaxed text-muted-foreground md:text-lg">
            Tạo một chiếc thiệp cưới online đẹp, tinh tế và mang dấu ấn riêng của
            hai bạn — được chăm chút như một tác phẩm của studio nhiếp ảnh.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/dashboard/create"
              className="wispic-btn-primary group px-7 py-4"
            >
              Tạo thiệp miễn phí
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a href="#mau-thiep" className="wispic-btn-outline px-7 py-4">
              Khám phá mẫu thiệp
            </a>
          </div>

          <dl className="mt-12 flex items-center gap-8 border-t border-border/70 pt-6">
            <div>
              <dt className="text-xs font-light uppercase tracking-widest text-earth">
                Mẫu thiết kế
              </dt>
              <dd className="mt-1 font-serif text-2xl text-foreground">120+</dd>
            </div>
            <div className="h-8 w-px bg-border" aria-hidden />
            <div>
              <dt className="text-xs font-light uppercase tracking-widest text-earth">
                Cặp đôi tin chọn
              </dt>
              <dd className="mt-1 font-serif text-2xl text-foreground">15.000+</dd>
            </div>
          </dl>
        </div>

        {/* Photography — editorial portrait */}
        <div
          className={cn(
            'animate-fade-up [animation-delay:150ms] relative mx-auto w-full max-w-md',
          )}
        >
          {/* offset frame */}
          <div
            aria-hidden
            className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-terracotta/25 md:-right-6 md:-top-6 md:h-32 md:w-32"
          />
          <div className="relative overflow-hidden rounded-[1.25rem] border border-border/60 shadow-[0_24px_60px_-36px_rgba(41,37,34,0.4)]">
            <Image
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85"
              alt="Cặp đôi trong ảnh cưới phong cách editorial, ánh sáng tự nhiên ấm áp"
              width={720}
              height={900}
              priority
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(41,37,34,0.4), transparent 45%)',
              }}
            />
            <figcaption className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <span className="font-serif text-lg italic text-white/95">
                Minh &amp; Lan
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-light uppercase tracking-widest text-white backdrop-blur-sm">
                12.10.2026
              </span>
            </figcaption>
          </div>
        </div>
      </div>
    </section>
  )
}