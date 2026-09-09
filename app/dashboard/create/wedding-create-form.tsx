'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Eye, PenLine, Save } from 'lucide-react'
import {
  createDraftFromTemplate,
  createWedding,
  newPhoto,
  DEFAULT_TEMPLATE_ID,
  toWeddingData,
} from '@/lib/wedding-storage'
import type { WeddingData, WeddingPhoto } from '@/lib/wedding-data'
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

function initialData(): WeddingData {
  const draft = createDraftFromTemplate()
  return toWeddingData(draft)
}

export function CreateWedding() {
  const router = useRouter()
  const [data, setData] = useState<WeddingData>(initialData)
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const [saved, setSaved] = useState(false)

  const templateInfo = useTemplateInfo(templateId)

  const set = <K extends keyof WeddingData>(key: K, value: WeddingData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }))

  const setNested = (
    key: 'ceremony' | 'reception' | 'location',
    field: string,
    value: string,
  ) =>
    setData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as Record<string, string>), [field]: value },
    }))

  const setPhoto = (key: 'avatar' | 'couplePhoto', photo: WeddingPhoto | null) =>
    setData((prev) => ({ ...prev, [key]: photo }))

  const setPhotos = (photos: WeddingPhoto[]) => set('photos', photos)

  const addGalleryFile = async (file: File) => {
    const url = await readFileAsDataUrl(file)
    setPhotos([...data.photos, newPhoto(url, 'Kỷ niệm')])
  }

  const addGalleryUrl = (url: string) => {
    if (!url.trim()) return
    setPhotos([...data.photos, newPhoto(url.trim(), 'Kỷ niệm')])
  }

  const removePhoto = (photoId: string) =>
    setPhotos(data.photos.filter((p) => p.id !== photoId))

  const handleSave = async (status: 'draft' | 'published') => {
    // Lấy userId từ session hiện tại
    let userId: string | undefined
    try {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' })
      if (meRes.ok) {
        const me = await meRes.json()
        userId = me.id
      }
    } catch {}

    const draft = createDraftFromTemplate(templateId, userId)
    const now = Date.now()
    const next = {
      ...draft,
      ...data,
      id: draft.id,
      userId,
      templateId,
      title: data.groom
        ? `${data.groom} & ${data.bride || 'Cô dâu'}`
        : 'Thiệp cưới chưa đặt tên',
      status,
      createdAt: now,
      updatedAt: now,
    }
    await createWedding(next)
    setSaved(true)
    setTimeout(() => router.push('/dashboard'), 400)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="wispic-label">Tạo thiệp mới</p>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Thiệp cưới của hai bạn
        </h1>
        <p className="mt-2 max-w-xl text-pretty font-light leading-relaxed text-muted-foreground">
          Điền thông tin cơ bản, chọn mẫu và xem trước trực tiếp rồi lưu. Thiệp sẽ
          xuất hiện trong danh sách quản lý của bạn.
        </p>
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
        <form
          className={cn(
            'flex flex-col gap-6',
            mobileView === 'preview' && 'hidden xl:flex',
          )}
          onSubmit={(e) => {
            e.preventDefault()
            handleSave('draft')
          }}
        >
          <TemplateGallery activeId={templateId} onSelect={setTemplateId} />

          <Section title="Cô dâu & chú rể">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="groom" className={labelCls}>
                  Tên chú rể
                </label>
                <input
                  id="groom"
                  className={inputCls}
                  value={data.groom}
                  onChange={(e) => set('groom', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="bride" className={labelCls}>
                  Tên cô dâu
                </label>
                <input
                  id="bride"
                  className={inputCls}
                  value={data.bride}
                  onChange={(e) => set('bride', e.target.value)}
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
                  value={data.groomParents}
                  onChange={(e) => set('groomParents', e.target.value)}
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
                  value={data.brideParents}
                  onChange={(e) => set('brideParents', e.target.value)}
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
                  value={data.weddingDate}
                  onChange={(e) => set('weddingDate', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ceremonyTime" className={labelCls}>
                  Giờ lễ
                </label>
                <input
                  id="ceremonyTime"
                  className={inputCls}
                  value={data.ceremony.time}
                  onChange={(e) => setNested('ceremony', 'time', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="receptionTime" className={labelCls}>
                  Giờ tiệc
                </label>
                <input
                  id="receptionTime"
                  className={inputCls}
                  value={data.reception.time}
                  onChange={(e) => setNested('reception', 'time', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ceremonyDate" className={labelCls}>
                  Ngày lễ (chi tiết)
                </label>
                <input
                  id="ceremonyDate"
                  className={inputCls}
                  value={data.ceremony.date}
                  onChange={(e) => setNested('ceremony', 'date', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="receptionDesc" className={labelCls}>
                  Tiệc cưới (ghi chú)
                </label>
                <input
                  id="receptionDesc"
                  className={inputCls}
                  value={data.reception.description}
                  onChange={(e) => setNested('reception', 'description', e.target.value)}
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
                  value={data.location.venueName}
                  onChange={(e) => setNested('location', 'venueName', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="city" className={labelCls}>
                  Thành phố
                </label>
                <input
                  id="city"
                  className={inputCls}
                  value={data.location.city}
                  onChange={(e) => setNested('location', 'city', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="province" className={labelCls}>
                  Tỉnh
                </label>
                <input
                  id="province"
                  className={inputCls}
                  value={data.location.province}
                  onChange={(e) => setNested('location', 'province', e.target.value)}
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
                  value={data.introduction}
                  onChange={(e) => set('introduction', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="coupleStory" className={labelCls}>
                  Câu chuyện của hai bạn
                </label>
                <textarea
                  id="coupleStory"
                  className={textareaCls}
                  value={data.coupleStory}
                  onChange={(e) => set('coupleStory', e.target.value)}
                />
              </div>
            </div>
          </Section>

          <Section title="Ảnh" hint="Ảnh đại diện & ảnh cặp đôi">
            <div className="grid grid-cols-2 gap-4">
              <PhotoPicker
                label="Ảnh đại diện"
                value={data.avatar}
                onChange={(p) => setPhoto('avatar', p)}
              />
              <PhotoPicker
                label="Ảnh cặp đôi"
                value={data.couplePhoto}
                onChange={(p) => setPhoto('couplePhoto', p)}
              />
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-foreground">Bộ sưu tập</p>
              <GalleryManager
                photos={data.photos}
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
            <RsvpEditor value={data.rsvp} onChange={(rsvp) => set('rsvp', rsvp)} />
          </CollapsibleSection>

          <CollapsibleSection
            title="Mừng cưới"
            hint="Tài khoản ngân hàng & QR"
            icon={<Gift className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <GiftEditor value={data.gift} onChange={(gift) => set('gift', gift)} />
          </CollapsibleSection>

          <CollapsibleSection
            title="Lịch trình buổi tiệc"
            hint="Timeline sự kiện"
            icon={<Timer className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <TimelineEditor
              value={data.timeline}
              onChange={(timeline) => set('timeline', timeline)}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Dress code"
            hint="Màu gợi ý trang phục"
            icon={<Palette className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <DressCodeEditor
              value={data.dressCode}
              onChange={(dressCode) => set('dressCode', dressCode)}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Nhạc nền"
            hint="Nhạc khi mở thiệp"
            icon={<Music className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <MusicEditor value={data.music} onChange={(music) => set('music', music)} />
          </CollapsibleSection>

          <CollapsibleSection
            title="Lời chúc (Guest book)"
            hint="Khách gửi lời chúc"
            icon={<FileSignature className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <GuestbookEditor
              value={data.guestbook}
              onChange={(guestbook) => set('guestbook', guestbook)}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Phong bì thiệp"
            hint="Lời chào trên phong bì"
            icon={<Mail className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <EnvelopeEditor
              value={data.envelope}
              onChange={(envelope) => set('envelope', envelope)}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Ảnh chia sẻ (OG)"
            hint="Ảnh khi chia sẻ link"
            icon={<ImageIcon className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <OgImageEditor value={data.og} onChange={(og) => set('og', og)} />
          </CollapsibleSection>

          <CollapsibleSection
            title="Bản đồ"
            hint="Google Maps chỉ đường"
            icon={<MapPin className="h-4 w-4 text-terracotta" strokeWidth={1.8} />}
          >
            <MapEditor value={data.map} onChange={(map) => set('map', map)} />
          </CollapsibleSection>

          <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="wispic-btn-outline flex-1"
              disabled={saved}
            >
              <Save className="h-4 w-4" strokeWidth={1.8} />
              {saved ? 'Đã lưu — chuyển đến danh sách...' : 'Lưu bản nháp'}
            </button>
            <button
              type="submit"
              className="wispic-btn-primary flex-1"
              disabled={saved}
            >
              <Check className="h-4 w-4" strokeWidth={2} />
              Lưu thiệp
            </button>
          </div>
        </form>

        {/* Realtime preview */}
        <div className={cn('flex flex-col gap-3', mobileView === 'edit' && 'hidden xl:flex')}>
          <div className="flex items-center justify-between">
            <p className="wispic-label">Xem trước trực tiếp</p>
            <span className="text-xs font-light text-muted-foreground">
              Mẫu {templateInfo.name}
            </span>
          </div>
          <div className="wispic-card overflow-hidden scrollbar-hide xl:sticky xl:top-24 xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto">
            <TemplatePreview templateId={templateId} wedding={data} />
          </div>
        </div>
      </div>
    </div>
  )
}