import { pool } from './db'
import {
  ARTICLE_CONTENT,
  ARTICLE_STATUS,
  PUBLISHED,
  type ArticleContentType,
  type ArticleStatus,
} from './status'
import { uniqueSlug } from './slug'

export type PublicArticle = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  category: string
  tags: string[]
  location: string | null
  authorId: string | null
  authorName: string | null
  publishedAt: string | null
  updatedAt: string
}

export type AdminArticle = PublicArticle & {
  status: ArticleStatus
  contentType: ArticleContentType
  createdAt: string
}

/**
 * Cột SELECT tiêu chuẩn, JOIN users để lấy tên tác giả hiển thị.
 * Dùng alias rõ ràng để tránh xung đột id/created_at giữa hai bảng.
 */
const ARTICLE_SELECT = `
  SELECT
    a.id, a.content_type, a.title, a.slug, a.excerpt, a.content,
    a.cover_image, a.category, a.tags, a.location, a.author_id,
    a.status, a.published_at, a.created_at, a.updated_at,
    u.name AS author_name
  FROM articles a
  LEFT JOIN users u ON a.author_id = u.id`

function mapPublicArticle(row: Record<string, unknown>): PublicArticle {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: (row.excerpt as string) || '',
    content: (row.content as string) || '',
    coverImage: (row.cover_image as string | null) ?? null,
    category: (row.category as string) || '',
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    location: (row.location as string | null) || null,
    authorId: (row.author_id as string | null) ?? null,
    authorName: (row.author_name as string | null) || null,
    publishedAt: row.published_at ? new Date(row.published_at as string).toISOString() : null,
    updatedAt: new Date(row.updated_at as string).toISOString(),
  }
}

function mapAdminArticle(row: Record<string, unknown>): AdminArticle {
  return {
    ...mapPublicArticle(row),
    status: (row.status as ArticleStatus) || ARTICLE_STATUS.DRAFT,
    contentType: (row.content_type as ArticleContentType) || ARTICLE_CONTENT.EXPLORE,
    createdAt: new Date(row.created_at as string).toISOString(),
  }
}

/**
 * Bài Explore đã xuất bản. Luôn kèm `content_type` và `status = 'PUBLISHED'`
 * trong SQL — bộ lọc này phải nằm ở tầng DB để bản nháp không thể lọt qua.
 */
export async function listPublishedExplore(options: { category?: string } = {}): Promise<PublicArticle[]> {
  const params: unknown[] = [ARTICLE_CONTENT.EXPLORE, PUBLISHED]
  let filter = ''
  if (options.category) {
    params.push(options.category)
    filter = ` AND a.category = $${params.length}`
  }

  const { rows } = await pool.query(
    `${ARTICLE_SELECT}
     WHERE a.content_type = $1 AND a.status = $2${filter}
     ORDER BY COALESCE(a.published_at, a.updated_at) DESC`,
    params
  )
  return rows.map(mapPublicArticle)
}

/**
 * Chi tiết bài viết đã xuất bản theo slug. Lọc PUBLISHED cố định trong SQL.
 */
export async function getPublishedExploreArticle(slug: string): Promise<PublicArticle | null> {
  const { rows } = await pool.query(
    `${ARTICLE_SELECT}
     WHERE a.slug = $1 AND a.content_type = $2 AND a.status = $3`,
    [slug, ARTICLE_CONTENT.EXPLORE, PUBLISHED]
  )
  return rows[0] ? mapPublicArticle(rows[0]) : null
}

/**
 * Danh sách các chuyên mục hiện có ít nhất 1 bài PUBLISHED.
 * Không hardcode để thanh filter luôn phản ánh dữ liệu thực tế.
 */
export async function listPublishedExploreCategories(): Promise<string[]> {
  const { rows } = await pool.query(
    `SELECT DISTINCT category FROM articles
     WHERE content_type = $1 AND status = $2 AND category != ''
     ORDER BY category ASC`,
    [ARTICLE_CONTENT.EXPLORE, PUBLISHED]
  )
  return rows.map((r) => r.category as string)
}

/**
 * 3 bài viết cùng chuyên mục gần nhất (loại trừ bài hiện tại).
 * Bộ lọc PUBLISHED và content_type được bảo đảm trong SQL.
 */
export async function listRelatedExplore(
  currentSlug: string,
  category: string,
  limit = 3
): Promise<PublicArticle[]> {
  const { rows } = await pool.query(
    `${ARTICLE_SELECT}
     WHERE a.content_type = $1 AND a.status = $2 AND a.category = $3 AND a.slug != $4
     ORDER BY COALESCE(a.published_at, a.updated_at) DESC
     LIMIT $5`,
    [ARTICLE_CONTENT.EXPLORE, PUBLISHED, category, currentSlug, limit]
  )
  return rows.map(mapPublicArticle)
}

/* ==========================================================================
 * ADMIN API & QUẢN TRỊ BÀI VIẾT (NHIỆM VỤ 3)
 * ========================================================================== */

/**
 * Lấy toàn bộ danh sách bài viết Explore cho trang admin.
 */
export async function listAllExploreArticles(options: {
  category?: string
  status?: string
} = {}): Promise<AdminArticle[]> {
  const params: unknown[] = [ARTICLE_CONTENT.EXPLORE]
  let filter = ''

  if (options.category) {
    params.push(options.category)
    filter += ` AND a.category = $${params.length}`
  }

  if (options.status && options.status !== 'all') {
    params.push(options.status)
    filter += ` AND a.status = $${params.length}`
  }

  const { rows } = await pool.query(
    `${ARTICLE_SELECT}
     WHERE a.content_type = $1${filter}
     ORDER BY COALESCE(a.published_at, a.updated_at) DESC`,
    params
  )
  return rows.map(mapAdminArticle)
}

