'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Eye,
  FileHeart,
  PenLine,
  Trash2,
} from 'lucide-react'
import {
  readWedding,
  saveWedding,
  deleteWedding,
  toWeddingData,
  newPhoto,
  DEFAULT_TEMPLATE_ID,
  type WeddingDraft,
} from '@/lib/wedding-storage'
import type { WeddingPhoto } from '@/lib/wedding-data'
import { cn } from '@/lib/utils'
import {
  CollapsibleSection,
  DressCodeEditor,
  EnvelopeEditor,
  GalleryManager,
  GiftEditor,
  GuestbookEditor,
  MapEditor,
  MusicEditor,
  OgImageEditor,
  PhotoPicker,
  RsvpEditor,
  Section,
  TemplateGallery,
  TemplatePreview,
  TimelineEditor,
  inputCls,
  labelCls,
  readFileAsDataUrl,
  textareaCls,
  useTemplateInfo,
} from '@/components/wedding/editor-shared'
import {
  CalendarDays,
  FileSignature,
  Gift,
  ImageIcon,
  Mail,
  MapPin,
  Music,
  Palette,
  Timer,
} from 'lucide-react'
export function WeddingEditor({ id }: { id: string }) {
  const router = useRouter()
  const [draft, setDraft] = useState<WeddingDraft | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const [notFound, setNotFound] = useState(false)

  const templateName = useTemplateInfo(draft?.templateId ?? DEFAULT_TEMPLATE_ID).name

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const found = await readWedding(id)
      if (cancelled) return
      if (found) {
        setDraft(found)
      } else {
        setNotFound(true)
      }
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const update = (patch: Partial<WeddingDraft>) =>
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev))

  const updateNested = (
    key: 'ceremony' | 'reception' | 'location',
    field: string,
    value: string,
  ) =>
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            [key]: { ...(prev[key] as Record<string, string>), [field]: value },
          }
        : prev,
    )

  const setPhoto = (key: 'avatar' | 'couplePhoto', photo: WeddingPhoto | null) =>
    update({ [key]: photo } as Partial<WeddingDraft>)

  const addGalleryFile = async (file: File) => {
    const url = await readFileAsDataUrl(file)
    if (!draft) return
    update({ photos: [...draft.photos, newPhoto(url, 'Kỷ niệm')] })
  }

  const addGalleryUrl = (url: string) => {
    if (!draft || !url.trim()) return
    update({ photos: [...draft.photos, newPhoto(url.trim(), 'Kỷ niệm')] })
  }

  const removePhoto = (photoId: string) => {
    if (!draft) return
    update({ photos: draft.photos.filter((p) => p.id !== photoId) })
  }

  // Autosave (debounce)
  useEffect(() => {
    if (!draft || !loaded) return
    const t = setTimeout(() => {
      saveWedding({ ...draft, updatedAt: Date.now() })
      setSavedAt(Date.now())
    }, 600)
    return () => clearTimeout(t)
  }, [draft, loaded])

  const togglePublish = () => {
    if (!draft) return
    const nextStatus: WeddingDraft['status'] =
      draft.status === 'published' ? 'draft' : 'published'
    const next = {
      ...draft,
      status: nextStatus,
      updatedAt: Date.now(),
    }
    saveWedding(next)
    setDraft(next)
    setSavedAt(Date.now())
  }

  const forceSaveAndGoBack = () => {
    if (!draft) return
    saveWedding({ ...draft, updatedAt: Date.now() })
    router.push('/dashboard')
  }

  const removeDraft = async () => {
    if (!confirm('Bạn có chắc muốn xoá thiệp cưới này?')) return
    await deleteWedding(id)
    router.push('/dashboard')
  }

  if (!loaded) return null

  if (notFound || !draft) {
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

  const names =
    `${draft.groom || ''} ${draft.bride || ''}`.trim() || 'Thiệp cưới chưa đặt tên'
  const data = toWeddingData(draft)

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
            Danh sách thiệp
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {names}
            </h1>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-light',
                draft.status === 'published'
                  ? 'bg-olive/15 text-olive'
                  : 'bg-secondary text-secondary-foreground',
              )}
            >
              {draft.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </span>
            <span className="text-xs font-light text-muted-foreground">
              {savedAt ? `Đã lưu ${new Date(savedAt).toLocaleTimeString('vi-VN')}` : 'Đang lưu...'}
            </span>
          </div>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Mẫu{' '}
            <span className="text-terracotta">{templateName}</span> · mọi thay đổi tự động
            lưu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={togglePublish}
            className="wispic-btn-outline !px-5 !py-2.5"
          >
            {draft.status === 'published' ? 'Chuyển thành nháp' : 'Xuất bản'}
          </button>
          <Link
            href={`/dashboard/${id}/preview`}
            className="wispic-btn-outline !px-5 !py-2.5"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
            Xem thiệp
          </Link>
          <button
            type="button"
            onClick={forceSaveAndGoBack}
            className="wispic-btn-primary !px-5 !py-2.5"
          >
            <Check className="h-4 w-4" strokeWidth={2} />
            Lưu xong
          </button>
          <button
            type="button"
            onClick={removeDraft}
            aria-label="Xoá thiệp"
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
          <PenLine className="h-4 w-4" strokeWidth={1.8} />
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
          <TemplateGallery
            activeId={draft.templateId}
            onSelect={(templateId) => update({ templateId })}
          />

          <Section title="Cô dâu & chú rể">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="groom" className={labelCls}>
                  Tên chú rể
                </label>
                <input
                  id="groom"
                  className={inputCls}
                  value={draft.groom}
                  onChange={(e) => update({ groom: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="bride" className={labelCls}>
                  Tên cô dâu
                </label>
                <input
                  id="bride"
                  className={inputCls}
                  value={draft.bride}
                  onChange={(e) => update({ bride: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="groomParents" className={labelCls}>
                  Gia đình chú rể
                </label>
                <input
                  id="groomParents"
                  className={inputCls}
                  placeholder="Ông ... & Bà ..."
                  value={draft.groomParents}
                  onChange={(e) => update({ groomParents: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="brideParents" className={labelCls}>
                  Gia đình cô dâu
                </label>
                <input
                  id="brideParents"
                  className={inputCls}
                  placeholder="Ông ... & Bà ..."
                  value={draft.brideParents}
                  onChange={(e) => update({ brideParents: e.target.value })}
                />
              </div>
            </div>
          </Section>

          <Section title="Ngày cưới & giờ giấc">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="weddingDate" className={labelCls}>
                  Ngày cưới (hiển thị trên thiệp)
                </label>
                <input
                  id="weddingDate"
                  className={inputCls}
                  placeholder="20 · 10 · 2026"
                  value={draft.weddingDate}
                  onChange={(e) => update({ weddingDate: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="ceremonyTime" className={labelCls}>
                  Giờ lễ
                </label>
                <input
                  id="ceremonyTime"
                  className={inputCls}
                  value={draft.ceremony.time}
                  onChange={(e) => updateNested('ceremony', 'time', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="receptionTime" className={labelCls}>
                  Giờ tiệc
                </label>
                <input
                  id="receptionTime"
                  className={inputCls}
                  value={draft.reception.time}
                  onChange={(e) => updateNested('reception', 'time', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ceremonyDate" className={labelCls}>
                  Ngày lễ (chi tiết)
                </label>
                <input
                  id="ceremonyDate"
                  className={inputCls}
                  value={draft.ceremony.date}
                  onChange={(e) => updateNested('ceremony', 'date', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="receptionDesc" className={labelCls}>
                  Tiệc cưới (ghi chú)
                </label>
                <input
                  id="receptionDesc"
                  className={inputCls}
                  value={draft.reception.description}
                  onChange={(e) => updateNested('reception', 'description', e.target.value)}
                />
              </div>
            </div>
          </Section>

          <Section title="Địa điểm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="venueName" className={labelCls}>
                  Địa điểm / Trung tâm tiệc
                </label>
                <input
                  id="venueName"
                  className={inputCls}
                  placeholder="Trung tâm tiệc cưới Hoàng Gia"
                  value={draft.location.venueName}
                  onChange={(e) => updateNested('location', 'venueName', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="city" className={labelCls}>
                  Thành phố
                </label>
                <input
                  id="city"
                  className={inputCls}
                  value={draft.location.city}
                  onChange={(e) => updateNested('location', 'city', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="province" className={labelCls}>
                  Tỉnh
                </label>
                <input
                  id="province"
                  className={inputCls}
                  value={draft.location.province}
                  onChange={(e) => updateNested('location', 'province', e.target.value)}
                />
              </div>
            </div>
          </Section>

          <Section title="Nội dung thiệp">
            <div className="grid gap-4">
              <div>
                <label htmlFor="introduction" className={labelCls}>
                  Lời mời
                </label>
                <textarea
                  id="introduction"
                  className={textareaCls}
                  value={draft.introduction}
                  onChange={(e) => update({ introduction: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="coupleStory" className={labelCls}>
                  Câu chuyện của hai bạn
                </label>
                <textarea
                  id="coupleStory"
                  className={textareaCls}
                  value={draft.coupleStory}
                  onChange={(e) => update({ coupleStory: e.target.value })}
                />
              </div>
            </div>
          </Section>

          <Section title="Ảnh" hint="Ảnh đại diện & ảnh cặp đôi">
            <div className="grid grid-cols-2 gap-4">
              <PhotoPicker
                label="Ảnh đại diện"
                value={draft.avatar}
                onChange={(p) => setPhoto('avatar', p)}
              />
              <PhotoPicker
                label="Ảnh cặp đôi"
                value={draft.couplePhoto}
                onChange={(p) => setPhoto('couplePhoto', p)}
              />
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-foreground">Bộ sưu tập</p>
              <GalleryManager
                photos={draft.photos}
                onAddFile={addGalleryFile}
                onAddUrl={addGalleryUrl}
                onRemove={removePhoto}
              />
            </div>
          </Section>

          <CollapsibleSection
            title="RSVP — Xác nhận tham dự"
            hint="Khách xác nhận có đến không"
            icon={<CalendarDays className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <RsvpEditor
              value={draft.rsvp}
              onChange={(rsvp) => update({ rsvp })}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Mừng cưới"
            hint="Tài khoản ngân hàng & QR"
            icon={<Gift className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <GiftEditor
              value={draft.gift}
              onChange={(gift) => update({ gift })}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Lịch trình buổi tiệc"
            hint="Timeline sự kiện"
            icon={<Timer className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <TimelineEditor
              value={draft.timeline}
              onChange={(timeline) => update({ timeline })}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Dress code"
            hint="Màu gợi ý trang phục"
            icon={<Palette className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <DressCodeEditor
              value={draft.dressCode}
              onChange={(dressCode) => update({ dressCode })}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Nhạc nền"
            hint="Nhạc khi mở thiệp"
            icon={<Music className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <MusicEditor
              value={draft.music}
              onChange={(music) => update({ music })}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Lời chúc (Guest book)"
            hint="Khách gửi lời chúc"
            icon={<FileSignature className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <GuestbookEditor
              value={draft.guestbook}
              onChange={(guestbook) => update({ guestbook })}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Phong bì thiệp"
            hint="Lời chào trên phong bì"
            icon={<Mail className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <EnvelopeEditor
              value={draft.envelope}
              onChange={(envelope) => update({ envelope })}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Ảnh chia sẻ (OG)"
            hint="Ảnh khi chia sẻ link"
            icon={<ImageIcon className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <OgImageEditor
              value={draft.og}
              onChange={(og) => update({ og })}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Bản đồ"
            hint="Google Maps chỉ đường"
            icon={<MapPin className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <MapEditor
              value={draft.map}
              onChange={(map) => update({ map })}
            />
          </CollapsibleSection>
        </div>

        {/* Realtime preview */}
        <div className={cn('flex flex-col gap-3', mobileView === 'edit' && 'hidden xl:flex')}>
          <div className="flex items-center justify-between">
            <p className="wispic-label">Xem trước trực tiếp</p>
            <span className="text-xs font-light text-muted-foreground">
              Mẫu {templateName}
            </span>
          </div>
          <div className="wispic-card overflow-hidden scrollbar-hide xl:sticky xl:top-24 xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto">
            <TemplatePreview templateId={draft.templateId} wedding={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
