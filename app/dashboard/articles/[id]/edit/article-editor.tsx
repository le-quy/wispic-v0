'use client'

import { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  Compass,
  ExternalLink,
  Globe,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
  Sparkles,
} from 'lucide-react'
import type { AdminArticle } from '@/lib/explore'
import { ARTICLE_STATUS } from '@/lib/status'
import { slugify } from '@/lib/slug'
import { apiFetch } from '@/lib/api-client'

export function ArticleEditor({ id }: { id: string }) {
  const [article, setArticle] = useState<AdminArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [status, setStatus] = useState<string>(ARTICLE_STATUS.DRAFT)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiFetch<AdminArticle>(`/api/explore/${id}`, {
          cache: 'no-store',
        })
        if (cancelled || !data) return
        setArticle(data)
        setTitle(data.title || '')
        setSlug(data.slug || '')
        setExcerpt(data.excerpt || '')
        setContent(data.content || '')
        setCategory(data.category || 'Chuyến đi')
        setLocation(data.location || '')
        setCoverImage(data.coverImage || null)
        setTags(Array.isArray(data.tags) ? data.tags : [])
        setStatus(data.status || ARTICLE_STATUS.DRAFT)
      } catch (err) {
        console.error('Không tìm thấy bài viết:', err)
        setErrorMessage('Không thể tải bài viết')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleSlugifyFromTitle = () => {
    if (!title.trim()) return
    const generated = slugify(title)
    setSlug(generated)
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '')
    if (!trimmed) return
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    setErrorMessage(null)
    try {
      const form = new FormData()
      form.append('file', file)

      const res = await apiFetch<{ url: string }>('/api/uploads', {
        method: 'POST',
        body: form,
      })
      if (res?.url) {
        setCoverImage(res.url)
      }
    } catch (err: unknown) {
      console.error('Lỗi tải ảnh:', err)
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Không thể tải ảnh lên. Tối đa 5MB (.jpg, .png, .webp).'
      )
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (overrideStatus?: string) => {
    if (!title.trim()) {
      setErrorMessage('Tiêu đề không được để trống')
      return
    }

    setSaving(true)
    setErrorMessage(null)
    const targetStatus = overrideStatus || status

    try {
      const updated = await apiFetch<AdminArticle>(`/api/explore/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || slugify(title),
          excerpt: excerpt.trim(),
          content,
          category: category.trim() || 'Chuyến đi',
          location: location.trim() || null,
          coverImage,
          tags,
          status: targetStatus,
        }),
      })

      setArticle(updated)
      setStatus(updated.status)
      setSlug(updated.slug)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err: unknown) {
      console.error('Lỗi lưu bài viết:', err)
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Không thể lưu bài viết. Vui lòng kiểm tra lại dữ liệu.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePublish = async () => {
    const nextStatus =
      status === ARTICLE_STATUS.PUBLISHED ? ARTICLE_STATUS.DRAFT : ARTICLE_STATUS.PUBLISHED
    await handleSave(nextStatus)
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xoá bài viết này? Hành động này không thể hoàn tác.')) return
    try {
      await apiFetch(`/api/explore/${id}`, { method: 'DELETE' })
      startTransition(() => {
        window.location.href = '/dashboard/articles'
      })
    } catch (err) {
      console.error('Lỗi xoá bài viết:', err)
      alert('Không thể xoá bài viết.')
    }
  }

  if (loading) {
    return (
      <div className="wispic-container flex min-h-[400px] items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="wispic-container py-16 text-center">
        <p className="text-muted-foreground">Không tìm thấy bài viết.</p>
        <Link href="/dashboard/articles" className="wispic-btn-outline mt-4">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  const isPublished = status === ARTICLE_STATUS.PUBLISHED

  return (
    <div className="wispic-container py-8 md:py-12">
      {/* Top bar */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/dashboard/articles"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
            Danh sách bài viết
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {title || 'Chỉnh sửa bài viết'}
            </h1>
            <span
              className={
                isPublished
                  ? 'rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-light text-emerald-700'
                  : 'rounded-full bg-secondary px-3 py-1 text-xs font-light text-muted-foreground'
              }
            >
              {isPublished ? 'Đang xuất bản' : 'Bản nháp'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isPublished && (
            <Link
              href={`/explore/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="wispic-btn-outline !py-2 !px-3.5 text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Xem trên web
            </Link>
          )}

          <button
            type="button"
            onClick={handleTogglePublish}
            disabled={saving}
            className="wispic-btn-outline !py-2 !px-3.5 text-xs"
          >
            <Globe className="h-3.5 w-3.5 text-terracotta" />
            {isPublished ? 'Gỡ về bản nháp' : 'Xuất bản bài viết'}
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="wispic-btn-primary !py-2 !px-4 text-xs"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : savedSuccess ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {savedSuccess ? 'Đã lưu' : 'Lưu thay đổi'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
            title="Xoá bài viết"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {/* Main form grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left column: Content & Story */}
        <div className="space-y-6 lg:col-span-8">
          {/* Tiêu đề */}
          <div className="wispic-card p-6">
            <label htmlFor="title" className="block text-xs font-medium uppercase tracking-wider text-terracotta">
              Tiêu đề bài viết <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Ký sự chiều Hội An — Nắng vàng trên mái ngói rêu phong"
              className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2.5 font-serif text-lg font-medium text-foreground focus:border-terracotta focus:outline-hidden"
            />
          </div>

          {/* Slug */}
          <div className="wispic-card p-6">
            <div className="flex items-center justify-between">
              <label htmlFor="slug" className="block text-xs font-medium uppercase tracking-wider text-terracotta">
                Đường dẫn slug <span className="text-destructive">*</span>
              </label>
              <button
                type="button"
                onClick={handleSlugifyFromTitle}
                className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline"
              >
                <Sparkles className="h-3 w-3" />
                Tạo từ tiêu đề
              </button>
            </div>
            <div className="mt-2 flex items-center rounded-md border border-border bg-background focus-within:border-terracotta">
              <span className="pl-3.5 text-xs font-light text-muted-foreground">/explore/</span>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ky-su-chieu-hoi-an"
                className="w-full bg-transparent px-2 py-2 text-sm text-foreground focus:outline-hidden"
              />
            </div>
            <p className="mt-1.5 text-[0.75rem] font-light text-muted-foreground">
              Slug định danh duy nhất bài viết trên URL, không dấu, ngăn cách bằng gạch nối.
            </p>
          </div>

          {/* Excerpt */}
          <div className="wispic-card p-6">
            <label htmlFor="excerpt" className="block text-xs font-medium uppercase tracking-wider text-terracotta">
              Lời dẫn dắt (Excerpt)
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Đoạn văn ngắn mở đầu gợi mở cảm xúc, hiển thị dạng serif italic ở đầu bài đọc..."
              className="mt-2 w-full rounded-md border border-border bg-background p-3.5 font-serif text-base italic leading-relaxed text-foreground focus:border-terracotta focus:outline-hidden"
            />
          </div>

          {/* Content */}
          <div className="wispic-card p-6">
            <div className="flex items-center justify-between">
              <label htmlFor="content" className="block text-xs font-medium uppercase tracking-wider text-terracotta">
                Nội dung bài viết (Content)
              </label>
              <span className="text-xs font-light text-muted-foreground">
                {content.length} ký tự
              </span>
            </div>
            <textarea
              id="content"
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết nội dung bài viết ở đây. Ngắt dòng đôi giữa các đoạn để tạo khoảng trống thoáng đãng chuẩn tạp chí..."
              className="mt-2 w-full rounded-md border border-border bg-background p-4 font-sans text-sm font-light leading-relaxed text-foreground focus:border-terracotta focus:outline-hidden"
            />
          </div>
        </div>

        {/* Right column: Metadata, Cover, Tags */}
        <div className="space-y-6 lg:col-span-4">
          {/* Cover image */}
          <div className="wispic-card p-6">
            <label className="block text-xs font-medium uppercase tracking-wider text-terracotta">
              Ảnh bìa (Cover Image)
            </label>

            {coverImage ? (
              <div className="mt-3 space-y-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border">
                  <Image
                    src={coverImage}
                    alt="Cover preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-xs transition-colors hover:bg-destructive hover:text-white"
                    title="Gỡ ảnh"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <label className="wispic-btn-outline w-full cursor-pointer justify-center !py-2 !text-xs">
                    <Upload className="h-3 w-3" />
                    Thay ảnh khác
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <label className="flex aspect-[16/10] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-secondary/20 p-4 transition-colors hover:border-terracotta/60 hover:bg-secondary/40">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
                      <span className="text-xs text-muted-foreground">Đang tải ảnh lên...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Compass className="h-6 w-6 text-terracotta/60" />
                      <span className="text-xs font-medium text-foreground">Bấm để tải ảnh lên</span>
                      <span className="text-[0.7rem] text-muted-foreground">
                        JPG, PNG, WEBP (Tối đa 5MB)
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Chuyên mục & Địa điểm */}
          <div className="wispic-card space-y-4 p-6">
            <div>
              <label htmlFor="category" className="block text-xs font-medium uppercase tracking-wider text-terracotta">
                Chuyên mục
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Chuyến đi, Phóng sự, Cảm xúc..."
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-terracotta focus:outline-hidden"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Chuyến đi', 'Phóng sự', 'Góc nhìn', 'Nhiếp ảnh'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setCategory(sug)}
                    className="rounded-full bg-secondary/70 px-2 py-0.5 text-[0.65rem] text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border/50 pt-4">
              <label htmlFor="location" className="block text-xs font-medium uppercase tracking-wider text-terracotta">
                Địa điểm chụp / diễn ra
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ví dụ: Hội An, Đà Lạt, Phú Yên..."
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-terracotta focus:outline-hidden"
              />
            </div>
          </div>

          {/* Tags dạng chip */}
          <div className="wispic-card p-6">
            <label className="block text-xs font-medium uppercase tracking-wider text-terracotta">
              Thẻ từ khoá (Tags)
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Nhập tag rồi ấn Enter..."
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-terracotta focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
              >
                Thêm
              </button>
            </div>

            {/* Chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <span className="text-xs font-light text-muted-foreground italic">Chưa có tag nào</span>
              ) : (
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-light text-foreground"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-0.5 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Thông tin tác giả & thời gian */}
          <div className="wispic-card p-6 text-xs font-light text-muted-foreground space-y-2">
            <div>
              <span className="font-medium text-foreground">Tác giả:</span>{' '}
              {article.authorName || 'Ban biên tập Wispic'}
            </div>
            <div>
              <span className="font-medium text-foreground">Ngày tạo:</span>{' '}
              {new Date(article.createdAt).toLocaleString('vi-VN')}
            </div>
            <div>
              <span className="font-medium text-foreground">Ngày xuất bản:</span>{' '}
              {article.publishedAt ? new Date(article.publishedAt).toLocaleString('vi-VN') : 'Chưa xuất bản'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
