import type { ReactNode } from 'react'
import RomanticTemplate from '@/components/wedding/romantic-template'
import ModernTemplate from '@/components/wedding/modern-template'
import TraditionalTemplate from '@/components/wedding/traditional-template'
import type { WeddingData } from '@/lib/wedding-data'

export type TemplateMeta = {
  id: string
  name: string
  category: string
  description: string
  swatches: [string, string]
  accent: string
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'romantic',
    name: 'Lãng mạn',
    category: 'Editorial',
    description: 'Serif duyên dáng, ảnh toàn màn hình, phong cách nhiếp ảnh.',
    swatches: ['#f7f3ee', '#302b27'],
    accent: '#9b8878',
  },
  {
    id: 'modern',
    name: 'Thanh xuân',
    category: 'Hiện đại',
    description: 'Bố cục lệch tối giản, trắng – than và điểm nhấn cam đất.',
    swatches: ['#fbfaf7', '#1f1d1b'],
    accent: '#d97832',
  },
  {
    id: 'traditional',
    name: 'Song Hỷ',
    category: 'Truyền thống',
    description: 'Đỏ son – vàng kim, kính mời song thân, nét Việt trang trọng.',
    swatches: ['#7d1f1f', '#e8c15a'],
    accent: '#c9a227',
  },
]

export function getTemplate(id: string): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}

export function isSystemTemplate(id: string): boolean {
  return TEMPLATES.some((t) => t.id === id)
}

export function renderWeddingTemplate(
  id: string,
  wedding: WeddingData,
  backHref?: string,
  hideBack?: boolean,
): ReactNode {
  const props = { wedding, backHref, hideBack }
  switch (id) {
    case 'modern':
      return <ModernTemplate {...props} />
    case 'traditional':
      return <TraditionalTemplate {...props} />
    default:
      return <RomanticTemplate {...props} />
  }
}
