'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileHeart } from 'lucide-react'
import { renderWeddingTemplate, isSystemTemplate } from '@/lib/template-registry'
import { readWedding, toWeddingData, type WeddingDraft } from '@/lib/wedding-storage'
import { readAdminTemplates, type AdminTemplate } from '@/lib/admin-template-storage'
import { renderCustomTemplate } from '@/lib/template-engine'

export function WeddingPreview({ id }: { id: string }) {
  const [wedding, setWedding] = useState<WeddingDraft | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const found = await readWedding(id)
      if (cancelled) return
      setWedding(found)
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  if (!ready) return null

  if (!wedding) {
    return (
      <div className="wispic-card flex flex-col items-center px-6 py-20 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <FileHeart className="h-7 w-7 text-terracotta" strokeWidth={1.5} />
        </span>
        <h2 className="mt-6 font-serif text-2xl font-medium text-foreground">
          Không tìm thấy thiệp
        </h2>
        <p className="mt-3 max-w-sm font-light leading-relaxed text-muted-foreground">
          Chiếc thiệp này không tồn tại hoặc đã bị xoá.
        </p>
        <Link href="/dashboard" className="wispic-btn-outline mt-8">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  if (isSystemTemplate(wedding.templateId)) {
    return renderWeddingTemplate(wedding.templateId, toWeddingData(wedding), '/dashboard')
  }

  return <CustomTemplateRenderer wedding={wedding} />
}

function CustomTemplateRenderer({ wedding }: { wedding: WeddingDraft }) {
  const [ready, setReady] = useState(false)
  const [tpl, setTpl] = useState<AdminTemplate | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const adminTemplates = await readAdminTemplates()
      if (cancelled) return
      setTpl(adminTemplates.find((t) => t.id === wedding.templateId) ?? null)
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [wedding.templateId])

  if (!ready) return null

  if (tpl) {
    const html = renderCustomTemplate(tpl.html, tpl.css, toWeddingData(wedding))
    return (
      <iframe
        srcDoc={html}
        title="Xem thiệp"
        className="h-screen w-full border-0"
        sandbox="allow-same-origin"
      />
    )
  }

  return renderWeddingTemplate('romantic', toWeddingData(wedding), '/dashboard')
}