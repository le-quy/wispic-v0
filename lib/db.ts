import { Pool } from 'pg'

// Initial in-memory seed data
interface UserRow {
  id: string
  email: string
  password?: string
  name: string
  role: 'admin' | 'user'
  created_at: Date
  updated_at: Date
}

interface TemplateRow {
  id: string
  name: string
  category: string
  description: string
  swatches: string
  accent: string
  html: string
  css: string
  is_custom: boolean
  created_at: Date
  updated_at: Date
}

interface WeddingRow {
  id: string
  user_id: string | null
  template_id: string
  title: string
  status: string
  groom: string
  bride: string
  groom_parents: string
  bride_parents: string
  wedding_date: string
  ceremony: any
  reception: any
  location: any
  introduction: string
  couple_story: string
  avatar_url: string | null
  avatar_alt: string | null
  couple_photo_url: string | null
  couple_photo_alt: string | null
  rsvp_enabled: boolean
  rsvp_display_mode: string
  rsvp_max_guest_count: number
  gift_enabled: boolean
  gift_display_mode: string
  gift_title: string
  dress_code_enabled: boolean
  dress_code_title: string
  dress_code_subtitle: string
  music_enabled: boolean
  music_url: string
  music_title: string
  guestbook_enabled: boolean
  envelope_greeting: string
  og_style: string
  og_custom_url: string
  map_embed_url: string
  map_address: string
  created_at: Date
  updated_at: Date
}

// In-memory tables
const memoryUsers: UserRow[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@local.com',
    password: 'admin',
    name: 'Quản trị viên',
    role: 'admin',
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    email: 'user@local.com',
    password: 'user',
    name: 'Người dùng',
    role: 'user',
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
]

const memoryTemplates: TemplateRow[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Lãng mạn',
    category: 'Editorial',
    description: 'Serif duyên dáng, ảnh toàn màn hình, phong cách nhiếp ảnh.',
    swatches: JSON.stringify(['#f7f3ee', '#302b27']),
    accent: '#9b8878',
    html: '',
    css: '',
    is_custom: false,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Thanh xuân',
    category: 'Hiện đại',
    description: 'Bố cục lệch tối giản, trắng – than và điểm nhấn cam đất.',
    swatches: JSON.stringify(['#fbfaf7', '#1f1d1b']),
    accent: '#d97832',
    html: '',
    css: '',
    is_custom: false,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Song Hỷ',
    category: 'Truyền thống',
    description: 'Đỏ son – vàng kim, kính mời song thân, nét Việt trang trọng.',
    swatches: JSON.stringify(['#7d1f1f', '#e8c15a']),
    accent: '#c9a227',
    html: '',
    css: '',
    is_custom: false,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
]

