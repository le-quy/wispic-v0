import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function FinalCta() {
  return (
    <section id="tao-thiep" className="scroll-mt-24 px-5 pb-20 md:px-8 md:pb-28">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85"
            alt="Cặp đôi trong khoảnh khắc lãng mạn dưới ánh sáng ấm"
            width={1600}
            height={900}
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(41,37,34,0.82), rgba(89,66,56,0.4) 70%, rgba(41,37,34,0.1))',
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl px-8 py-14 md:px-14 md:py-20">
              <p className="text-xs font-light uppercase tracking-[0.3em] text-white/60">
                WISPIC — Ghi dấu cảm xúc
              </p>
              <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
                Bắt đầu kể câu chuyện của hai bạn
              </h2>
              <p className="mt-5 max-w-md text-pretty text-base font-light leading-relaxed text-white/80">
                Tạo chiếc thiệp cưới đầu tiên của bạn ngay hôm nay — miễn phí,
                đẹp và trọn vẹn cảm xúc.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#tao-thiep"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-tangerine px-8 py-4 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
                >
                  Tạo thiệp miễn phí
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#mau-thiep"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Xem mẫu thiệp
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}