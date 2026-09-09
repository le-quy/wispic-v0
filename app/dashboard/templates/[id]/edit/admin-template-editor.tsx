'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  Eye,
  Palette,
  Trash2,
  Variable,
} from 'lucide-react'
import {
  readAdminTemplate,
  saveAdminTemplate,
  deleteAdminTemplate,
  type AdminTemplate,
} from '@/lib/admin-template-storage'
import { demoWedding } from '@/lib/wedding-data'
import { renderCustomTemplate, TEMPLATE_VARIABLES } from '@/lib/template-engine'
import { cn } from '@/lib/utils'

const inputCls =
  'mt-2 h-11 w-full rounded-lg border border-border bg-card px-4 text-sm font-light text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50'
const labelCls = 'text-sm font-medium text-foreground'

export function AdminTemplateEditor({ id }: { id: string }) {
  const router = useRouter()
  const [template, setTemplate] = useState<AdminTemplate | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html')
  const [showVars, setShowVars] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const found = await readAdminTemplate(id)
      if (cancelled) return
      if (found) {
        setTemplate(found)
      } else {
        setNotFound(true)
      }
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const update = (patch: Partial<AdminTemplate>) =>
    setTemplate((prev) => (prev ? { ...prev, ...patch, updatedAt: Date.now() } : prev))

  // Autosave
  useEffect(() => {
    if (!template || !loaded) return
    const t = setTimeout(() => {
      saveAdminTemplate({ ...template, updatedAt: Date.now() })
      setSavedAt(Date.now())
    }, 800)
    return () => clearTimeout(t)
  }, [template, loaded])

  const forceSave = () => {
    if (!template) return
    saveAdminTemplate({ ...template, updatedAt: Date.now() })
    setSavedAt(Date.now())
    router.push('/dashboard/templates')
  }

  const removeTemplate = async () => {
    if (!confirm('Xoá mẫu này?')) return
    await deleteAdminTemplate(id)
    router.push('/dashboard/templates')
  }

  const previewHtml = useMemo(() => {
    if (!template) return ''
    return renderCustomTemplate(template.html, template.css, demoWedding)
  }, [template])

  if (!loaded) return null

  if (notFound || !template) {
    return (
      <div className="wispic-card flex flex-col items-center px-6 py-20 text-center">
        <h2 className="font-serif text-2xl font-medium text-foreground">
          Không tìm thấy mẫu
        </h2>
        <p className="mt-3 max-w-sm text-sm font-light text-muted-foreground">
          Mẫu này không tồn tại hoặc đã bị xoá.
        </p>
        <Link href="/dashboard/templates" className="wispic-btn-outline mt-8">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/dashboard/templates"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
            Quản lý mẫu
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {template.name}
            </h1>
            <span className="rounded-full bg-olive/15 px-3 py-1 text-xs font-light text-olive">
              Tùy chỉnh
            </span>
            <span className="text-xs font-light text-muted-foreground">
              {savedAt ? `Đã lưu ${new Date(savedAt).toLocaleTimeString('vi-VN')}` : 'Đang lưu...'}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={forceSave} className="wispic-btn-primary !px-5 !py-2.5">
            <Check className="h-4 w-4" strokeWidth={2} />
            Lưu & quay lại
          </button>
          <button
            type="button"
            onClick={removeTemplate}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Mobile view switch */}
      <div className="grid grid-cols-2 gap-2 xl:hidden">
        <button
          type="button"
          onClick={() => setMobileView('edit')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors',
            mobileView === 'edit'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-foreground',
          )}
        >
          <Palette className="h-4 w-4" strokeWidth={1.8} />
          Chỉnh sửa
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors',
            mobileView === 'preview'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-foreground',
          )}
        >
          <Eye className="h-4 w-4" strokeWidth={1.8} />
          Xem trước
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,470px)_minmax(0,1fr)]">
        {/* Controls */}
        <div className={cn('flex flex-col gap-6', mobileView === 'preview' && 'hidden xl:flex')}>
          {/* Metadata */}
          <section className="wispic-card p-6">
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
              Thông tin mẫu
            </h3>
            <div className="grid gap-4">
              <div>
                <label htmlFor="tpl-name" className={labelCls}>
                  Tên mẫu
                </label>
                <input
                  id="tpl-name"
                  className={inputCls}
                  value={template.name}
                  onChange={(e) => update({ name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tpl-category" className={labelCls}>
                    Danh mục
                  </label>
                  <input
                    id="tpl-category"
                    className={inputCls}
                    value={template.category}
                    onChange={(e) => update({ category: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="tpl-accent" className={labelCls}>
                    Màu accent
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      id="tpl-accent"
                      type="color"
                      value={template.accent}
                      onChange={(e) => update({ accent: e.target.value })}
                      className="h-11 w-11 cursor-pointer rounded-lg border border-border"
                    />
                    <input
                      className={cn(inputCls, '!mt-0 flex-1')}
                      value={template.accent}
                      onChange={(e) => update({ accent: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tpl-swatch1" className={labelCls}>
                    Màu nền 1
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      id="tpl-swatch1"
                      type="color"
                      value={template.swatches[0]}
                      onChange={(e) =>
                        update({ swatches: [e.target.value, template.swatches[1]] })
                      }
                      className="h-11 w-11 cursor-pointer rounded-lg border border-border"
                    />
                    <input
                      className={cn(inputCls, '!mt-0 flex-1')}
                      value={template.swatches[0]}
                      onChange={(e) =>
                        update({ swatches: [e.target.value, template.swatches[1]] })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="tpl-swatch2" className={labelCls}>
                    Màu nền 2
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      id="tpl-swatch2"
                      type="color"
                      value={template.swatches[1]}
                      onChange={(e) =>
                        update({ swatches: [template.swatches[0], e.target.value] })
                      }
                      className="h-11 w-11 cursor-pointer rounded-lg border border-border"
                    />
                    <input
                      className={cn(inputCls, '!mt-0 flex-1')}
                      value={template.swatches[1]}
                      onChange={(e) =>
                        update({ swatches: [template.swatches[0], e.target.value] })
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="tpl-desc" className={labelCls}>
                  Mô tả
                </label>
                <input
                  id="tpl-desc"
                  className={inputCls}
                  value={template.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Code editor */}
          <section className="wispic-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
                Code
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowVars((v) => !v)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    showVars
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-foreground hover:bg-secondary',
                  )}
                >
                  <Variable className="h-3 w-3" strokeWidth={1.8} />
                  Variables
                </button>
                <div className="flex overflow-hidden rounded-full border border-border">
                  <button
                    type="button"
                    onClick={() => setActiveTab('html')}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium transition-colors',
                      activeTab === 'html'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-secondary',
                    )}
                  >
                    HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('css')}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium transition-colors',
                      activeTab === 'css'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-secondary',
                    )}
                  >
                    CSS
                  </button>
                </div>
              </div>
            </div>

            {showVars && (
              <div className="mb-4 rounded-lg border border-border/60 bg-secondary/30 p-3">
                <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                  Click để chèn vào HTML
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATE_VARIABLES.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => {
                        const ta = document.getElementById('html-editor') as HTMLTextAreaElement | null
                        if (!ta) return
                        const pos = ta.selectionStart
                        const before = template.html.slice(0, pos)
                        const after = template.html.slice(ta.selectionEnd)
                        const insertion = `{{${v.name}}}`
                        update({ html: before + insertion + after })
                        setTimeout(() => {
                          ta.selectionStart = ta.selectionEnd = pos + insertion.length
                          ta.focus()
                        }, 0)
                      }}
                      className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[0.65rem] font-light text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      title={v.label}
                    >
                      {`{{${v.name}}}`}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const ta = document.getElementById('html-editor') as HTMLTextAreaElement | null
                      if (!ta) return
                      const pos = ta.selectionStart
                      const before = template.html.slice(0, pos)
                      const after = template.html.slice(ta.selectionEnd)
                      const insertion = `{{#if variable}}...{{/if}}`
                      update({ html: before + insertion + after })
                    }}
                    className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[0.65rem] font-light text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {'{{#if}}'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const ta = document.getElementById('html-editor') as HTMLTextAreaElement | null
                      if (!ta) return
                      const pos = ta.selectionStart
                      const before = template.html.slice(0, pos)
                      const after = template.html.slice(ta.selectionEnd)
                      const insertion = `{{#each photos}}...{{/each}}`
                      update({ html: before + insertion + after })
                    }}
                    className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[0.65rem] font-light text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {'{{#each}}'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'html' ? (
              <textarea
                id="html-editor"
                className="h-96 w-full rounded-lg border border-border bg-card p-4 font-mono text-xs leading-relaxed text-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50"
                value={template.html}
                onChange={(e) => update({ html: e.target.value })}
                spellCheck={false}
              />
            ) : (
              <textarea
                id="css-editor"
                className="h-96 w-full rounded-lg border border-border bg-card p-4 font-mono text-xs leading-relaxed text-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50"
                value={template.css}
                onChange={(e) => update({ css: e.target.value })}
                spellCheck={false}
              />
            )}
          </section>
        </div>

        {/* Preview */}
        <div className={cn('flex flex-col gap-3', mobileView === 'edit' && 'hidden xl:flex')}>
          <div className="flex items-center justify-between">
            <p className="wispic-label">Xem trước trực tiếp</p>
            <span className="text-xs font-light text-muted-foreground">
              Dữ liệu mẫu: Minh & Vy
            </span>
          </div>
          <div className="wispic-card overflow-hidden scrollbar-hide xl:sticky xl:top-24 xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto">
            <iframe
              srcDoc={previewHtml}
              title="Preview template"
              className="h-[80vh] w-full border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