/**
 * Lấy bài viết theo ID hoặc slug (phục vụ editor và API quản trị).
 */
export async function getExploreArticleByIdOrSlug(idOrSlug: string): Promise<AdminArticle | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)

  const { rows } = await pool.query(
    `${ARTICLE_SELECT}
     WHERE a.content_type = $1 AND ${isUuid ? '(a.id = $2 OR a.slug = $2)' : 'a.slug = $2'}`,
    [ARTICLE_CONTENT.EXPLORE, idOrSlug]
  )
  return rows[0] ? mapAdminArticle(rows[0]) : null
}

export type CreateArticleInput = {
  title: string
  slug?: string
  excerpt?: string
  content?: string
  coverImage?: string | null
  category?: string
  tags?: string[]
  location?: string | null
  authorId?: string | null
  status?: ArticleStatus
}

/**
 * Tạo mới một bài viết Explore. Tự động sinh slug duy nhất nếu chưa có.
 */
export async function createExploreArticle(input: CreateArticleInput): Promise<AdminArticle> {
  const slug = await uniqueSlug(pool, 'articles', input.slug || input.title || 'bai-viet-moi')
  const status = input.status || ARTICLE_STATUS.DRAFT
  const publishedAt = status === ARTICLE_STATUS.PUBLISHED ? new Date() : null

  const { rows } = await pool.query(
    `INSERT INTO articles (
       content_type, title, slug, excerpt, content, cover_image,
       category, tags, location, author_id, status, published_at, created_at, updated_at
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
     RETURNING id`,
    [
      ARTICLE_CONTENT.EXPLORE,
      input.title,
      slug,
      input.excerpt || '',
      input.content || '',
      input.coverImage || null,
      input.category || 'Chuyến đi',
      JSON.stringify(input.tags || []),
      input.location || '',
      input.authorId || null,
      status,
      publishedAt,
    ]
  )

  const createdId = rows[0].id as string
  const article = await getExploreArticleByIdOrSlug(createdId)
  if (!article) throw new Error('Không thể tải bài viết vừa tạo')
  return article
}

export type UpdateArticleInput = Partial<{
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  category: string
  tags: string[]
  location: string | null
  status: ArticleStatus
}>

/**
 * Cập nhật bài viết. Xử lý logic publish/unpublish:
 * - Khi chuyển sang PUBLISHED lần đầu: ghi nhận `published_at = NOW()`.
 * - Khi đổi slug: đảm bảo tính duy nhất qua `uniqueSlug`.
 */
export async function updateExploreArticle(
  idOrSlug: string,
  input: UpdateArticleInput
): Promise<AdminArticle | null> {
  const current = await getExploreArticleByIdOrSlug(idOrSlug)
  if (!current) return null

  let targetSlug = current.slug
  if (input.slug !== undefined && input.slug.trim() && input.slug !== current.slug) {
    targetSlug = await uniqueSlug(pool, 'articles', input.slug, current.id)
  }

  const nextStatus = input.status !== undefined ? input.status : current.status
  // Nếu publish lần đầu (chưa có publishedAt), gán thời điểm hiện tại
  let nextPublishedAt: string | null = current.publishedAt
  if (nextStatus === ARTICLE_STATUS.PUBLISHED && !current.publishedAt) {
    nextPublishedAt = new Date().toISOString()
  }

  await pool.query(
    `UPDATE articles SET
       title = COALESCE($1, title),
       slug = $2,
       excerpt = COALESCE($3, excerpt),
       content = COALESCE($4, content),
       cover_image = $5,
       category = COALESCE($6, category),
       tags = COALESCE($7, tags),
       location = COALESCE($8, location),
       status = $9,
       published_at = $10,
       updated_at = NOW()
     WHERE id = $11 AND content_type = $12`,
    [
      input.title !== undefined ? input.title : null,
      targetSlug,
      input.excerpt !== undefined ? input.excerpt : null,
      input.content !== undefined ? input.content : null,
      input.coverImage !== undefined ? input.coverImage : current.coverImage,
      input.category !== undefined ? input.category : null,
      input.tags !== undefined ? JSON.stringify(input.tags) : null,
      input.location !== undefined ? input.location : null,
      nextStatus,
      nextPublishedAt,
      current.id,
      ARTICLE_CONTENT.EXPLORE,
    ]
  )

  return getExploreArticleByIdOrSlug(current.id)
}

/**
 * Đổi trạng thái giữa DRAFT và PUBLISHED.
 */
export async function toggleExploreArticlePublish(idOrSlug: string): Promise<AdminArticle | null> {
  const current = await getExploreArticleByIdOrSlug(idOrSlug)
  if (!current) return null

  const nextStatus =
    current.status === ARTICLE_STATUS.PUBLISHED ? ARTICLE_STATUS.DRAFT : ARTICLE_STATUS.PUBLISHED

  return updateExploreArticle(current.id, { status: nextStatus })
}

/**
 * Xoá một bài viết Explore theo ID hoặc slug.
 */
export async function deleteExploreArticle(idOrSlug: string): Promise<boolean> {
  const current = await getExploreArticleByIdOrSlug(idOrSlug)
  if (!current) return false

  const { rowCount } = await pool.query(
    `DELETE FROM articles WHERE id = $1 AND content_type = $2`,
    [current.id, ARTICLE_CONTENT.EXPLORE]
  )
  return !!rowCount && rowCount > 0
}
