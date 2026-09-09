import { Reveal } from '@/components/reveal'

const STEPS = [
  {
    no: '01',
    title: 'Chọn mẫu',
    desc: 'Chọn thiết kế phù hợp với phong cách của hai bạn từ bộ sưu tập được tuyển chọn.',
  },
  {
    no: '02',
    title: 'Cá nhân hóa',
    desc: 'Thêm thông tin, hình ảnh, câu chuyện và những điều đặc biệt của ngày cưới.',
  },
  {
    no: '03',
    title: 'Chia sẻ',
    desc: 'Xuất bản và gửi lời mời đến những người bạn yêu thương chỉ trong một chạm.',
  },
]

export function HowItWorks() {
  return (
    <section id="cach-hoat-dong" className="wispic-section">
      <div className="wispic-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="wispic-label">Đơn giản &amp; nhẹ nhàng</p>
          <h2 className="wispic-h2">Tạo thiệp chỉ trong 3 bước</h2>
        </Reveal>

        <div className="relative mt-16">
          {/* connecting line (desktop) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />

          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.no} delay={i * 120} className="relative">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <span className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background font-serif text-2xl text-primary">
                    {step.no}
                  </span>
                  <h3 className="mt-6 font-serif text-2xl text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-pretty text-sm font-light leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
