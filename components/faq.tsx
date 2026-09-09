'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

const FAQS = [
  {
    q: 'Thiệp cưới online là gì?',
    a: 'Thiệp cưới online là phiên bản điện tử của thiệp cưới truyền thống, được gửi qua đường link. Khách mời có thể xem thông tin, hình ảnh, bản đồ và xác nhận tham dự ngay trên điện thoại.',
  },
  {
    q: 'Làm thế nào để tạo thiệp cưới online?',
    a: 'Bạn chỉ cần chọn một mẫu thiệp, điền thông tin và hình ảnh của mình, rồi xuất bản. Toàn bộ quá trình diễn ra ngay trên trình duyệt, không cần kỹ năng thiết kế.',
  },
  {
    q: 'Chi phí tạo thiệp cưới online là bao nhiêu?',
    a: 'Bạn có thể tạo và xem trước thiệp hoàn toàn miễn phí. Chỉ khi muốn xuất bản với đầy đủ tính năng cao cấp, bạn mới cần nâng cấp — và luôn xem được thành phẩm trước khi thanh toán.',
  },
  {
    q: 'Tôi có cần biết thiết kế hay lập trình không?',
    a: 'Hoàn toàn không. WISPIC được thiết kế để bất kỳ ai cũng có thể tạo một chiếc thiệp đẹp chỉ trong vài phút, với các mẫu đã được tuyển chọn kỹ lưỡng.',
  },
  {
    q: 'Tôi có thể chỉnh sửa sau khi đã xuất bản không?',
    a: 'Có. Bạn có thể chỉnh sửa thông tin bất cứ lúc nào, và thay đổi sẽ được cập nhật ngay trên đường link mà khách mời đang xem.',
  },
  {
    q: 'Tôi có thể gửi thiệp cho tối đa bao nhiêu người?',
    a: 'Không giới hạn. Bạn có thể chia sẻ đường link thiệp đến bao nhiêu khách mời tùy thích qua Messenger, Zalo, Facebook hoặc bất kỳ kênh nào.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="cam-nang" className="wispic-section">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Reveal className="text-center">
          <p className="wispic-label">Giải đáp</p>
          <h2 className="wispic-h2 mx-auto max-w-xl">Câu hỏi thường gặp</h2>
        </Reveal>

        <div className="mt-12 divide-y divide-border/70 border-y border-border/70">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} delay={i * 50}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-pretty font-serif text-lg text-foreground md:text-xl">
                      {item.q}
                    </span>
                    <Plus
                      className={cn(
                        'h-5 w-5 shrink-0 text-primary transition-transform duration-300',
                        isOpen && 'rotate-45',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-10 text-pretty text-sm font-light leading-relaxed text-muted-foreground md:text-base">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
