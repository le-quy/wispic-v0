'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  LayoutTemplate,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import {
  readAdminTemplates,
  saveAdminTemplate,
  createAdminTemplate,
  deleteAdminTemplate,
  type AdminTemplate,
} from '@/lib/admin-template-storage'
import { TEMPLATES } from '@/lib/template-registry'

export function TemplateManager() {
  const [adminTemplates, setAdminTemplates] = useState<AdminTemplate[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const list = await readAdminTemplates()
      if (cancelled) return
      setAdminTemplates(list)
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleCreate = async () => {
    const tpl = createAdminTemplate()
    await saveAdminTemplate(tpl)
    window.location.href = `/dashboard/templates/${tpl.id}/edit`
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá mẫu này?')) return
    await deleteAdminTemplate(id)
    setAdminTemplates(await readAdminTemplates())
  }

  const handleDuplicate = async (tpl: AdminTemplate) => {
    const dup = createAdminTemplate({
      name: `${tpl.name} (bản sao)`,
      category: tpl.category,
      description: tpl.description,
    })
    dup.html = tpl.html
    dup.css = tpl.css
    dup.swatches = tpl.swatches
    dup.accent = tpl.accent
    await saveAdminTemplate(dup)
    setAdminTemplates(await readAdminTemplates())
  }

  if (!loaded) return null

  return (
    <div className="wispic-container py-8 md:py-12">
      <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
            Dashboard
          </Link>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            Quản lý mẫu thiệp
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Tạo và tùy chỉnh mẫu thiệp bằng HTML + CSS.
          </p>
        </div>
        <button type="button" onClick={handleCreate} className="wispic-btn-primary !px-5 !py-2.5">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tạo mẫu mới
        </button>
      </div>

      {/* Admin templates (mẫu tùy chỉnh — admin tạo) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="wispic-label">Mẫu tùy chỉnh</h2>
          <span className="text-xs font-light text-muted-foreground">
            {adminTemplates.length} mẫu
          </span>
        </div>

        {adminTemplates.length === 0 ? (
          <div className="wispic-card flex flex-col items-center px-6 py-16 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <LayoutTemplate className="h-6 w-6 text-terracotta" strokeWidth={1.5} />
            </span>
            <h3 className="mt-5 font-serif text-xl font-medium text-foreground">
              Chưa có mẫu tùy chỉnh
            </h3>
            <p className="mt-2 max-w-sm text-sm font-light text-muted-foreground">
              Tạo mẫu đầu tiên bằng HTML + CSS. Mẫu bạn tạo sẽ xuất hiện cho người dùng khi họ
              tạo/ chỉnh sửa thiệp cưới.
            </p>
            <button
              type="button"
              onClick={handleCreate}
              className="wispic-btn-primary mt-6 !px-6"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Tạo mẫu đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminTemplates.map((t) => (
              <div key={t.id} className="wispic-card overflow-hidden">
                <div
                  className="flex aspect-[3/4] items-center justify-center"
                  style={{
                    background: `linear-gradient(150deg, ${t.swatches[0]}, ${t.swatches[1]})`,
                  }}
                >
                  <span
                    className="font-serif text-2xl font-medium"
                    style={{ color: t.accent }}
                  >
                    {t.name}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="mt-1 text-xs font-light text-muted-foreground">
                    {t.category} · {t.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-olive/15 px-3 py-1 text-[0.65rem] font-light text-olive">
                      Tùy chỉnh
                    </span>
                    <span className="text-[0.65rem] font-light text-muted-foreground">
                      {new Date(t.updatedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href={`/dashboard/templates/${t.id}/edit`}
                      className="wispic-btn-outline !px-4 !py-2 !text-xs"
                    >
                      <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
                      Chỉnh sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(t)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
                      title="Nhân bản"
                    >
                      <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                      title="Xoá"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* System templates (mặc định — không chỉnh sửa) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="wispic-label">Mẫu có sẵn</h2>
          <span className="text-xs font-light text-muted-foreground">
            Không thể chỉnh sửa
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="wispic-card overflow-hidden">
              <div
                className="flex aspect-[3/4] items-center justify-center"
                style={{
                  background: `linear-gradient(150deg, ${t.swatches[0]}, ${t.swatches[1]})`,
                }}
              >
                <span
                  className="font-serif text-2xl font-medium"
                  style={{ color: t.accent }}
                >
                  {t.name}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="mt-1 text-xs font-light text-muted-foreground">
                  {t.category} · {t.description}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[0.65rem] font-light text-secondary-foreground">
                    <ShieldCheck className="h-3 w-3" strokeWidth={1.8} />
                    Hệ thống mặc định
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
  )
}