const memoryWeddings: WeddingRow[] = [
  {
    id: 'demo-wedding-01',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    template_id: 'romantic',
    title: 'Hôn lễ Wis & Paoziiee',
    status: 'published',
    groom: 'Wis',
    bride: 'Paoziiee',
    groom_parents: 'Ông Minh Châu & Bà Thu Hà',
    bride_parents: 'Ông Đình Quân & Bà Thanh Lan',
    wedding_date: '20 · 10 · 2026',
    ceremony: { time: '10:00', date: '20 tháng 10, 2026' },
    reception: { time: '18:00', description: 'Tiệc cưới' },
    location: { city: 'Đà Lạt', province: 'Lâm Đồng', venueName: 'Ana Mandara Villas Dalat Resort & Spa' },
    introduction: 'Có những ngày đẹp như một bài thơ, và ngày chúng mình về chung một nhà là ngày đẹp nhất. Chúng mình muốn ghi dấu khoảnh khắc này cùng những người thân thương nhất.',
    couple_story: 'Gặp nhau vào một chiều thu Hà Nội năm 2020. Sau 6 năm cùng nhau đi qua bao chuyến đi, những buổi chiều hoàng hôn Đà Lạt và những tách cà phê sớm, chúng mình quyết định viết tiếp câu chuyện đời bằng một đám cưới ấm cúng.',
    avatar_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    avatar_alt: 'Wis & Paoziiee',
    couple_photo_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85',
    couple_photo_alt: 'Cặp đôi',
    rsvp_enabled: true,
    rsvp_display_mode: 'button',
    rsvp_max_guest_count: 5,
    gift_enabled: true,
    gift_display_mode: 'button',
    gift_title: 'Mừng cưới',
    dress_code_enabled: true,
    dress_code_title: 'Dress Code',
    dress_code_subtitle: 'Tông màu hoà cùng ngày vui',
    music_enabled: false,
    music_url: '',
    music_title: '',
    guestbook_enabled: true,
    envelope_greeting: 'Mời bạn đến chia sẻ niềm vui cùng chúng mình',
    og_style: 'envelope',
    og_custom_url: '',
    map_embed_url: '',
    map_address: 'Ana Mandara Villas Dalat, Lê Lai, Phường 5, TP. Đà Lạt',
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
]

const memoryPhotos: any[] = [
  { id: 'ph-1', wedding_id: 'demo-wedding-01', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', alt: 'Kỷ niệm 1', sort_order: 0 },
  { id: 'ph-2', wedding_id: 'demo-wedding-01', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85', alt: 'Kỷ niệm 2', sort_order: 1 },
]
const memoryRsvpQuestions: any[] = []
const memoryGiftAccounts: any[] = []
const memoryTimelineEvents: any[] = [
  { id: 'tl-1', wedding_id: 'demo-wedding-01', time: '17:30', title: 'Đón khách', sort_order: 0 },
  { id: 'tl-2', wedding_id: 'demo-wedding-01', time: '18:00', title: 'Chụp ảnh kỷ niệm', sort_order: 1 },
  { id: 'tl-3', wedding_id: 'demo-wedding-01', time: '19:00', title: 'Tiệc chính thức', sort_order: 2 },
]
const memoryDressCodeColors: any[] = [
  { id: 'dc-1', wedding_id: 'demo-wedding-01', color: '#6F7558', sort_order: 0 },
  { id: 'dc-2', wedding_id: 'demo-wedding-01', color: '#F7F2E9', sort_order: 1 },
]
const memoryGuestbookQuestions: any[] = []

function buildWeddingFullRow(w: WeddingRow) {
  const photos = memoryPhotos
    .filter((p) => p.wedding_id === w.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => ({ id: p.id, url: p.url, alt: p.alt, sort_order: p.sort_order }))

  const rsvpQuestions = memoryRsvpQuestions
    .filter((q) => q.wedding_id === w.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((q) => ({ id: q.id, text: q.text, type: q.type }))

  const giftAccounts = memoryGiftAccounts
    .filter((g) => g.wedding_id === w.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((g) => ({ id: g.id, bank_name: g.bank_name, account_number: g.account_number, holder_name: g.holder_name, qr_url: g.qr_url }))

  const timelineEvents = memoryTimelineEvents
    .filter((t) => t.wedding_id === w.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((t) => ({ id: t.id, time: t.time, title: t.title }))

  const dressCodeColors = memoryDressCodeColors
    .filter((c) => c.wedding_id === w.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => c.color)

  const guestbookQuestions = memoryGuestbookQuestions
    .filter((g) => g.wedding_id === w.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((g) => ({ id: g.id, text: g.text, type: g.type }))

  return {
    ...w,
    photos,
    rsvp_questions: rsvpQuestions,
    gift_accounts: giftAccounts,
    timeline_events: timelineEvents,
    dress_code_colors: dressCodeColors,
    guestbook_questions: guestbookQuestions,
  }
}

// In-memory query resolver
function executeMockQuery(text: string, params: any[] = []): { rows: any[]; rowCount?: number } {
  const normalized = text.trim().replace(/\s+/g, ' ')

  // --- USERS QUERIES ---
  if (normalized.startsWith('SELECT id, email, name, role FROM users WHERE id = $1')) {
    const user = memoryUsers.find((u) => u.id === params[0])
    return { rows: user ? [{ id: user.id, email: user.email, name: user.name, role: user.role }] : [] }
  }

  if (normalized.startsWith('SELECT id, email, name, role, password FROM users WHERE email = $1')) {
    const user = memoryUsers.find((u) => u.email.toLowerCase() === String(params[0]).toLowerCase())
    return { rows: user ? [{ id: user.id, email: user.email, name: user.name, role: user.role, password: user.password }] : [] }
  }

  if (normalized.startsWith('SELECT id FROM users WHERE email = $1')) {
    const user = memoryUsers.find((u) => u.email.toLowerCase() === String(params[0]).toLowerCase())
    return { rows: user ? [{ id: user.id }] : [] }
  }

  if (normalized.startsWith('INSERT INTO users')) {
    const [email, password, name, role] = params
    const newUser: UserRow = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `user-${Date.now()}`,
      email,
      password,
      name: name || '',
      role: (role as any) || 'user',
      created_at: new Date(),
      updated_at: new Date(),
    }
    memoryUsers.push(newUser)
    return { rows: [{ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }] }
  }

  // --- TEMPLATES QUERIES ---
  if (normalized.startsWith('SELECT * FROM templates ORDER BY created_at ASC')) {
    return { rows: [...memoryTemplates].sort((a, b) => a.created_at.getTime() - b.created_at.getTime()) }
  }

  if (normalized.startsWith('SELECT * FROM templates WHERE id = $1')) {
    const tpl = memoryTemplates.find((t) => t.id === params[0])
    return { rows: tpl ? [tpl] : [] }
  }

  if (normalized.startsWith('INSERT INTO templates')) {
    const [name, category, description, swatches, accent, html, css, isCustom] = params
    const newTpl: TemplateRow = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `tpl-${Date.now()}`,
      name,
      category,
      description,
      swatches: typeof swatches === 'string' ? swatches : JSON.stringify(swatches),
      accent,
      html,
      css,
      is_custom: isCustom || false,
      created_at: new Date(),
      updated_at: new Date(),
    }
    memoryTemplates.push(newTpl)
    return { rows: [newTpl] }
  }

  if (normalized.startsWith('UPDATE templates SET')) {
    const [name, category, description, swatches, accent, html, css, isCustom, id] = params
    const idx = memoryTemplates.findIndex((t) => t.id === id)
    if (idx !== -1) {
      memoryTemplates[idx] = {
        ...memoryTemplates[idx],
        name,
        category,
        description,
        swatches: typeof swatches === 'string' ? swatches : JSON.stringify(swatches),
        accent,
        html,
        css,
        is_custom: isCustom,
        updated_at: new Date(),
      }
      return { rows: [memoryTemplates[idx]] }
    }
    return { rows: [] }
  }

  if (normalized.startsWith('DELETE FROM templates WHERE id = $1')) {
    const idx = memoryTemplates.findIndex((t) => t.id === params[0])
    if (idx !== -1) {
      memoryTemplates.splice(idx, 1)
      return { rows: [], rowCount: 1 }
    }
    return { rows: [], rowCount: 0 }
  }

  // --- WEDDINGS QUERIES ---
  if (normalized.includes('FROM weddings w WHERE w.id = $1')) {
    const wedding = memoryWeddings.find((w) => w.id === params[0])
    return { rows: wedding ? [buildWeddingFullRow(wedding)] : [] }
  }

  if (normalized.startsWith('SELECT w.*') && normalized.includes('FROM weddings w')) {
    let result = [...memoryWeddings]
    if (normalized.includes('w.user_id = $') && params.length >= 1) {
      result = result.filter((w) => w.user_id === params[0])
    }
    if (normalized.includes('w.status = $')) {
      const statusParam = params[params.length - 1]
      result = result.filter((w) => w.status === statusParam)
    }
    result.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())
    return { rows: result.map(buildWeddingFullRow) }
  }

  if (normalized.startsWith('INSERT INTO weddings')) {
    const [
      id, user_id, template_id, title, status,
      groom, bride, groom_parents, bride_parents, wedding_date,
      ceremony, reception, location,
      introduction, couple_story,
      avatar_url, avatar_alt, couple_photo_url, couple_photo_alt,
      rsvp_enabled, rsvp_display_mode, rsvp_max_guest_count,
      gift_enabled, gift_display_mode, gift_title,
      dress_code_enabled, dress_code_title, dress_code_subtitle,
      music_enabled, music_url, music_title,
      guestbook_enabled, envelope_greeting,
      og_style, og_custom_url,
      map_embed_url, map_address,
    ] = params

    const newWedding: WeddingRow = {
      id,
      user_id,
      template_id,
      title,
      status,
      groom,
      bride,
      groom_parents,
      bride_parents,
      wedding_date,
      ceremony,
      reception,
      location,
      introduction,
      couple_story,
      avatar_url,
      avatar_alt,
      couple_photo_url,
      couple_photo_alt,
      rsvp_enabled: !!rsvp_enabled,
      rsvp_display_mode: rsvp_display_mode || 'button',
      rsvp_max_guest_count: rsvp_max_guest_count || 5,
      gift_enabled: !!gift_enabled,
      gift_display_mode: gift_display_mode || 'button',
      gift_title: gift_title || 'Mừng cưới',
      dress_code_enabled: !!dress_code_enabled,
      dress_code_title: dress_code_title || 'Dress Code',
      dress_code_subtitle: dress_code_subtitle || '',
      music_enabled: !!music_enabled,
      music_url: music_url || '',
      music_title: music_title || '',
      guestbook_enabled: !!guestbook_enabled,
      envelope_greeting: envelope_greeting || '',
      og_style: og_style || 'envelope',
      og_custom_url: og_custom_url || '',
      map_embed_url: map_embed_url || '',
      map_address: map_address || '',
      created_at: new Date(),
      updated_at: new Date(),
    }

    const existingIdx = memoryWeddings.findIndex((w) => w.id === id)
    if (existingIdx !== -1) {
      memoryWeddings[existingIdx] = newWedding
    } else {
      memoryWeddings.push(newWedding)
    }
    return { rows: [newWedding] }
  }

  if (normalized.startsWith('UPDATE weddings SET')) {
    const [
      template_id, title, status,
      groom, bride, groom_parents, bride_parents, wedding_date,
      ceremony, reception, location,
      introduction, couple_story,
      avatar_url, avatar_alt, couple_photo_url, couple_photo_alt,
      rsvp_enabled, rsvp_display_mode, rsvp_max_guest_count,
      gift_enabled, gift_display_mode, gift_title,
      dress_code_enabled, dress_code_title, dress_code_subtitle,
      music_enabled, music_url, music_title,
      guestbook_enabled, envelope_greeting,
      og_style, og_custom_url,
      map_embed_url, map_address,
      id,
    ] = params

    const idx = memoryWeddings.findIndex((w) => w.id === id)
    if (idx !== -1) {
      memoryWeddings[idx] = {
        ...memoryWeddings[idx],
        template_id,
        title,
        status,
        groom,
        bride,
        groom_parents,
        bride_parents,
        wedding_date,
        ceremony,
        reception,
        location,
        introduction,
        couple_story,
        avatar_url,
        avatar_alt,
        couple_photo_url,
        couple_photo_alt,
        rsvp_enabled: !!rsvp_enabled,
        rsvp_display_mode: rsvp_display_mode || 'button',
        rsvp_max_guest_count: rsvp_max_guest_count || 5,
        gift_enabled: !!gift_enabled,
        gift_display_mode: gift_display_mode || 'button',
        gift_title: gift_title || 'Mừng cưới',
        dress_code_enabled: !!dress_code_enabled,
        dress_code_title: dress_code_title || 'Dress Code',
        dress_code_subtitle: dress_code_subtitle || '',
        music_enabled: !!music_enabled,
        music_url: music_url || '',
        music_title: music_title || '',
        guestbook_enabled: !!guestbook_enabled,
        envelope_greeting: envelope_greeting || '',
        og_style: og_style || 'envelope',
        og_custom_url: og_custom_url || '',
        map_embed_url: map_embed_url || '',
        map_address: map_address || '',
        updated_at: new Date(),
      }
      return { rows: [memoryWeddings[idx]] }
    }
    return { rows: [] }
  }

  if (normalized.startsWith('DELETE FROM weddings WHERE id = $1')) {
    const idx = memoryWeddings.findIndex((w) => w.id === params[0])
    if (idx !== -1) {
      memoryWeddings.splice(idx, 1)
      return { rows: [], rowCount: 1 }
    }
    return { rows: [], rowCount: 0 }
  }

  // --- SUB-TABLE INSERTS & DELETES ---
  if (normalized.startsWith('DELETE FROM wedding_photos WHERE wedding_id = $1')) {
    for (let i = memoryPhotos.length - 1; i >= 0; i--) {
      if (memoryPhotos[i].wedding_id === params[0]) memoryPhotos.splice(i, 1)
    }
    return { rows: [], rowCount: 1 }
  }
  if (normalized.startsWith('INSERT INTO wedding_photos')) {
    const [wedding_id, url, alt, sort_order] = params
    memoryPhotos.push({
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `ph-${Date.now()}`,
      wedding_id,
      url,
      alt,
      sort_order,
    })
    return { rows: [] }
  }

  if (normalized.startsWith('DELETE FROM rsvp_questions WHERE wedding_id = $1')) {
    for (let i = memoryRsvpQuestions.length - 1; i >= 0; i--) {
      if (memoryRsvpQuestions[i].wedding_id === params[0]) memoryRsvpQuestions.splice(i, 1)
    }
    return { rows: [], rowCount: 1 }
  }
  if (normalized.startsWith('INSERT INTO rsvp_questions')) {
    const [wedding_id, textVal, typeVal, sort_order] = params
    memoryRsvpQuestions.push({
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `rq-${Date.now()}`,
      wedding_id,
      text: textVal,
      type: typeVal,
      sort_order,
    })
    return { rows: [] }
  }

  if (normalized.startsWith('DELETE FROM gift_accounts WHERE wedding_id = $1')) {
    for (let i = memoryGiftAccounts.length - 1; i >= 0; i--) {
      if (memoryGiftAccounts[i].wedding_id === params[0]) memoryGiftAccounts.splice(i, 1)
    }
    return { rows: [], rowCount: 1 }
  }
  if (normalized.startsWith('INSERT INTO gift_accounts')) {
    const [wedding_id, bank_name, account_number, holder_name, qr_url, sort_order] = params
    memoryGiftAccounts.push({
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `ga-${Date.now()}`,
      wedding_id,
      bank_name,
      account_number,
      holder_name,
      qr_url,
      sort_order,
    })
    return { rows: [] }
  }

  if (normalized.startsWith('DELETE FROM timeline_events WHERE wedding_id = $1')) {
    for (let i = memoryTimelineEvents.length - 1; i >= 0; i--) {
      if (memoryTimelineEvents[i].wedding_id === params[0]) memoryTimelineEvents.splice(i, 1)
    }
    return { rows: [], rowCount: 1 }
  }
  if (normalized.startsWith('INSERT INTO timeline_events')) {
    const [wedding_id, time, title, sort_order] = params
    memoryTimelineEvents.push({
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `te-${Date.now()}`,
      wedding_id,
      time,
      title,
      sort_order,
    })
    return { rows: [] }
  }

  if (normalized.startsWith('DELETE FROM dress_code_colors WHERE wedding_id = $1')) {
    for (let i = memoryDressCodeColors.length - 1; i >= 0; i--) {
      if (memoryDressCodeColors[i].wedding_id === params[0]) memoryDressCodeColors.splice(i, 1)
    }
    return { rows: [], rowCount: 1 }
  }
  if (normalized.startsWith('INSERT INTO dress_code_colors')) {
    const [wedding_id, color, sort_order] = params
    memoryDressCodeColors.push({
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `dc-${Date.now()}`,
      wedding_id,
      color,
      sort_order,
    })
    return { rows: [] }
  }

  if (normalized.startsWith('DELETE FROM guestbook_questions WHERE wedding_id = $1')) {
    for (let i = memoryGuestbookQuestions.length - 1; i >= 0; i--) {
      if (memoryGuestbookQuestions[i].wedding_id === params[0]) memoryGuestbookQuestions.splice(i, 1)
    }
    return { rows: [], rowCount: 1 }
  }
  if (normalized.startsWith('INSERT INTO guestbook_questions')) {
    const [wedding_id, textVal, typeVal, sort_order] = params
    memoryGuestbookQuestions.push({
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `gq-${Date.now()}`,
      wedding_id,
      text: textVal,
      type: typeVal,
      sort_order,
    })
    return { rows: [] }
  }

  // Fallback
  return { rows: [] }
}

let realPool: Pool | null = null
const hasDbUrl = !!process.env.DATABASE_URL
const hasCustomHost = !!process.env.DB_HOST && process.env.DB_HOST !== 'localhost'

if (hasDbUrl || hasCustomHost) {
  try {
    realPool = new Pool(
      hasDbUrl
        ? { connectionString: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'wicpic',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            connectionTimeoutMillis: 2000,
          }
    )
    realPool.on('error', (err) => {
      console.warn('[AI Studio] PostgreSQL idle client error (falling back to memory):', err.message)
    })
  } catch (err: any) {
    console.warn('[AI Studio] Failed to initialize PostgreSQL pool, using in-memory mock:', err.message)
    realPool = null
  }
}

export const pool = {
  query: async (queryText: string, params?: any[]) => {
    if (realPool) {
      try {
        return await realPool.query(queryText, params)
      } catch (err: any) {
        console.warn(`[AI Studio] DB query error (${err.message}). Falling back to in-memory store.`)
      }
    }
    return executeMockQuery(queryText, params)
  },
  connect: async () => {
    if (realPool) {
      try {
        return await realPool.connect()
      } catch {
        // Return dummy connection
      }
    }
    return {
      query: async (text: string, params?: any[]) => executeMockQuery(text, params),
      release: () => {},
    }
  },
}

export default pool

