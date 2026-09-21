'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Check,
  ChevronDown,
  Gift,
  ImagePlus,
  Palette,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { TEMPLATES, renderWeddingTemplate } from '@/lib/template-registry'
import {
  readAdminTemplates,
  type AdminTemplate,
} from '@/lib/admin-template-storage'
import { CustomTemplateRenderer } from '@/components/wedding/custom-template-renderer'
import { newPhoto, createWeddingId } from '@/lib/wedding-storage'
import type {
  BankAccount,
  DressCode,
  EnvelopeConfig,
  GiftConfig,
  GuestbookConfig,
  MapConfig,
  MusicConfig,
  OgConfig,
  RsvpConfig,
  RsvpQuestion,
  TimelineEvent,
  WeddingData,
  WeddingPhoto,
} from '@/lib/wedding-data'
import { cn } from '@/lib/utils'

export const inputCls =
  'mt-2 h-11 w-full rounded-lg border border-border bg-card px-4 text-sm font-light text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50'
export const labelCls = 'text-sm font-medium text-foreground'
export const textareaCls =
  'mt-2 min-h-28 w-full rounded-lg border border-border bg-card px-4 py-3 text-sm font-light leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50'

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(new Error('Không đọc được ảnh'))
    reader.readAsDataURL(file)
  })
}

export function Section({
  id,
  title,
  hint,
  children,
}: {
  id?: string
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="wispic-card p-6 md:p-7 scroll-mt-28">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
          {title}
        </h3>
        {hint && <span className="text-xs font-light text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

export function CollapsibleSection({
  id,
  title,
  hint,
  icon,
  enabled,
  onToggle,
  defaultOpen,
  badge,
  children,
}: {
  id?: string
  title: string
  hint?: string
  icon?: React.ReactNode
  enabled?: boolean
  onToggle?: (enabled: boolean) => void
  defaultOpen?: boolean
  badge?: string
  children: React.ReactNode
}) {
  const isToggleable = enabled !== undefined && onToggle !== undefined
  const [open, setOpen] = useState(
    defaultOpen !== undefined ? defaultOpen : isToggleable ? enabled : true,
  )

  const handleToggle = (nextVal: boolean) => {
    if (onToggle) {
      onToggle(nextVal)
      if (nextVal) {
        setOpen(true)
      }
    }
  }

  return (
    <section
      id={id}
      className={cn(
        'wispic-card overflow-hidden transition-all duration-200 scroll-mt-28',
        isToggleable && !enabled
          ? 'border-border/50 bg-card/60'
          : 'border-border/80 shadow-sm',
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((v) => !v)
          }
        }}
        className="flex cursor-pointer items-center justify-between gap-3 p-5 md:p-6 transition-colors hover:bg-secondary/25 select-none"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {icon && (
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                isToggleable && !enabled
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-terracotta/10 text-terracotta',
              )}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm md:text-base font-medium text-foreground tracking-tight">
                {title}
              </h3>
              {badge && (
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[0.65rem] font-light text-secondary-foreground">
                  {badge}
                </span>
              )}
            </div>
            {hint && (
              <p className="mt-0.5 truncate text-xs font-light text-muted-foreground">
                {hint}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isToggleable && (
            <>
              <div className="hidden sm:flex items-center">
                {enabled ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đang bật
                  </span>
                ) : (
                  <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-light text-muted-foreground">
                    Đang tắt
                  </span>
                )}
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center"
              >
                <Toggle
                  checked={!!enabled}
                  onChange={handleToggle}
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpen((v) => !v)
            }}
            aria-expanded={open}
            aria-label={open ? 'Thu gọn' : 'Mở rộng'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary"
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                open ? 'rotate-180' : '',
              )}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/30 p-5 md:p-6">
          {isToggleable && !enabled ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <p className="text-xs sm:text-sm font-light text-muted-foreground">
                Mục này hiện đang được tắt trên thiệp cưới. Bật công tắc ở trên để kích hoạt.
              </p>
              <button
                type="button"
                onClick={() => handleToggle(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-4 py-2 text-xs font-medium text-terracotta hover:bg-terracotta/20 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Bật {title}
              </button>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </section>
  )
}
export const FeatureToggleSection = CollapsibleSection

function useAdminTemplates(): AdminTemplate[] {
  const [list, setList] = useState<AdminTemplate[]>([])
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const templates = await readAdminTemplates()
      if (cancelled) return
      setList(templates)
    })()
    return () => {
      cancelled = true
    }
  }, [])
  return list
}

