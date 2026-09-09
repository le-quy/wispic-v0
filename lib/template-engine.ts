import type { WeddingData } from '@/lib/wedding-data'

type TemplateVars = Record<string, unknown>

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function resolveVariable(vars: TemplateVars, varName: string): string {
  const val = getNestedValue(vars, varName)
  if (val === undefined || val === null) return ''
  if (typeof val === 'object' && val !== null && 'url' in (val as Record<string, unknown>)) {
    return String((val as Record<string, unknown>).url ?? '')
  }
  return String(val)
}

function processEach(
  html: string,
  vars: TemplateVars,
  listName: string,
  block: string,
): string {
  const list = vars[listName]
  if (!Array.isArray(list) || list.length === 0) return ''
  return list
    .map((item) => {
      const itemVars: Record<string, unknown> =
        typeof item === 'object' && item !== null
          ? { ...vars, this: item, ...(item as Record<string, unknown>) }
          : { ...vars, this: item }
      return processTemplate(block, itemVars)
    })
    .join('')
}

function processConditional(html: string, vars: TemplateVars, condition: string, block: string): string {
  const val = getNestedValue(vars, condition)
  if (val && typeof val === 'object' && 'url' in (val as Record<string, unknown>)) {
    return (val as Record<string, unknown>).url ? processTemplate(block, vars) : ''
  }
  if (condition.endsWith('.length')) {
    const key = condition.slice(0, -'.length'.length)
    const arr = vars[key]
    return Array.isArray(arr) && arr.length > 0 ? processTemplate(block, vars) : ''
  }
  return val ? processTemplate(block, vars) : ''
}

function processTemplate(html: string, vars: TemplateVars): string {
  let result = html

  // Process {{#each listName}}...{{/each}}
  result = result.replace(
    /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_, listName: string, block: string) => processEach(result, vars, listName, block),
  )

  // Process {{#if varName}}...{{/if}}
  result = result.replace(
    /\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, varName: string, block: string) => processConditional(result, vars, varName, block),
  )

  // Process simple {{variable}}
  result = result.replace(/\{\{([\w.]+)\}\}/g, (_, varName: string) => {
    return escapeHtml(resolveVariable(vars, varName))
  })

  return result
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function renderCustomTemplate(
  html: string,
  css: string,
  wedding: WeddingData,
): string {
  const vars: TemplateVars = {
    groom: wedding.groom,
    bride: wedding.bride,
    groomParents: wedding.groomParents,
    brideParents: wedding.brideParents,
    weddingDate: wedding.weddingDate,
    ceremony: wedding.ceremony,
    reception: wedding.reception,
    location: wedding.location,
    introduction: wedding.introduction,
    coupleStory: wedding.coupleStory,
    avatar: wedding.avatar,
    couplePhoto: wedding.couplePhoto,
    photos: wedding.photos,
  }

  const body = processTemplate(html, vars)

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Be+Vietnam+Pro:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Be Vietnam Pro', 'Be Vietnam', sans-serif;
      font-weight: 300;
      color: #302b27;
      background: #f7f3ee;
      -webkit-font-smoothing: antialiased;
    }
    img { max-width: 100%; display: block; }
    ${css}
  </style>
</head>
<body>
  ${body}
</body>
</html>`
}

export const TEMPLATE_VARIABLES = [
  { name: 'groom', label: 'Tên chú rể' },
  { name: 'bride', label: 'Tên cô dâu' },
  { name: 'groomParents', label: 'Bố mẹ chú rể' },
  { name: 'brideParents', label: 'Bố mẹ cô dâu' },
  { name: 'weddingDate', label: 'Ngày cưới' },
  { name: 'ceremony.time', label: 'Giờ lễ' },
  { name: 'ceremony.date', label: 'Ngày lễ' },
  { name: 'reception.time', label: 'Giờ tiệc' },
  { name: 'reception.description', label: 'Mô tả tiệc' },
  { name: 'location.city', label: 'Thành phố' },
  { name: 'location.province', label: 'Tỉnh' },
  { name: 'location.venueName', label: 'Địa điểm' },
  { name: 'introduction', label: 'Lời mời' },
  { name: 'coupleStory', label: 'Câu chuyện' },
  { name: 'avatar.url', label: 'Ảnh đại diện (URL)' },
  { name: 'couplePhoto.url', label: 'Ảnh cặp đôi (URL)' },
] as const
