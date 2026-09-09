'use client'

import { useMemo } from 'react'
import { renderCustomTemplate } from '@/lib/template-engine'
import type { WeddingData } from '@/lib/wedding-data'

export function CustomTemplateRenderer({
  html,
  css,
  wedding,
}: {
  html: string
  css: string
  wedding: WeddingData
}) {
  const fullHtml = useMemo(() => renderCustomTemplate(html, css, wedding), [html, css, wedding])

  return (
    <div className="min-h-screen">
      <iframe
        srcDoc={fullHtml}
        title="Preview template"
        className="h-[80vh] w-full border-0"
        sandbox="allow-same-origin"
      />
    </div>
  )
}
