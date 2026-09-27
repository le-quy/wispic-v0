import { notFound } from 'next/navigation'
import { getPublishedWeddingBySlug } from '@/lib/wedding-public'
import { toWeddingData } from '@/lib/wedding-mapper'
import { isSystemTemplate, renderWeddingTemplate } from '@/lib/template-registry'
import { renderCustomTemplate, renderTemplateSections } from '@/lib/template-engine'
import type { TemplateSection } from '@/lib/template-sections'

export const dynamic = 'force-dynamic'

/**
 * Thiệp cưới public theo slug: `/w/wis-paoziiee`.
 *
 * Server component đọc thẳng DB nên lần mở đầu không phải chờ API, và bản
 * nháp không bao giờ lọt ra ngoài — `getPublishedWeddingBySlug` luôn kèo điều
 * kiện `status = 'PUBLISHED'`.
 */
export default async function PublicWeddingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const result = await getPublishedWeddingBySlug(slug)
  if (!result) notFound()

  const { wedding, template } = result
  const data = toWeddingData(wedding)

  // Mẫu hệ thống: khoá registry ('romantic' | 'modern' | 'traditional').
  const templateKey = wedding.templateKey ?? ''
  if (isSystemTemplate(templateKey)) {
    return renderWeddingTemplate(templateKey, data, undefined, true)
  }

  // Mẫu custom: HTML/CSS do admin soạn, dựng server-side rồi nhúng iframe.
  if (template) {
    const sections = (template.sections ?? []) as TemplateSection[]
    const html = sections.length
      ? renderTemplateSections(sections, template.css ?? '', data)
      : renderCustomTemplate(template.html ?? '', template.css ?? '', data)

    return (
      <iframe
        srcDoc={html}
        title={wedding.title}
        className="h-screen w-full border-0"
        sandbox="allow-same-origin allow-scripts"
      />
    )
  }

  // Mẫu đã xoá khỏi DB: vẫn hiển thị bằng mẫu hệ thống mặc định thay vì 404
  // — thiệp đã xuất bản và được khách xem là không nên sập vì admin dọn mẫu.
  return renderWeddingTemplate('romantic', data, undefined, true)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await getPublishedWeddingBySlug(slug)
  if (!result) return { title: 'Không tìm thấy thiệp' }

  const { wedding } = result
  const names = `${wedding.groom || ''} & ${wedding.bride || ''}`.trim()
  const title = names || wedding.title

  return {
    title,
    description: wedding.introduction || undefined,
    openGraph: {
      title,
      description: wedding.introduction || undefined,
      images: wedding.couplePhoto?.url ? [{ url: wedding.couplePhoto.url }] : undefined,
    },
  }
}
