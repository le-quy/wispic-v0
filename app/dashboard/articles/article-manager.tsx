'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Compass,
  ExternalLink,
  Loader2,
  PenLine,
  Plus,
  Trash2,
} from 'lucide-react'
import type { AdminArticle } from '@/lib/explore'
import { ARTICLE_STATUS } from '@/lib/status'
import { apiFetch } from '@/lib/api-client'

function formatDateVN(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function ArticleManager() {
  const [articles, setArticles] = useState<AdminArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  const loadArticles = async () => {
    try {
      const data = await apiFetch<AdminArticle[]>('/api/explore?all=true', {
        cache: 'no-store',
      })
      setArticles(data || [])
    } catch (err) {
      console.error('Không thể tải danh sách bài viết:', err)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const handleCreate = async () => {
    if (creating) return
    setCreating(true)
    try {
      const newArticle = await apiFetch<AdminArticle>('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Bài viết chưa đặt tên',
          category: 'Chuyến đi',
          status: ARTICLE_STATUS.DRAFT,
        }),
      })
      window.location.href = `/dashboard/articles/${newArticle.id}/edit`
    } catch (err) {
      console.error('Lỗi tạo bài viết:', err)
      alert('Không thể tạo bài viết mới. Vui lòng thử lại.')
      setCreating(false)
    }
  }

  const handleTogglePublish = async (article: AdminArticle) => {
    setActionId(article.id)
    try {
      await apiFetch<AdminArticle>(`/api/explore/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-publish' }),
      })
      await loadArticles()
    } catch (err) {
      console.error('Lỗi đổi trạng thái bài viết:', err)
      alert('Không thể cập nhật trạng thái bài viết.')
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async (article: AdminArticle) => {
    if (!confirm(`Bạn có chắc muốn xoá bài viết "${article.title}"?`)) return
    setActionId(article.id)
    try {
      await apiFetch(`/api/explore/${article.id}`, {
        method: 'DELETE',
      })
      setArticles((prev) => prev.filter((a) => a.id !== article.id))
    } catch (err) {
      console.error('Lỗi xoá bài viết:', err)
      alert('Không thể xoá bài viết.')
    } finally {
      setActionId(null)
    }
  }

  const total = articles.length
  const publishedCount = articles.filter((a) => a.status === ARTICLE_STATUS.PUBLISHED).length
  const draftCount = articles.filter((a) => a.status === ARTICLE_STATUS.DRAFT).length

  if (loading) {
    return (
      <div className="wispic-container flex min-h-[400px] items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
      </div>
    )
  }

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
              Quản lý bài viết Explore
            </h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              Soạn thảo, xuất bản và cập nhật các câu chuyện chuyến đi, ký sự ảnh của Wispic.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="wispic-btn-primary !px-5 !py-2.5"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={2} />
            )}
            Soạn bài mới
          </button>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="wispic-card p-5">
            <span className="text-xs font-light text-muted-foreground">Tổng bài viết</span>
            <p className="mt-2 font-serif text-2xl font-medium text-foreground">{total}</p>
          </div>
          <div className="wispic-card p-5">
            <span className="text-xs font-light text-muted-foreground">Đang xuất bản</span>
            <p className="mt-2 font-serif text-2xl font-medium text-emerald-700">{publishedCount}</p>
          </div>
          <div className="wispic-card p-5">
            <span className="text-xs font-light text-muted-foreground">Bản nháp</span>
            <p className="mt-2 font-serif text-2xl font-medium text-muted-foreground">{draftCount}</p>
          </div>
        </div>

        {/* Danh sách bài viết */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="wispic-label">Danh sách bài viết</h2>
            <span className="text-xs font-light text-muted-foreground">
              {articles.length} bài
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="wispic-card flex flex-col items-center px-6 py-16 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <Compass className="h-6 w-6 text-terracotta" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 font-serif text-xl font-medium text-foreground">
                Chưa có bài viết nào
              </h3>
              <p className="mt-2 max-w-sm text-sm font-light text-muted-foreground">
                Tạo bài viết đầu tiên để chia sẻ những câu chuyện và góc nhìn của Wispic lên trang Explore.
              </p>
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="wispic-btn-primary mt-6 !px-6"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Soạn bài đầu tiên
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/70 bg-card">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-secondary/30 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3.5">Tiêu đề & Trích dẫn</th>
                    <th className="px-4 py-3.5">Chuyên mục</th>
                    <th className="px-4 py-3.5">Trạng thái</th>
                    <th className="px-4 py-3.5">Ngày đăng / cập nhật</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {articles.map((article) => {
                    const isPublished = article.status === ARTICLE_STATUS.PUBLISHED
                    const isBusy = actionId === article.id

                    return (
                      <tr key={article.id} className="transition-colors hover:bg-secondary/20">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            {article.coverImage ? (
                              <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border/50">
                                <Image
                                  src={article.coverImage}
                                  alt={article.title}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-md border border-border/50 bg-secondary/50">
                                <Compass className="h-5 w-5 text-terracotta/40" />
                              </div>
                            )}
                            <div className="min-w-0 max-w-md">
                              <p className="truncate font-medium text-foreground">
                                {article.title || 'Bài viết chưa đặt tên'}
                              </p>
                              <p className="truncate text-xs font-light text-muted-foreground">
                                /explore/{article.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-light text-secondary-foreground">
                            {article.category || 'Chưa phân loại'}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={
                              isPublished
                                ? 'rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.7rem] font-light text-emerald-700'
                                : 'rounded-full bg-secondary px-2.5 py-1 text-[0.7rem] font-light text-muted-foreground'
                            }
                          >
                            {isPublished ? 'Đang xuất bản' : 'Bản nháp'}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-xs font-light text-muted-foreground">
                          {formatDateVN(article.publishedAt || article.updatedAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isPublished && (
                              <Link
                                href={`/explore/${article.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                title="Xem bài viết công khai"
                              >
                                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                              </Link>
                            )}
                            <Link
                              href={`/dashboard/articles/${article.id}/edit`}
                              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-light text-foreground transition-colors hover:bg-secondary"
                            >
                              <PenLine className="h-3 w-3 text-terracotta" strokeWidth={1.8} />
                              Sửa
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(article)}
                              disabled={isBusy}
                              className="rounded-full border border-border px-3 py-1 text-xs font-light text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:opacity-50"
                              title={
                                isPublished ? 'Gỡ bài về bản nháp' : 'Xuất bản bài viết lên Explore'
                              }
                            >
                              {isPublished ? 'Gỡ bài' : 'Xuất bản'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(article)}
                              disabled={isBusy}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-50"
                              title="Xoá bài viết"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
