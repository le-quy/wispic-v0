'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ExternalLink,
  Eye,
  FileHeart,
  FileSignature,
  Gift,
  ImageIcon,
  Mail,
  MapPin,
  Music,
  Palette,
  PenLine,
  Sparkles,
  Timer,
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
  EditorQuickNav,
  EnvelopeEditor,
  GalleryManager,
  GiftEditor,
  GuestbookEditor,
  MapEditor,
  MusicEditor,
  OgImageEditor,
  PhoneMockupPreview,
  PhotoPicker,
  RsvpEditor,
  Section,
  TemplateGallery,
  TimelineEditor,
  inputCls,
  labelCls,
  readFileAsDataUrl,
  textareaCls,
  useTemplateInfo,
} from '@/components/wedding/editor-shared'

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
    `${draft.groom || ''} & ${draft.bride || ''}`.trim() || 'Thiệp cưới chưa đặt tên'
  const data = toWeddingData(draft)

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Top Header Bar (Chungdoi Style) */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Danh sách thiệp
            </Link>

            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                draft.status === 'published'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'bg-secondary text-secondary-foreground',
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  draft.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground',
                )}
              />
              {draft.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </span>

            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-light text-muted-foreground">
              Mẫu: <strong className="font-medium text-foreground">{templateName}</strong>
            </span>

            <span className="text-[0.7rem] font-light text-muted-foreground">
              {savedAt ? `Đã tự động lưu lúc ${new Date(savedAt).toLocaleTimeString('vi-VN')}` : 'Đang lưu...'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePublish}
              className="wispic-btn-outline !py-2 !px-3.5 text-xs sm:text-sm"
            >
              {draft.status === 'published' ? 'Chuyển về nháp' : 'Xuất bản thiệp'}
            </button>
            <Link
              href={`/dashboard/${id}/preview`}
              target="_blank"
              className="wispic-btn-outline !py-2 !px-3.5 text-xs sm:text-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
              Xem thiệp
            </Link>
            <button
              type="button"
              onClick={forceSaveAndGoBack}
              className="wispic-btn-primary !py-2 !px-4 text-xs sm:text-sm"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              Lưu xong
            </button>
            <button
              type="button"
              onClick={removeDraft}
              aria-label="Xoá thiệp"
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
            {names}
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-light text-muted-foreground">
            Chỉnh sửa thông tin thiệp cưới của bạn. Mọi thay đổi được tự động lưu và phản chiếu tức thì trên khung xem trước.
          </p>
        </div>

        {/* Quick section navigation pills */}
        <EditorQuickNav />
      </div>

      {/* Mobile view switch bar */}
      <div className="sticky top-16 z-20 xl:hidden -mx-4 px-4 py-2 bg-background/95 backdrop-blur border-b border-border/60">
        <div className="flex rounded-full bg-secondary/70 p-1">
          <button
            type="button"
            onClick={() => setMobileView('edit')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-all',
              mobileView === 'edit'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <PenLine className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.8} />
            Chỉnh sửa thông tin
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-all',
              mobileView === 'preview'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Eye className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.8} />
            Xem trước thiệp
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Main Grid: Spacious Left Form + Sticky Right Phone Preview */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_440px] 2xl:grid-cols-[minmax(0,1fr)_460px] items-start">
        {/* Controls Column */}
        <div className={cn('flex flex-col gap-6', mobileView === 'preview' && 'hidden xl:flex')}>
          {/* 1. Template Gallery */}
          <div id="section-template" className="scroll-mt-28">
            <TemplateGallery
              activeId={draft.templateId}
              onSelect={(templateId) => update({ templateId })}
            />
          </div>

          {/* 2. Couple Information */}
          <Section id="section-couple" title="Cô dâu & chú rể" hint="Tên và thông tin gia đình hai bên">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="groom" className={labelCls}>
                  Tên chú rể
                </label>
                <input
                  id="groom"
                  className={inputCls}
                  placeholder="Nguyễn Văn A"
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
                  placeholder="Trần Thị B"
                  value={draft.bride}
                  onChange={(e) => update({ bride: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="groomParents" className={labelCls}>
                  Gia đình chú rể (Bố & Mẹ)
                </label>
                <input
                  id="groomParents"
                  className={inputCls}
                  placeholder="Ông Nguyễn Văn C & Bà Lê Thị D"
                  value={draft.groomParents}
                  onChange={(e) => update({ groomParents: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="brideParents" className={labelCls}>
                  Gia đình cô dâu (Bố & Mẹ)
                </label>
                <input
                  id="brideParents"
                  className={inputCls}
                  placeholder="Ông Trần Văn E & Bà Phạm Thị F"
                  value={draft.brideParents}
                  onChange={(e) => update({ brideParents: e.target.value })}
                />
              </div>
            </div>
          </Section>

          {/* 3. Event Dates & Times */}
          <Section id="section-event" title="Ngày cưới & giờ giấc" hint="Thời gian làm lễ và đãi tiệc">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="weddingDate" className={labelCls}>
                  Ngày cưới (hiển thị chính trên thiệp)
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
                  Giờ hôn lễ
                </label>
                <input
                  id="ceremonyTime"
                  className={inputCls}
                  placeholder="09:00"
                  value={draft.ceremony.time}
                  onChange={(e) => updateNested('ceremony', 'time', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="receptionTime" className={labelCls}>
                  Giờ tiệc mừng
                </label>
                <input
                  id="receptionTime"
                  className={inputCls}
                  placeholder="11:30"
                  value={draft.reception.time}
                  onChange={(e) => updateNested('reception', 'time', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ceremonyDate" className={labelCls}>
                  Ngày lễ (dương lịch / âm lịch chi tiết)
                </label>
                <input
                  id="ceremonyDate"
                  className={inputCls}
                  placeholder="Chủ Nhật, ngày 20 tháng 10 năm 2026"
                  value={draft.ceremony.date}
                  onChange={(e) => updateNested('ceremony', 'date', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="receptionDesc" className={labelCls}>
                  Ghi chú tiệc cưới
                </label>
                <input
                  id="receptionDesc"
                  className={inputCls}
                  placeholder="Buổi tiệc thân mật cùng gia đình & bạn bè"
                  value={draft.reception.description}
                  onChange={(e) => updateNested('reception', 'description', e.target.value)}
                />
              </div>
            </div>
          </Section>

          {/* 4. Location */}
          <Section id="section-location" title="Địa điểm tổ chức" hint="Tên trung tâm tiệc cưới và địa chỉ">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="venueName" className={labelCls}>
                  Tên địa điểm / Trung tâm tiệc cưới
                </label>
                <input
                  id="venueName"
                  className={inputCls}
                  placeholder="Trung tâm tiệc cưới Hoàng Gia (Sảnh Diamond)"
                  value={draft.location.venueName}
                  onChange={(e) => updateNested('location', 'venueName', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="city" className={labelCls}>
                  Quận / Huyện / Thành phố
                </label>
                <input
                  id="city"
                  className={inputCls}
                  placeholder="Quận 1"
                  value={draft.location.city}
                  onChange={(e) => updateNested('location', 'city', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="province" className={labelCls}>
                  Tỉnh / Thành phố
                </label>
                <input
                  id="province"
                  className={inputCls}
                  placeholder="TP. Hồ Chí Minh"
                  value={draft.location.province}
                  onChange={(e) => updateNested('location', 'province', e.target.value)}
                />
              </div>
            </div>
          </Section>

          {/* 5. Content */}
          <Section id="section-content" title="Nội dung thiệp" hint="Lời mời trang trọng và câu chuyện tình yêu">
            <div className="grid gap-5">
              <div>
                <label htmlFor="introduction" className={labelCls}>
                  Lời mời chân thành gửi khách
                </label>
                <textarea
                  id="introduction"
                  rows={4}
                  className={textareaCls}
                  placeholder="Sự hiện diện của quý khách là niềm vinh hạnh lớn nhất của gia đình chúng tôi..."
                  value={draft.introduction}
                  onChange={(e) => update({ introduction: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="coupleStory" className={labelCls}>
                  Câu chuyện tình yêu của hai bạn
                </label>
                <textarea
                  id="coupleStory"
                  rows={4}
                  className={textareaCls}
                  placeholder="Từ ánh mắt đầu tiên gặp gỡ cho đến ngày hôm nay..."
                  value={draft.coupleStory}
                  onChange={(e) => update({ coupleStory: e.target.value })}
                />
              </div>
            </div>
          </Section>

          {/* 6. Photos */}
          <Section id="section-photos" title="Album & Hình ảnh" hint="Ảnh đại diện, ảnh đôi và bộ sưu tập kỷ niệm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <PhotoPicker
                label="Ảnh đại diện (Cô dâu / Chú rể)"
                value={draft.avatar}
                onChange={(p) => setPhoto('avatar', p)}
              />
              <PhotoPicker
                label="Ảnh cặp đôi (Ảnh bìa thiệp)"
                value={draft.couplePhoto}
                onChange={(p) => setPhoto('couplePhoto', p)}
              />
            </div>

            <div className="mt-8 border-t border-border/60 pt-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground">Bộ sưu tập ảnh kỷ niệm</p>
                <p className="text-xs font-light text-muted-foreground">Tải ảnh kỷ niệm cưới để hiển thị trong slide ảnh</p>
              </div>
              <GalleryManager
                photos={draft.photos}
                onAddFile={addGalleryFile}
                onAddUrl={addGalleryUrl}
                onRemove={removePhoto}
              />
            </div>
          </Section>

          {/* 7. Extended Features Header */}
          <div id="section-features" className="pt-2 scroll-mt-28">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-terracotta" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
                Tính năng tương tác & Mở rộng
              </h2>
            </div>
            <p className="text-xs font-light text-muted-foreground">
              Bật hoặc tắt các tính năng như RSVP xác nhận tham dự, mừng cưới online, dress code và nhạc nền với công tắc toggle.
            </p>
          </div>

          {/* RSVP */}
          <CollapsibleSection
            id="section-rsvp"
            title="RSVP — Xác nhận tham dự"
            hint="Khách báo trước việc tham dự và số lượng đi cùng"
            icon={<CalendarDays className="h-4 w-4" strokeWidth={1.8} />}
            enabled={draft.rsvp.enabled}
            onToggle={(enabled) => update({ rsvp: { ...draft.rsvp, enabled } })}
          >
            <RsvpEditor
              value={draft.rsvp}
              onChange={(rsvp) => update({ rsvp })}
              hideToggle
            />
          </CollapsibleSection>

          {/* Gift / Banking */}
          <CollapsibleSection
            id="section-gift"
            title="Mừng cưới & Tài khoản ngân hàng"
            hint="Hiển thị số tài khoản và mã QR để khách gửi quà mừng"
            icon={<Gift className="h-4 w-4" strokeWidth={1.8} />}
            enabled={draft.gift.enabled}
            onToggle={(enabled) => update({ gift: { ...draft.gift, enabled } })}
          >
            <GiftEditor
              value={draft.gift}
              onChange={(gift) => update({ gift })}
              hideToggle
            />
          </CollapsibleSection>

          {/* Timeline */}
          <CollapsibleSection
            id="section-timeline"
            title="Lịch trình ngày cưới (Timeline)"
            hint="Các mốc thời gian đón khách, làm lễ, khai tiệc"
            icon={<Timer className="h-4 w-4" strokeWidth={1.8} />}
            badge={`${draft.timeline.length} mốc`}
          >
            <TimelineEditor
              value={draft.timeline}
              onChange={(timeline) => update({ timeline })}
            />
          </CollapsibleSection>

          {/* Dress code */}
          <CollapsibleSection
            id="section-dresscode"
            title="Dress code"
            hint="Gợi ý tông màu trang phục cho khách tham dự"
            icon={<Palette className="h-4 w-4" strokeWidth={1.8} />}
            enabled={draft.dressCode.enabled}
            onToggle={(enabled) => update({ dressCode: { ...draft.dressCode, enabled } })}
          >
            <DressCodeEditor
              value={draft.dressCode}
              onChange={(dressCode) => update({ dressCode })}
              hideToggle
            />
          </CollapsibleSection>

          {/* Music */}
          <CollapsibleSection
            id="section-music"
            title="Nhạc nền đám cưới"
            hint="Tự động phát khi khách mở thiệp (MP3 hoặc link YouTube)"
            icon={<Music className="h-4 w-4" strokeWidth={1.8} />}
            enabled={draft.music.enabled}
            onToggle={(enabled) => update({ music: { ...draft.music, enabled } })}
          >
            <MusicEditor
              value={draft.music}
              onChange={(music) => update({ music })}
              hideToggle
            />
          </CollapsibleSection>

          {/* Guestbook */}
          <CollapsibleSection
            id="section-guestbook"
            title="Sổ lưu bút & Lời chúc"
            hint="Cho phép khách gửi lời chúc mừng chân thành tới đôi bạn"
            icon={<FileSignature className="h-4 w-4" strokeWidth={1.8} />}
            enabled={draft.guestbook.enabled}
            onToggle={(enabled) => update({ guestbook: { ...draft.guestbook, enabled } })}
          >
            <GuestbookEditor
              value={draft.guestbook}
              onChange={(guestbook) => update({ guestbook })}
              hideToggle
            />
          </CollapsibleSection>

          {/* Envelope Greeting */}
          <CollapsibleSection
            id="section-envelope"
            title="Lời chào phong bì thiệp"
            hint="Lời ngỏ trang trọng xuất hiện ở bìa phong thư khi mở thiệp"
            icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}
          >
            <EnvelopeEditor
              value={draft.envelope}
              onChange={(envelope) => update({ envelope })}
            />
          </CollapsibleSection>

          {/* Social Share Image (OG) */}
          <CollapsibleSection
            id="section-og"
            title="Ảnh hiển thị khi chia sẻ (Zalo / Facebook)"
            hint="Ảnh thumbnail xuất hiện khi gửi link thiệp qua tin nhắn hoặc mạng xã hội"
            icon={<ImageIcon className="h-4 w-4" strokeWidth={1.8} />}
          >
            <OgImageEditor
              value={draft.og}
              onChange={(og) => update({ og })}
            />
          </CollapsibleSection>

          {/* Google Maps */}
          <CollapsibleSection
            id="section-map"
            title="Bản đồ chỉ đường (Google Maps)"
            hint="Khung bản đồ dẫn đường trực tiếp đến sảnh tiệc"
            icon={<MapPin className="h-4 w-4" strokeWidth={1.8} />}
            badge={draft.map?.embedUrl ? 'Đã có link bản đồ' : undefined}
          >
            <MapEditor
              value={draft.map}
              onChange={(map) => update({ map })}
            />
          </CollapsibleSection>

          {/* Bottom Action Bar */}
          <div className="flex flex-col gap-3.5 border-t border-border/60 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={togglePublish}
              className="wispic-btn-outline flex-1 !py-3"
            >
              {draft.status === 'published' ? 'Chuyển về bản nháp' : 'Xuất bản thiệp'}
            </button>
            <button
              type="button"
              onClick={forceSaveAndGoBack}
              className="wispic-btn-primary flex-1 !py-3"
            >
              <Check className="h-4 w-4" strokeWidth={2} />
              Lưu xong & Quay lại
            </button>
          </div>
        </div>

        {/* Realtime Phone Mockup Preview (Chungdoi Style) */}
        <div className={cn('flex flex-col gap-3', mobileView === 'edit' && 'hidden xl:flex')}>
          <PhoneMockupPreview
            templateId={draft.templateId}
            wedding={data}
            className="xl:sticky xl:top-20"
          />
        </div>
      </div>
    </div>
  )
}
