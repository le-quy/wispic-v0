'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Layers,
  Palette,
  Plus,
  Trash2,
  Variable,
  Wand2,
} from 'lucide-react'
import {
  readAdminTemplate,
  saveAdminTemplate,
  deleteAdminTemplate,
  type AdminTemplate,
} from '@/lib/admin-template-storage'
import { demoWedding } from '@/lib/wedding-data'
import { renderCustomTemplate, renderTemplateSections, TEMPLATE_VARIABLES } from '@/lib/template-engine'
import {
  TEMPLATE_SECTION_DEFS,
  defaultSectionHtml,
  defaultTemplateSections,
  isWidgetSection,
  type TemplateSection,
} from '@/lib/template-sections'
import { cn } from '@/lib/utils'
import type { TemplateSectionDef } from '@/lib/template-sections'

const inputCls =
  'mt-2 h-11 w-full rounded-lg border border-border bg-card px-4 text-sm font-light text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50'
const labelCls = 'text-sm font-medium text-foreground'
const codeAreaCls =
  'min-h-40 w-full rounded-lg border border-border bg-card p-4 font-mono text-xs leading-relaxed text-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50'

export function AdminTemplateEditor({ id }: { id: string }) {
  const router = useRouter()
  const [template, setTemplate] = useState<AdminTemplate | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const [showVars, setShowVars] = useState(false)
  const [activeEditorId, setActiveEditorId] = useState<string | null>(null)
  const [openCss, setOpenCss] = useState<Record<string, boolean>>({})
  const [pendingKey, setPendingKey] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const found = await readAdminTemplate(id)
      if (cancelled) return
      if (found) {
        setTemplate(found)
        const firstAvailable = TEMPLATE_SECTION_DEFS.find(
          (d) => !(found.sections ?? []).some((s) => s.key === d.key),
        )
        setPendingKey(firstAvailable?.key ?? '')
      } else {
        setNotFound(true)
      }
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const isSectionsMode = (template?.sections?.length ?? 0) > 0

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

  /* ---------------- Section operations ---------------- */

  const updateSection = (index: number, patch: Partial<TemplateSection>) =>
    setTemplate((prev) =>
      prev
        ? {
            ...prev,
            sections: prev.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
            updatedAt: Date.now(),
          }
        : prev,
    )

  const moveSection = (index: number, dir: -1 | 1) => {
    setTemplate((prev) => {
      if (!prev) return prev
      const next = [...prev.sections]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...prev, sections: next, updatedAt: Date.now() }
    })
  }

  const removeSection = (index: number) => {
    setTemplate((prev) =>
      prev
        ? {
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index),
            updatedAt: Date.now(),
          }
        : prev,
    )
  }

  const addSection = (key: string) => {
    if (!key) return
    setTemplate((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections, { key, html: defaultSectionHtml(key), css: '' }]
      const firstAvailable = TEMPLATE_SECTION_DEFS.find((d) => !sections.some((s) => s.key === d.key))
      setPendingKey(firstAvailable?.key ?? '')
      return { ...prev, sections, updatedAt: Date.now() }
    })
  }

  const convertLegacy = () => {
    setTemplate((prev) =>
      prev
        ? { ...prev, sections: defaultTemplateSections(), updatedAt: Date.now() }
        : prev,
    )
    const firstAvailable = TEMPLATE_SECTION_DEFS[0]
    setPendingKey(firstAvailable?.key ?? '')
  }

  const previewHtml = useMemo(() => {
    if (!template) return ''
    if (isSectionsMode) return renderTemplateSections(template.sections, template.css, demoWedding)
    return renderCustomTemplate(template.html, template.css, demoWedding)
  }, [template, isSectionsMode])

  /* ---------------- Variable / snippet insertion ---------------- */

  const insertToActiveEditor = (insertion: string) => {
    const ta = document.getElementById(activeEditorId ?? '') as HTMLTextAreaElement | null
    if (!ta) return
    const pos = ta.selectionStart
    const before = ta.value.slice(0, pos)
    const after = ta.value.slice(ta.selectionEnd)
    const next = before + insertion + after

    if (activeEditorId === 'html-editor') {
      update({ html: next })
    } else if (activeEditorId === 'css-editor') {
      update({ css: next })
    } else {
      const m = activeEditorId?.match(/^sec-html-(\d+)$/)
      if (m) updateSection(parseInt(m[1], 10), { html: next })
    }
    setTimeout(() => {
      ta.focus()
      ta.selectionStart = ta.selectionEnd = pos + insertion.length
    }, 0)
  }

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

  const used = new Set(template.sections.map((s) => s.key))
  const available: TemplateSectionDef[] = TEMPLATE_SECTION_DEFS.filter((d) => !used.has(d.key))

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
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
                {isSectionsMode ? 'Section Builder' : 'Code'}
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
                {isSectionsMode && (
                  <button
                    type="button"
                    onClick={() => setShowVars((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <Wand2 className="h-3 w-3" strokeWidth={1.8} />
                    Gợi ý cú pháp
                  </button>
                )}
              </div>
            </div>

            {showVars && (
              <div className="mb-4 rounded-lg border border-border/60 bg-secondary/30 p-3">
                <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                  Click để chèn vào vùng HTML đang chọn
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATE_VARIABLES.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => insertToActiveEditor(`{{${v.name}}}`)}
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
                    onClick={() => insertToActiveEditor(`{{#if variable}}...{{/if}}`)}
                    className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[0.65rem] font-light text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {'{{#if}}'}
                  </button>
                  <button
                    type="button"
                    onClick={() => insertToActiveEditor(`{{#each photos}}...{{/each}}`)}
                    className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[0.65rem] font-light text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {'{{#each}}'}
                  </button>
                </div>
                <p className="mt-3 border-t border-border/40 pt-2 text-[0.65rem] font-light leading-relaxed text-muted-foreground">
                  Cú pháp: <code className="text-terracotta">{'{{var}}'}</code> biến ·{' '}
                  <code className="text-terracotta">{'{{#if var}}'}</code> điều kiện ·{' '}
                  <code className="text-terracotta">{'{{#each photos}}{{this.url}}{{/each}}'}</code>{' '}
                  vòng lặp · <code className="text-terracotta">{'{{#widget key}}'}</code> widget
                  tương tác chuẩn.
                </p>
              </div>
            )}

            {isSectionsMode ? (
              <SectionBuilder
                sections={template.sections}
                available={available}
                openCss={openCss}
                activeEditorId={activeEditorId}
                pendingKey={pendingKey}
                onSetPendingKey={setPendingKey}
                onUpdateSection={updateSection}
                onMoveSection={moveSection}
                onRemoveSection={removeSection}
                onAddSection={addSection}
                onFocusEditor={setActiveEditorId}
                onToggleCss={(k) => setOpenCss((prev) => ({ ...prev, [k]: !prev[k] }))}
                onInsertWidget={(index) => {
                  const s = template.sections[index]
                  if (!s) return
                  const def = TEMPLATE_SECTION_DEFS.find((d) => d.key === s.key)
                  const label = def?.label ?? s.key
                  const wrapper = `<section class="wt-${s.key}">
  <p class="wt-eyebrow">${label}</p>
  <h2 class="wt-${s.key}__title"></h2>
  {{#widget ${s.key}}}
</section>`
                  updateSection(index, { html: wrapper })
                }}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {template.html ? (
                  <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 text-xs font-light text-muted-foreground">
                    Mẫu này đang ở dạng <strong>HTML đơn khối</strong> (cách cũ). Chuyển sang
                    dạng <strong>Section Builder</strong> để soạn từng phần riêng biệt.
                    <button
                      type="button"
                      onClick={convertLegacy}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90"
                    >
                      <Layers className="h-3 w-3" strokeWidth={1.8} />
                      Chuyển sang Sections
                    </button>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs font-light text-muted-foreground">
                    Mẫu chưa có nội dung.
                  </p>
                )}

                <div className="flex overflow-hidden rounded-full border border-border">
                  <button
                    type="button"
                    onClick={convertLegacy}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary"
                  >
                    <Layers className="h-3 w-3" strokeWidth={1.8} />
                    Khởi tạo Sections mặc định
                  </button>
                </div>

                <div>
                  <label htmlFor="html-editor" className={labelCls}>
                    HTML
                  </label>
                  <textarea
                    id="html-editor"
                    onFocus={() => setActiveEditorId('html-editor')}
                    className={cn(codeAreaCls, 'mt-2 h-60')}
                    value={template.html}
                    onChange={(e) => update({ html: e.target.value })}
                    spellCheck={false}
                  />
                </div>
                <div>
                  <label htmlFor="css-editor" className={labelCls}>
                    CSS
                  </label>
                  <textarea
                    id="css-editor"
                    onFocus={() => setActiveEditorId('css-editor')}
                    className={cn(codeAreaCls, 'mt-2 h-60')}
                    value={template.css}
                    onChange={(e) => update({ css: e.target.value })}
                    spellCheck={false}
                  />
                </div>
              </div>
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
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Section Builder
   ============================================================ */

function SectionBuilder({
  sections,
  available,
  openCss,
  activeEditorId,
  pendingKey,
  onSetPendingKey,
  onUpdateSection,
  onMoveSection,
  onRemoveSection,
  onAddSection,
  onFocusEditor,
  onToggleCss,
  onInsertWidget,
}: {
  sections: TemplateSection[]
  available: TemplateSectionDef[]
  openCss: Record<string, boolean>
  activeEditorId: string | null
  pendingKey: string
  onSetPendingKey: (k: string) => void
  onUpdateSection: (index: number, patch: Partial<TemplateSection>) => void
  onMoveSection: (index: number, dir: -1 | 1) => void
  onRemoveSection: (index: number) => void
  onAddSection: (key: string) => void
  onFocusEditor: (id: string | null) => void
  onToggleCss: (key: string) => void
  onInsertWidget: (index: number) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 text-xs font-light leading-relaxed text-muted-foreground">
        Mỗi <strong>section</strong> là một phần của thiệp, hiển thị theo thứ tự từ trên xuống.
        Widget (đánh dấu{' '}
        <span className="rounded-full bg-terracotta/15 px-2 py-0.5 font-medium text-terracotta">Widget</span>
        ) được engine tự render khối tương tác chuẩn.
      </div>

      {sections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-sm font-light text-muted-foreground">
            Chưa có section nào. Thêm section đầu tiên ở dưới.
          </p>
        </div>
      ) : (
        sections.map((s, i) => {
          const def = TEMPLATE_SECTION_DEFS.find((d) => d.key === s.key)
          const widget = isWidgetSection(s.key)
          const cssOpen = !!openCss[`css-${i}-${s.key}`]
          const editorId = `sec-html-${i}`
          return (
            <div key={`${s.key}-${i}`} className="overflow-hidden rounded-xl border border-border/80 bg-secondary/10">
              {/* Header */}
              <div className="flex items-start gap-2 border-b border-border/50 bg-card/60 p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.6rem] font-semibold text-secondary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {def?.label ?? s.key}
                    </span>
                    {widget ? (
                      <span className="rounded-full bg-terracotta/15 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-terracotta">
                        Widget
                      </span>
                    ) : (
                      <span className="rounded-full bg-olive/15 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-olive">
                        HTML
                      </span>
                    )}
                    <code className="text-[0.6rem] font-light text-muted-foreground">
                      {s.key}
                    </code>
                  </div>
                  {def?.description && (
                    <p className="mt-1 text-[0.65rem] font-light text-muted-foreground">
                      {def.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onMoveSection(i, -1)}
                    disabled={i === 0}
                    aria-label="Di chuyển lên"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveSection(i, 1)}
                    disabled={i === sections.length - 1}
                    aria-label="Di chuyển xuống"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveSection(i)}
                    aria-label="Xoá section"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              {/* Body: HTML editor */}
              <div className="p-3">
                {widget && (
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[0.65rem] font-light text-muted-foreground">
                      Widget chuẩn — dữ liệu tương tác được engine tự điền.
                    </p>
                    <button
                      type="button"
                      onClick={() => onInsertWidget(i)}
                      disabled={!activeEditorId?.includes(`sec-html-${i}`)}
                      className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1 text-[0.6rem] font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                      title="Chèn lại khối {{#widget key}}"
                    >
                      <Wand2 className="h-3 w-3" strokeWidth={1.8} />
                      Chèn widget
                    </button>
                  </div>
                )}
                <textarea
                  id={editorId}
                  onFocus={() => onFocusEditor(editorId)}
                  className={cn(codeAreaCls, 'h-48')}
                  value={s.html}
                  onChange={(e) => onUpdateSection(i, { html: e.target.value })}
                  spellCheck={false}
                />

                {/* CSS per-section (collapsible) */}
                <button
                  type="button"
                  onClick={() => onToggleCss(`css-${i}-${s.key}`)}
                  className="mt-2 inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1 text-[0.6rem] font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <ChevronDown
                    className={cn('h-3 w-3 transition-transform', cssOpen && 'rotate-180')}
                    strokeWidth={1.8}
                  />
                  {cssOpen ? 'Ẩn CSS riêng' : s.css ? 'Sửa CSS riêng' : 'Thêm CSS riêng'}
                </button>
                {cssOpen && (
                  <textarea
                    id={`sec-css-${i}`}
                    onFocus={() => onFocusEditor(`sec-css-${i}`)}
                    className={cn(codeAreaCls, 'mt-2 h-28')}
                    value={s.css ?? ''}
                    onChange={(e) => onUpdateSection(i, { css: e.target.value })}
                    spellCheck={false}
                    placeholder="/* CSS riêng cho section này, tiền tố class nên bắt đầu bằng wt- */"
                  />
                )}
              </div>
            </div>
          )
        })
      )}

      {/* Add section */}
      {available.length > 0 && (
        <div className="mt-1 flex items-center gap-2">
          <select
            value={pendingKey}
            onChange={(e) => onSetPendingKey(e.target.value)}
            className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-xs font-light text-foreground focus:border-ring focus:outline-none"
          >
            {available.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label} ({d.type === 'widget' ? 'Widget' : 'HTML'})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onAddSection(pendingKey)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Thêm section
          </button>
        </div>
      )}
      {available.length === 0 && (
        <p className="text-center text-[0.65rem] font-light text-muted-foreground">
          Đã thêm đủ tất cả section.
        </p>
      )}
    </div>
  )
}