import { pool } from './db'
import { ARTICLE_CONTENT, PUBLISHED } from './status'

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
  publishedAt: string | null
  updatedAt: string
}

const LIST_COLUMNS = `
  id, title, slug, excerpt, content, cover_image, category, tags, location,
  author_id, published_at, created_at, updated_at`

function mapArticle(row: Record<string, unknown>): PublicArticle {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    coverImage: (row.cover_image as string | null) ?? null,
    category: row.category as string,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    location: (row.location as string | null) || null,
    authorId: (row.author_id as string | null) ?? null,
    publishedAt: row.published_at ? new Date(row.published_at as string).toISOString() : null,
    updatedAt: new Date(row.updated_at as string).toISOString(),
  }
}

/**
 * Bài Explore đã xuất bản. Luôn kèo `content_type` và `status = 'PUBLISHED'`
 * trong SQL — bộ lọc này phải nằm ở tầng DB để bản nháp không thể lọt qua
 * kể cả khi sau này có thêm endpoint hay cache.
 */
export async function listPublishedExplore(options: { category?: string } = {}) {
  const params: unknown[] = [ARTICLE_CONTENT.EXPLORE, PUBLISHED]
  let filter = ''
  if (options.category) {
    params.push(options.category)
    filter = ` AND category = $${params.length}`
  }

  const { rows } = await pool.query(
    `SELECT ${LIST_COLUMNS} FROM articles
     WHERE content_type = $1 AND status = $2${filter}
     ORDER BY COALESCE(published_at, updated_at) DESC`,
    params
  )
  return rows.map(mapArticle)
}

export async function getPublishedExploreArticle(slug: string) {
  const { rows } = await pool.query(
    `SELECT ${LIST_COLUMNS} FROM articles
     WHERE slug = $1 AND content_type = $2 AND status = $3`,
    [slug, ARTICLE_CONTENT.EXPLORE, PUBLISHED]
  )
  return rows[0] ? mapArticle(rows[0]) : null
}
