'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Trash2,
  PenLine,
  Eye,
  FileHeart,
  MapPin,
  CalendarDays,
} from 'lucide-react'
import {
  readWeddings,
  deleteWedding,
  summaryFromDraft,
  type WeddingDraft,
} from '@/lib/wedding-storage'
import { getTemplate } from '@/lib/template-registry'

export function WeddingList() {
  const [weddings, setWeddings] = useState<WeddingDraft[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [all, meRes] = await Promise.all([
          readWeddings(),
          fetch('/api/auth/me', { cache: 'no-store' }),
        ])
        if (cancelled) return
        const me = meRes.ok ? await meRes.json() : null
        // Admin thấy tất cả; user chỉ thấy thiệp của mình.
        const filtered =
          me?.role === 'admin'
            ? all
            : all.filter((w) => !w.userId || w.userId === me?.id)
        setWeddings(filtered)
      } catch {
        if (!cancelled) setWeddings([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const total = weddings.length
    const published = weddings.filter((w) => w.status === 'published').length
    const drafts = total - published
    return { total, published, drafts }
  }, [weddings])

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá thiệp cưới này?')) return
    await deleteWedding(id)
    setWeddings(weddings.filter((w) => w.id !== id))
  }

  return (
    <div className="wispic-container py-8 md:py-12">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="wispic-label">Dashboard</p>
            <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
              Thiệp cưới của tôi
            </h1>
            <p className="mt-3 max-w-lg text-pretty font-light leading-relaxed text-muted-foreground">
              Quản lý những chiếc thiệp bạn đã tạo. Tạo mới, chỉnh sửa hoặc xem
              trước bất cứ lúc nào — dữ liệu được lưu trên database.
            </p>
          </div>
          <Link href="/dashboard/create" className="wispic-btn-primary self-start sm:self-auto">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Tạo thiệp mới
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard label="Tổng thiệp" value={stats.total} />
          <StatCard label="Đã xuất bản" value={stats.published} accent />
          <StatCard label="Bản nháp" value={stats.drafts} />
        </div>

        {/* List / Empty state */}
        {weddings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {weddings.map((w) => (
              <WeddingCard key={w.id} wedding={w} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="wispic-card p-6">
      <p className="text-xs font-light uppercase tracking-[0.2em] text-terracotta">
        {label}
      </p>
      <p
        className={
          accent
            ? 'mt-2 font-serif text-5xl font-medium text-primary'
            : 'mt-2 font-serif text-5xl font-medium text-foreground'
        }
      >
        {value}
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="wispic-card flex flex-col items-center px-6 py-20 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <FileHeart className="h-7 w-7 text-terracotta" strokeWidth={1.5} />
      </span>
      <h2 className="mt-6 font-serif text-2xl font-medium text-foreground">
        Chưa có chiếc thiệp nào
      </h2>
      <p className="mt-3 max-w-sm text-pretty font-light leading-relaxed text-muted-foreground">
        Bắt đầu hành trình của hai bạn bằng cách tạo chiếc thiệp cưới đầu tiên.
        Chỉ vài giây để có một chiếc thiệp tinh tế.
      </p>
      <Link href="/dashboard/create" className="wispic-btn-primary mt-8">
        <Plus className="h-4 w-4" strokeWidth={2} />
        Tạo thiệp đầu tiên
      </Link>
    </div>
  )
}

function WeddingCard({
  wedding,
  onDelete,
}: {
  wedding: WeddingDraft
  onDelete: (id: string) => void
}) {
  const { date, city, names } = summaryFromDraft(wedding)
  const photo = wedding.avatar?.url ?? wedding.photos?.[0]?.url

  return (
    <div className="wispic-card group overflow-hidden transition-shadow hover:shadow-[0_24px_60px_-40px_rgba(41,37,34,0.4)]">
      <Link href={`/dashboard/${wedding.id}/preview`} aria-label={`Xem trước ${names}`}>
        <div className="relative aspect-video w-full overflow-hidden bg-secondary/40">
          {photo ? (
            <Image
              src={photo}
              alt={names}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileHeart className="h-8 w-8 text-terracotta/60" strokeWidth={1.25} />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-light capitalize tracking-wide text-muted-foreground backdrop-blur">
            {wedding.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <h3 className="truncate font-serif text-xl font-medium text-foreground">
          {names}
        </h3>
        <p className="mt-1 text-xs font-light uppercase tracking-[0.18em] text-terracotta">
          {getTemplate(wedding.templateId).name}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm font-light text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-terracotta" strokeWidth={1.6} />
          <span>{date}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-sm font-light text-muted-foreground">
          <MapPin className="h-4 w-4 text-terracotta" strokeWidth={1.6} />
          <span>{city}</span>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4">
          <Link
            href={`/dashboard/${wedding.id}/edit`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta transition-colors hover:text-foreground"
          >
            <PenLine className="h-3.5 w-3.5" strokeWidth={1.8} />
            Chỉnh sửa
          </Link>
          <Link
            href={`/dashboard/${wedding.id}/preview`}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
            Xem trước
          </Link>
          <button
            type="button"
            onClick={() => onDelete(wedding.id)}
            className="inline-flex items-center gap-1.5 rounded-md p-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
            aria-label="Xoá thiệp"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  )
}
