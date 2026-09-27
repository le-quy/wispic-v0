export function mapRowToTemplate(row: any) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    previewImage: row.preview_image,
    category: row.category,
    description: row.description,
    swatches: parseJson(row.swatches, ['#f7f3ee', '#302b27']),
    accent: row.accent,
    html: row.html,
    css: row.css,
    sections: parseJson(row.sections, []),
    isCustom: row.is_custom,
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  }
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }
  return value as T
}
