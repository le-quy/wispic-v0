'use client'

import { useMemo } from 'react'
import { renderCustomTemplate, renderTemplateSections } from '@/lib/template-engine'
import type { TemplateSection } from '@/lib/template-sections'
import type { WeddingData } from '@/lib/wedding-data'

export function CustomTemplateRenderer({
  html,
  css,
  sections,
  wedding,
}: {
  html: string
  css: string
  sections?: TemplateSection[]
  wedding: WeddingData
}) {
  const fullHtml = useMemo(() => {
    if (sections && sections.length > 0) {
      return renderTemplateSections(sections, css, wedding)
    }
    return renderCustomTemplate(html, css, wedding)
  }, [html, css, sections, wedding])

  return (
    <div className="min-h-screen">
      <iframe
        srcDoc={fullHtml}
        title="Preview template"
        className="h-[80vh] w-full border-0"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  )
}