type TemplateInfo = {
  name: string
  category: string
  description: string
  swatches: [string, string]
  accent: string
}

export function useTemplateInfo(templateId: string): TemplateInfo {
  const adminTemplates = useAdminTemplates()
  const adminTpl = adminTemplates.find((t) => t.id === templateId)
  if (adminTpl) {
    return {
      name: adminTpl.name,
      category: adminTpl.category,
      description: adminTpl.description,
      swatches: adminTpl.swatches,
      accent: adminTpl.accent,
    }
  }
  const sys = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0]
  return sys
}

const TEMPLATE_PREVIEWS: Record<string, string> = {
  romantic:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
  modern:
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80',
  traditional:
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
}

const DEFAULT_PREVIEW_IMG =
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80'

export function TemplateGallery({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  const [showAllCards, setShowAllCards] = useState(false)
  const adminTemplates = useAdminTemplates()

  const allTemplates = [
    ...TEMPLATES.map((t) => ({
      ...t,
      badge: 'Hệ thống',
      image: TEMPLATE_PREVIEWS[t.id] || DEFAULT_PREVIEW_IMG,
    })),
    ...adminTemplates.map((t) => ({
      ...t,
      badge: 'Tùy chỉnh',
      image: TEMPLATE_PREVIEWS[t.id] || DEFAULT_PREVIEW_IMG,
    })),
  ]

  const currentTemplate =
    allTemplates.find((t) => t.id === activeId) || allTemplates[0]

  return (
    <div
      id="section-template"
      className="wispic-card p-4 sm:p-5 relative scroll-mt-28"
    >
      {/* Label and Hint */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            MẪU THIỆP
          </span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.68rem] font-light text-muted-foreground">
            {allTemplates.length} mẫu
          </span>
        </div>
        <span className="text-xs font-light text-muted-foreground">
          Đang áp dụng: <strong className="font-medium text-foreground">{currentTemplate.name}</strong>
        </span>
      </div>

      {/* Main Compact Selector Box: Image Preview + Native Select Dropdown + Quick Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 p-3 rounded-xl border border-border/80 bg-card shadow-xs">
        {/* Active Template Thumbnail Preview */}
        <div className="relative h-20 w-16 sm:h-22 sm:w-18 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted shadow-2xs">
          <Image
            src={currentTemplate.image}
            alt={currentTemplate.name}
            fill
            className="object-cover transition-transform hover:scale-105 duration-300"
            sizes="80px"
            referrerPolicy="no-referrer"
          />
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${currentTemplate.swatches[0]}, ${currentTemplate.swatches[1]})`,
            }}
          />
        </div>

        {/* Dropdown Select Control & Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="wedding-template-select" className="text-xs font-medium text-foreground">
              Chọn mẫu thiệp cưới (Dropdown):
            </label>
            <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-[0.65rem] font-medium text-terracotta">
              {currentTemplate.category}
            </span>
          </div>

          {/* Native HTML Select (Guaranteed 100% click & change support on all devices) */}
          <div className="relative">
            <select
              id="wedding-template-select"
              value={activeId}
              onChange={(e) => onSelect(e.target.value)}
              className="w-full h-10 appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm font-medium text-foreground transition focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 cursor-pointer shadow-2xs"
            >
              <optgroup label="Mẫu thiết kế chuẩn">
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — Phong cách {t.category}
                  </option>
                ))}
              </optgroup>
              {adminTemplates.length > 0 && (
                <optgroup label="Mẫu tùy chỉnh">
                  {adminTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.category}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </div>
          </div>

          {/* Quick Select Pills (1-Click Change) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[0.68rem] text-muted-foreground font-light mr-0.5">
              Đổi nhanh:
            </span>
            {allTemplates.map((t) => {
              const isSelected = t.id === activeId
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelect(t.id)}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer',
                    isSelected
                      ? 'bg-terracotta text-white shadow-xs'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60 hover:border-terracotta/40',
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: t.swatches[0] }}
                  />
                  <span>{t.name}</span>
                  {isSelected && <Check className="h-3 w-3" strokeWidth={2.5} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Toggle Detailed Cards View Button */}
        <div className="shrink-0 flex sm:flex-col items-center justify-end sm:justify-center border-t sm:border-t-0 sm:border-l border-border/60 pt-2 sm:pt-0 sm:pl-3">
          <button
            type="button"
            onClick={() => setShowAllCards((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-light text-foreground hover:bg-secondary transition-colors"
          >
            <Palette className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.8} />
            <span>{showAllCards ? 'Thu gọn ảnh' : 'Xem ảnh to'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Visual Cards List */}
      {showAllCards && (
        <div className="mt-3 rounded-xl border border-border/90 bg-card p-3 shadow-md animate-fade-in">
          <div className="mb-2.5 flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-2">
            <span className="font-medium uppercase tracking-wider text-[0.7rem]">
              Bấm vào mẫu bất kỳ để đổi trực tiếp
            </span>
            <button
              type="button"
              onClick={() => setShowAllCards(false)}
              className="text-terracotta hover:underline text-[0.75rem]"
            >
              Đóng lại
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {allTemplates.map((t) => {
              const isSelected = t.id === activeId
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onSelect(t.id)
                  }}
                  className={cn(
                    'flex flex-col rounded-lg border p-2.5 text-left transition-all cursor-pointer',
                    isSelected
                      ? 'border-terracotta bg-terracotta/5 ring-2 ring-terracotta/30 shadow-xs'
                      : 'border-border/70 hover:border-terracotta/50 hover:bg-secondary/40',
                  )}
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-md border border-border/60 bg-muted mb-2">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="220px"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 rounded-full bg-terracotta px-2 py-0.5 text-[0.65rem] font-medium text-white shadow-xs inline-flex items-center gap-1">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        Đang chọn
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-serif text-sm font-medium text-foreground">
                      {t.name}
                    </span>
                    <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[0.62rem] text-muted-foreground">
                      {t.category}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.75rem] font-light text-muted-foreground line-clamp-2">
                    {t.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-border/40">
                    <div className="flex items-center gap-1">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: t.swatches[0] }}
                      />
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: t.swatches[1] }}
                      />
                    </div>
                    <span className="text-[0.7rem] font-medium text-terracotta">
                      {isSelected ? 'Đã áp dụng' : 'Chọn mẫu này →'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function TemplatePreview({
  templateId,
  wedding,
}: {
  templateId: string
  wedding: WeddingData
}) {
  const adminTemplates = useAdminTemplates()
  const adminTpl = adminTemplates.find((t) => t.id === templateId)
  if (adminTpl) {
    return (
      <CustomTemplateRenderer html={adminTpl.html} css={adminTpl.css} wedding={wedding} />
    )
  }
  return <>{renderWeddingTemplate(templateId, wedding, '/dashboard', true)}</>
}

export function PhotoPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: WeddingPhoto | null
  onChange: (photo: WeddingPhoto | null) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [showUrl, setShowUrl] = useState(false)
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const url = await readFileAsDataUrl(file)
      onChange(newPhoto(url, label))
    } catch {
      // ignore
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  const applyUrl = () => {
    if (!url.trim()) return
    onChange(newPhoto(url.trim(), label))
    setUrl('')
    setShowUrl(false)
  }

  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className="mt-2">
        {value ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border/70">
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URL upload, next/image không hỗ trợ */}
            <img
              src={value.url}
              alt={value.alt ?? label}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/45 p-2 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[0.7rem] font-medium text-foreground transition hover:bg-white"
              >
                <Upload className="h-3 w-3" strokeWidth={1.8} />
                Đổi
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[0.7rem] font-medium text-foreground transition hover:bg-white"
              >
                <X className="h-3 w-3" strokeWidth={1.8} />
                Xoá
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/30 text-muted-foreground transition-colors hover:border-tangerine/60 hover:text-foreground"
          >
            <ImagePlus className="h-6 w-6" strokeWidth={1.5} />
            <span className="text-xs font-light">
              {busy ? 'Đang đọc ảnh...' : 'Tải lên'}
            </span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {!value && (
        <div className="mt-2">
          {showUrl ? (
            <div className="flex gap-2">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
                className="h-9 w-full rounded-lg border border-border bg-card px-3 text-xs font-light focus:border-ring focus:outline-none"
              />
              <button
                type="button"
                onClick={applyUrl}
                className="shrink-0 rounded-lg bg-secondary px-3 text-xs font-medium text-secondary-foreground transition hover:opacity-90"
              >
                Dán
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUrl(true)}
              className="text-xs font-light text-terracotta underline-offset-4 hover:underline"
            >
              hoặc dán link ảnh
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function GalleryManager({
  photos,
  onAddFile,
  onAddUrl,
  onRemove,
}: {
  photos: WeddingPhoto[]
  onAddFile: (file: File) => void
  onAddUrl: (url: string) => void
  onRemove: (id: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [showUrl, setShowUrl] = useState(false)
  const [url, setUrl] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await onAddFile(file)
    e.target.value = ''
  }

  const applyUrl = () => {
    if (!url.trim()) return
    onAddUrl(url)
    setUrl('')
    setShowUrl(false)
  }

  return (
    <div className="mt-2">
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border/70">
              {/* eslint-disable-next-line @next/next/no-img-element -- data: URL upload */}
              <img
                src={p.url}
                alt={p.alt ?? 'Kỷ niệm'}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                aria-label="Xoá ảnh"
                className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              >
                <X className="h-3 w-3" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Upload className="h-3.5 w-3.5" strokeWidth={1.8} />
          Thêm ảnh
        </button>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Save className="h-3.5 w-3.5" strokeWidth={1.8} />
          Dán link
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {showUrl && (
        <div className="mt-2 flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
            className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm font-light focus:border-ring focus:outline-none"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="shrink-0 rounded-lg bg-secondary px-4 text-xs font-medium text-secondary-foreground transition hover:opacity-90"
          >
            Thêm
          </button>
        </div>
      )}
    </div>
  )
}

/* ============================================================
   Các section editor mới — mô phỏng chungdoi.com
   ============================================================ */

export function extractYoutubeId(url?: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /^([\w-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}) {
  const isSm = size === 'sm'
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) onChange(!checked)
        }}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1',
          isSm ? 'h-5 w-9' : 'h-6 w-11',
          checked ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
            isSm ? 'h-4 w-4' : 'h-5 w-5',
            checked ? (isSm ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0',
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                if (!disabled) onChange(!checked)
              }}
              className={cn(
                'cursor-pointer select-none text-sm font-medium text-foreground',
                disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs font-light text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
export const ToggleSwitch = Toggle

type SegmentedValue = string | number

export function Segmented<T extends SegmentedValue>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-secondary/40 p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
            value === o.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-border bg-secondary/40 px-3 py-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-card text-lg leading-none text-foreground transition hover:bg-secondary"
        aria-label="Giảm"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-medium text-foreground">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-card text-lg leading-none text-foreground transition hover:bg-secondary"
        aria-label="Tăng"
      >
        +
      </button>
    </div>
  )
}

export function QuestionBuilder({
  questions,
  onChange,
}: {
  questions: RsvpQuestion[]
  onChange: (q: RsvpQuestion[]) => void
}) {
  const update = (q: RsvpQuestion) =>
    onChange(questions.map((x) => (x.id === q.id ? q : x)))

  const remove = (id: string) => onChange(questions.filter((x) => x.id !== id))

  const add = () =>
    onChange([
      ...questions,
      { id: createWeddingId(), text: '', type: 'yes_no' },
    ])

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q) => (
        <div key={q.id} className="rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex items-start gap-2">
            <input
              value={q.text}
              onChange={(e) => update({ ...q, text: e.target.value })}
              placeholder="Câu hỏi cho khách mời"
              className={cn(inputCls, 'mt-0 flex-1')}
            />
            <button
              type="button"
              onClick={() => remove(q.id)}
              aria-label="Xoá câu hỏi"
              className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
          <Segmented
            value={q.type}
            onChange={(type) => update({ ...q, type })}
            options={[
              { value: 'yes_no' as const, label: 'Có / Không' },
              { value: 'text' as const, label: 'Nhập văn bản' },
            ]}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-terracotta/60 hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
        Thêm câu hỏi
      </button>
    </div>
  )
}

const PRESET_COLORS = [
  '#292522',
  '#ffffff',
  '#e8dcc8',
  '#6F7558',
  '#7e9aa5',
  '#e8a2b0',
]

export function ColorPicker({
  colors,
  onChange,
}: {
  colors: string[]
  onChange: (colors: string[]) => void
}) {
  const [custom, setCustom] = useState('')

  const toggle = (c: string) => {
    if (colors.includes(c)) {
      onChange(colors.filter((x) => x !== c))
    } else {
      onChange([...colors, c])
    }
  }

  const addCustom = () => {
    if (!custom.trim()) return
    toggle(custom.trim())
    setCustom('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => toggle(c)}
            aria-label={`Chọn màu ${c}`}
            className={cn(
              'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
              colors.includes(c) ? 'scale-105 border-primary' : 'border-border',
            )}
            style={{ backgroundColor: c }}
          />
        ))}
        {colors
          .filter((c) => !PRESET_COLORS.includes(c))
          .map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggle(c)}
              aria-label={`Bỏ màu ${c}`}
              className="h-8 w-8 rounded-full border-2 border-primary transition-transform hover:scale-110"
              style={{ backgroundColor: c }}
            />
          ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="color"
          value={custom || '#6F7558'}
          onChange={(e) => setCustom(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-card p-1"
        />
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCustom()}
          placeholder="#6F7558"
          className="h-9 flex-1 rounded-lg border border-border bg-card px-3 text-sm font-light focus:border-ring focus:outline-none"
        />
        <button
          type="button"
          onClick={addCustom}
          className="shrink-0 rounded-lg bg-secondary px-3 text-xs font-medium text-secondary-foreground transition hover:opacity-90"
        >
          Thêm
        </button>
      </div>
    </div>
  )
}

export function RsvpEditor({
  value,
  onChange,
  hideToggle = false,
}: {
  value: RsvpConfig
  onChange: (v: RsvpConfig) => void
  hideToggle?: boolean
}) {
  return (
    <div className="flex flex-col gap-5">
      {!hideToggle && (
        <Toggle
          checked={value.enabled}
          onChange={(enabled) => onChange({ ...value, enabled })}
          label="Hiển thị mục xác nhận tham dự (RSVP)"
        />
      )}
      {(value.enabled || hideToggle) && (
        <>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-light text-muted-foreground">Kiểu hiển thị</span>
            <Segmented
              value={value.displayMode}
              onChange={(displayMode) => onChange({ ...value, displayMode })}
              options={[
                { value: 'button' as const, label: 'Nút bấm' },
                { value: 'inline' as const, label: 'Trong trang' },
              ]}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-light text-muted-foreground">
              Số khách tối đa (mỗi người)
            </span>
            <Stepper
              value={value.maxGuestCount}
              min={1}
              max={20}
              onChange={(maxGuestCount) => onChange({ ...value, maxGuestCount })}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-light text-muted-foreground">
              Câu hỏi thêm (tuỳ chọn)
            </p>
            <QuestionBuilder
              questions={value.questions}
              onChange={(questions) => onChange({ ...value, questions })}
            />
          </div>
        </>
      )}
    </div>
  )
}

export function GiftEditor({
  value,
  onChange,
  hideToggle = false,
}: {
  value: GiftConfig
  onChange: (v: GiftConfig) => void
  hideToggle?: boolean
}) {
  const updateAccount = (a: BankAccount) =>
    onChange({
      ...value,
      accounts: value.accounts.map((x) => (x.id === a.id ? a : x)),
    })

  const removeAccount = (id: string) =>
    onChange({ ...value, accounts: value.accounts.filter((x) => x.id !== id) })

  const addAccount = () =>
    onChange({
      ...value,
      accounts: [
        ...value.accounts,
        { id: createWeddingId(), bankName: '', accountNumber: '', holderName: '' },
      ],
    })

  return (
    <div className="flex flex-col gap-5">
      {!hideToggle && (
        <Toggle
          checked={value.enabled}
          onChange={(enabled) => onChange({ ...value, enabled })}
          label="Hiển thị mục mừng cưới"
        />
      )}
      {(value.enabled || hideToggle) && (
        <>
          <div>
            <label className={labelCls}>Tiêu đề</label>
            <input
              className={inputCls}
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-light text-muted-foreground">Kiểu hiển thị</span>
            <Segmented
              value={value.displayMode}
              onChange={(displayMode) => onChange({ ...value, displayMode })}
              options={[
                { value: 'button' as const, label: 'Nút bấm' },
                { value: 'inline' as const, label: 'Trong trang' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Tài khoản ngân hàng</p>
            {value.accounts.map((acc) => (
              <div
                key={acc.id}
                className="rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta">
                    <Gift className="h-3.5 w-3.5" strokeWidth={1.8} />
                    Tài khoản
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAccount(acc.id)}
                    aria-label="Xoá tài khoản"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-light text-muted-foreground">
                      Ngân hàng
                    </label>
                    <input
                      className={inputCls}
                      placeholder="Vietcombank"
                      value={acc.bankName}
                      onChange={(e) => updateAccount({ ...acc, bankName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-light text-muted-foreground">
                      Số tài khoản
                    </label>
                    <input
                      className={inputCls}
                      placeholder="0123456789"
                      value={acc.accountNumber}
                      onChange={(e) =>
                        updateAccount({ ...acc, accountNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-light text-muted-foreground">
                      Chủ tài khoản
                    </label>
                    <input
                      className={inputCls}
                      value={acc.holderName}
                      onChange={(e) => updateAccount({ ...acc, holderName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <PhotoPicker
                    label="Mã QR (tuỳ chọn)"
                    value={acc.qrUrl ? { id: acc.id, url: acc.qrUrl } : null}
                    onChange={(p) => updateAccount({ ...acc, qrUrl: p?.url })}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addAccount}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-terracotta/60 hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
              Thêm tài khoản
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function TimelineEditor({
  value,
  onChange,
}: {
  value: TimelineEvent[]
  onChange: (v: TimelineEvent[]) => void
}) {
  const update = (e: TimelineEvent) => onChange(value.map((x) => (x.id === e.id ? e : x)))
  const remove = (id: string) => onChange(value.filter((x) => x.id !== id))
  const move = (index: number, dir: -1 | 1) => {
    const next = [...value]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }
  const add = () =>
    onChange([...value, { id: createWeddingId(), time: '', title: '' }])

  return (
    <div className="flex flex-col gap-3">
      {value.map((ev, i) => (
        <div key={ev.id} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex-1 space-y-2">
            <input
              className={cn(inputCls, 'mt-0')}
              placeholder="Giờ — ví dụ 18:00"
              value={ev.time}
              onChange={(e) => update({ ...ev, time: e.target.value })}
            />
            <input
              className={cn(inputCls, 'mt-0')}
              placeholder="Tên sự kiện — ví dụ Tiệc chính thức"
              value={ev.title}
              onChange={(e) => update({ ...ev, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label="Di chuyển lên"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === value.length - 1}
              aria-label="Di chuyển xuống"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary disabled:opacity-30"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(ev.id)}
              aria-label="Xoá sự kiện"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-terracotta/60 hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
        Thêm sự kiện
      </button>
    </div>
  )
}

export function DressCodeEditor({
  value,
  onChange,
  hideToggle = false,
}: {
  value: DressCode
  onChange: (v: DressCode) => void
  hideToggle?: boolean
}) {
  return (
    <div className="flex flex-col gap-5">
      {!hideToggle && (
        <Toggle
          checked={value.enabled}
          onChange={(enabled) => onChange({ ...value, enabled })}
          label="Hiển thị dress code"
        />
      )}
      {(value.enabled || hideToggle) && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Tiêu đề</label>
              <input
                className={inputCls}
                value={value.title}
                onChange={(e) => onChange({ ...value, title: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Mô tả phụ</label>
              <input
                className={inputCls}
                value={value.subtitle}
                onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
              />
            </div>
          </div>
          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-light text-muted-foreground">
              <Palette className="h-3.5 w-3.5" strokeWidth={1.8} />
              Màu gợi ý
            </p>
            <ColorPicker
              colors={value.colors}
              onChange={(colors) => onChange({ ...value, colors })}
            />
          </div>
        </>
      )}
    </div>
  )
}

export function MusicEditor({
  value,
  onChange,
  hideToggle = false,
}: {
  value: MusicConfig
  onChange: (v: MusicConfig) => void
  hideToggle?: boolean
}) {
  const youtubeId = extractYoutubeId(value.url)
  const isFileAudio = !!value.url && !youtubeId

  return (
    <div className="flex flex-col gap-5">
      {!hideToggle && (
        <Toggle
          checked={value.enabled}
          onChange={(enabled) => onChange({ ...value, enabled })}
          label="Bật nhạc nền"
        />
      )}
      {(value.enabled || hideToggle) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Link nhạc (MP3 / YouTube)</label>
            <input
              className={inputCls}
              placeholder="https://... hoặc link YouTube"
              value={value.url}
              onChange={(e) =>
                onChange({
                  ...value,
                  url: e.target.value,
                  // Tự bật nhạc khi có link hợp lệ
                  enabled: e.target.value.trim() ? true : value.enabled,
                })
              }
            />
            <p className="mt-2 text-xs font-light text-muted-foreground">
              Hỗ trợ link file nhạc (mp3, wav, ogg...) hoặc link YouTube; YouTube phát dạng
              trình phát nổi.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Tên bài hát (tuỳ chọn)</label>
            <input
              className={inputCls}
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
            />
          </div>
          {youtubeId && (
            <div className="sm:col-span-2 overflow-hidden rounded-lg border border-border/70">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                title="Xem trước nhạc YouTube"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full border-0"
              />
            </div>
          )}
          {isFileAudio && value.url && (
            <div className="sm:col-span-2 overflow-hidden rounded-lg border border-border/70 bg-secondary/30 p-3">
              <audio controls src={value.url} className="w-full" preload="none" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function GuestbookEditor({
  value,
  onChange,
  hideToggle = false,
}: {
  value: GuestbookConfig
  onChange: (v: GuestbookConfig) => void
  hideToggle?: boolean
}) {
  return (
    <div className="flex flex-col gap-5">
      {!hideToggle && (
        <Toggle
          checked={value.enabled}
          onChange={(enabled) => onChange({ ...value, enabled })}
          label="Cho phép khách để lại lời chúc"
        />
      )}
      {(value.enabled || hideToggle) && (
        <div>
          <p className="mb-2 text-sm font-light text-muted-foreground">Câu hỏi thêm</p>
          <QuestionBuilder
            questions={value.questions}
            onChange={(questions) => onChange({ ...value, questions })}
          />
        </div>
      )}
    </div>
  )
}

export function EnvelopeEditor({
  value,
  onChange,
}: {
  value: EnvelopeConfig
  onChange: (v: EnvelopeConfig) => void
}) {
  return (
    <div>
      <label className={labelCls}>Lời chào trên phong bì thiệp</label>
      <textarea
        className={textareaCls}
        value={value.greeting}
        onChange={(e) => onChange({ ...value, greeting: e.target.value })}
      />
      <p className="mt-2 text-xs font-light text-muted-foreground">
        Với link thiệp của từng khách, tên khách sẽ hiển thị kèm lời chào này.
      </p>
    </div>
  )
}

export function OgImageEditor({
  value,
  onChange,
}: {
  value: OgConfig
  onChange: (v: OgConfig) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-light text-muted-foreground">Kiểu ảnh</span>
        <Segmented
          value={value.style}
          onChange={(style) => onChange({ ...value, style })}
          options={[
            { value: 'envelope' as const, label: 'Phong bì' },
            { value: 'photo' as const, label: 'Ảnh của bạn' },
          ]}
        />
      </div>
      {value.style === 'photo' && (
        <div>
          <label className={labelCls}>Link ảnh gốc (1200 × 630)</label>
          <input
            className={inputCls}
            placeholder="https://..."
            value={value.customUrl}
            onChange={(e) => onChange({ ...value, customUrl: e.target.value })}
          />
        </div>
      )}
      <p className="text-xs font-light text-muted-foreground">
        Ảnh này hiển thị khi chia sẻ link lên Zalo, Facebook, Messenger.
      </p>
    </div>
  )
}

export function MapEditor({
  value,
  onChange,
}: {
  value: MapConfig
  onChange: (v: MapConfig) => void
}) {
  // Tự trích xuất URL từ cả đoạn iframe dán vào (vd <iframe src="https://..."></iframe>)
  const sanitizeEmbed = (raw: string): string => {
    const trimmed = raw.trim()
    if (!trimmed) return ''
    // Trích src="..." nếu dán nguyên đoạn iframe
    const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/)
    const base = srcMatch ? srcMatch[1] : trimmed
    // Bỏ các tham số truy vấn không cần thiết (output=embed, q...) để tránh URL sai
    try {
      const u = new URL(base.startsWith('//') ? `https:${base}` : base)
      if (u.hostname.includes('google') || u.hostname.includes('maps')) {
        u.searchParams.delete('output')
      }
      return u.toString()
    } catch {
      return base
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className={labelCls}>Địa chỉ (nếu khác với trên thiệp)</label>
        <input
          className={inputCls}
          placeholder="Số nhà, đường, phường..."
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </div>
      <div>
        <label className={labelCls}>Link Google Maps / bản đồ (embed)</label>
        <input
          className={inputCls}
          placeholder="https://www.google.com/maps/embed?pb=... hoặc dán nguyên đoạn <iframe>"
          value={value.embedUrl}
          onChange={(e) => onChange({ ...value, embedUrl: sanitizeEmbed(e.target.value) })}
        />
        <p className="mt-2 text-xs font-light text-muted-foreground">
          Chỉ cần dán URL embed; nếu dán nguyên đoạn <code>&lt;iframe&gt;</code> hệ thống tự lấy
          đúng link. Đừng để thừa dấu “ · 10:00” hay ký tự lạ phía sau.
        </p>
      </div>
      {value.embedUrl && (
        <div className="overflow-hidden rounded-lg border border-border/70">
          <iframe
            src={value.embedUrl}
            title="Bản đồ"
            className="h-48 w-full border-0"
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}

export function PhoneMockupPreview({
  templateId,
  wedding,
  className,
}: {
  templateId: string
  wedding: WeddingData
  className?: string
}) {
  const [deviceMode, setDeviceMode] = useState<'phone' | 'expanded'>('phone')
  const templateInfo = useTemplateInfo(templateId)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleResetScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Top Preview Toolbar */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">
            Xem trước trực tiếp
          </span>
          <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-terracotta">
            {templateInfo.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleResetScroll}
            title="Cuộn về đầu trang"
            aria-label="Cuộn về đầu trang xem trước"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode((m) => (m === 'phone' ? 'expanded' : 'phone'))}
            title={deviceMode === 'phone' ? 'Mở rộng khung xem' : 'Chuyển sang khung điện thoại'}
            aria-label={deviceMode === 'phone' ? 'Mở rộng khung xem' : 'Chuyển sang khung điện thoại'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center">
        {deviceMode === 'phone' ? (
          /* Realistic Smartphone Bezel (Chungdoi Style) */
          <div className="relative mx-auto w-[360px] sm:w-[380px] xl:w-[390px] h-[780px] max-h-[calc(100vh-140px)] rounded-[50px] bg-[#1a1816] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)] transition-all ring-1 ring-black/30">
            {/* Side bezel physical buttons */}
            <div className="absolute -left-[3px] top-[110px] h-8 w-[3px] rounded-l bg-[#3d3a36]" />
            <div className="absolute -left-[3px] top-[160px] h-11 w-[3px] rounded-l bg-[#3d3a36]" />
            <div className="absolute -left-[3px] top-[220px] h-11 w-[3px] rounded-l bg-[#3d3a36]" />
            <div className="absolute -right-[3px] top-[140px] h-14 w-[3px] rounded-r bg-[#3d3a36]" />

            {/* Inner Screen */}
            <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-background">
              {/* Dynamic Island / Speaker Pill */}
              <div className="pointer-events-none absolute left-1/2 top-2 z-30 flex h-4 w-24 -translate-x-1/2 items-center justify-between rounded-full bg-black px-2 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#1c1c1e] ring-1 ring-white/20" />
                <span className="h-2 w-2 rounded-full bg-[#0d1b2a]" />
              </div>

              {/* Scrollable Template Content */}
              <div
                ref={scrollRef}
                className="h-full w-full overflow-y-auto scrollbar-hide pt-1"
              >
                <TemplatePreview templateId={templateId} wedding={wedding} />
              </div>
            </div>
          </div>
        ) : (
          /* Expanded Card View */
          <div
            ref={scrollRef}
            className="w-full max-w-xl h-[780px] max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card shadow-lg"
          >
            <TemplatePreview templateId={templateId} wedding={wedding} />
          </div>
        )}
      </div>
    </div>
  )
}

export function EditorQuickNav({
  className,
}: {
  className?: string
}) {
  const sections = [
    { id: 'section-template', label: '🎨 Mẫu thiệp' },
    { id: 'section-couple', label: '💑 Cặp đôi' },
    { id: 'section-event', label: '📅 Ngày & Giờ' },
    { id: 'section-location', label: '📍 Địa điểm' },
    { id: 'section-content', label: '💌 Lời mời & Câu chuyện' },
    { id: 'section-photos', label: '📸 Album ảnh' },
    { id: 'section-features', label: '✨ Tính năng mở rộng' },
  ]

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={cn('overflow-x-auto scrollbar-hide py-1', className)}>
      <div className="flex items-center gap-1.5 min-w-max">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-terracotta/40 hover:bg-secondary/60 hover:text-foreground"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}