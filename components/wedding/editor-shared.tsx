'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Check,
  ChevronDown,
  Gift,
  ImagePlus,
  Palette,
  Plus,
  Save,
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
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="wispic-card p-6">
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
  title,
  hint,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string
  hint?: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="wispic-card overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-secondary/30"
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            {title}
          </h3>
          {hint && (
            <span className="hidden text-xs font-light text-muted-foreground sm:inline">
              {hint}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            open ? 'rotate-180' : '',
          )}
          strokeWidth={1.8}
        />
      </button>
      {open && <div className="border-t border-border/60 px-6 py-5">{children}</div>}
    </section>
  )
}

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

export function TemplateGallery({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  const adminTemplates = useAdminTemplates()

  return (
    <Section title="Mẫu thiệp" hint="Đổi mẫu — giữ nguyên dữ liệu">
      <div className="grid grid-cols-3 gap-3">
        {TEMPLATES.map((t) => (
          <TemplateCard
            key={t.id}
            id={t.id}
            name={t.name}
            category={t.category}
            description={t.description}
            swatches={t.swatches}
            accent={t.accent}
            badge="Hệ thống"
            active={activeId === t.id}
            onSelect={onSelect}
          />
        ))}
        {adminTemplates.map((t) => (
          <TemplateCard
            key={t.id}
            id={t.id}
            name={t.name}
            category={t.category}
            description={t.description}
            swatches={t.swatches}
            accent={t.accent}
            badge="Tùy chỉnh"
            active={activeId === t.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </Section>
  )
}

function TemplateCard({
  id,
  name,
  category,
  description,
  swatches,
  accent,
  badge,
  active,
  onSelect,
}: {
  id: string
  name: string
  category: string
  description: string
  swatches: [string, string]
  accent: string
  badge: string
  active: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      key={id}
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={active}
      title={description}
      className={cn(
        'group overflow-hidden rounded-lg border text-left transition-all',
        active
          ? 'border-primary ring-3 ring-primary/30'
          : 'border-border/70 hover:border-tangerine/60',
      )}
    >
      <div
        className="relative flex aspect-[3/4] items-center justify-center"
        style={{ background: `linear-gradient(150deg, ${swatches[0]}, ${swatches[1]})` }}
      >
        <span className="font-serif text-xl font-medium" style={{ color: accent }}>
          {name}
        </span>
        <span className="absolute left-2 top-2 rounded-full bg-black/35 px-2 py-0.5 text-[0.55rem] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
          {badge}
        </span>
        {active && (
          <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-foreground">{name}</p>
        <p className="text-[0.65rem] font-light uppercase tracking-wider text-muted-foreground">
          {category}
        </p>
      </div>
    </button>
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
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3"
    >
      <span
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-border',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  )
}

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
}: {
  value: RsvpConfig
  onChange: (v: RsvpConfig) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <Toggle
        checked={value.enabled}
        onChange={(enabled) => onChange({ ...value, enabled })}
        label="Hiển thị mục xác nhận tham dự (RSVP)"
      />
      {value.enabled && (
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
}: {
  value: GiftConfig
  onChange: (v: GiftConfig) => void
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
      <Toggle
        checked={value.enabled}
        onChange={(enabled) => onChange({ ...value, enabled })}
        label="Hiển thị mục mừng cưới"
      />
      {value.enabled && (
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
}: {
  value: DressCode
  onChange: (v: DressCode) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <Toggle
        checked={value.enabled}
        onChange={(enabled) => onChange({ ...value, enabled })}
        label="Hiển thị dress code"
      />
      {value.enabled && (
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
}: {
  value: MusicConfig
  onChange: (v: MusicConfig) => void
}) {
  const youtubeId = extractYoutubeId(value.url)
  const isFileAudio = !!value.url && !youtubeId

  return (
    <div className="flex flex-col gap-5">
      <Toggle
        checked={value.enabled}
        onChange={(enabled) => onChange({ ...value, enabled })}
        label="Bật nhạc nền"
      />
      {value.enabled && (
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
}: {
  value: GuestbookConfig
  onChange: (v: GuestbookConfig) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <Toggle
        checked={value.enabled}
        onChange={(enabled) => onChange({ ...value, enabled })}
        label="Cho phép khách để lại lời chúc"
      />
      {value.enabled && (
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