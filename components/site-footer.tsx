import { Camera, Mail, Send } from 'lucide-react'
import { Logo } from '@/components/logo'

const COLUMNS = [
  {
    title: 'Sản phẩm',
    links: ['Mẫu thiệp cưới', 'Bảng giá', 'Hướng dẫn tạo thiệp', 'Quản lý khách mời'],
  },
  {
    title: 'Công cụ',
    links: ['Kế hoạch cưới', 'Tạo ảnh báo hỷ', 'Soạn tin nhắn mời', 'Lời chúc đám cưới'],
  },
  {
    title: 'Tài nguyên',
    links: ['Cẩm nang cưới', 'Đánh giá khách hàng', 'Nhà hàng tiệc cưới', 'Trung tâm trợ giúp'],
  },
  {
    title: 'Pháp lý',
    links: ['Thông tin doanh nghiệp', 'Chính sách bảo mật', 'Điều khoản sử dụng', 'Chính sách hoàn tiền'],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <div className="flex items-baseline gap-1.5">
              <Logo showMark />
            </div>
            <p className="mt-4 max-w-xs text-pretty text-sm font-light leading-relaxed text-muted-foreground">
              Làm thiệp cưới online sang trọng, mang dấu ấn riêng. Giữ nét đẹp
              truyền thống, trọn vẹn cảm xúc cho ngày trọng đại.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Camera, label: 'Instagram' },
                { icon: Send, label: 'Telegram' },
                { icon: Mail, label: 'Email' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <s.icon className="h-4 w-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-foreground">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-8 sm:flex-row">
          <p className="text-xs font-light text-muted-foreground">
            © {new Date().getFullYear()} WISPIC. Trao lời yêu thương, theo cách thật riêng.
          </p>
          <p className="text-xs font-light text-muted-foreground">
            Được làm bằng cả trái tim tại Việt Nam.
          </p>
        </div>
      </div>
    </footer>
  )
}
