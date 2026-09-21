'use client'

import type { TemplateSection } from '@/lib/template-sections'
import { defaultTemplateSections } from '@/lib/template-sections'

const API = '/api/templates'

export type AdminTemplate = {
  id: string
  name: string
  category: string
  description: string
  swatches: [string, string]
  accent: string
  html: string
  css: string
  sections: TemplateSection[]
  isCustom: boolean
  createdAt: number
  updatedAt: number
}

const DEFAULT_HTML = `<section class="inv-hero">
  <div class="inv-hero__bg">
    {{#if avatar}}<img src="{{avatar.url}}" alt="{{avatar.alt}}" class="inv-hero__img" />{{/if}}
  </div>
  <div class="inv-hero__overlay"></div>
  <div class="inv-hero__content">
    <p class="inv-hero__label">Wedding Invitation</p>
    <h1 class="inv-hero__names">{{groom}} &amp; {{bride}}</h1>
    <div class="inv-hero__divider"></div>
    <p class="inv-hero__date">{{weddingDate}}</p>
  </div>
</section>

<section class="inv-intro">
  <div class="inv-intro__inner">
    <p class="inv-label">We are getting married</p>
    <h2 class="inv-heading">Hai người, một câu chuyện.</h2>
    <p class="inv-text">{{introduction}}</p>
    {{#if groomParents}}
    <p class="inv-parents">{{groomParents}} · con trai — {{brideParents}} · con gái</p>
    {{/if}}
  </div>
</section>

<section class="inv-couple">
  <div class="inv-couple__grid">
    {{#if couplePhoto}}
    <div class="inv-couple__photo">
      <img src="{{couplePhoto.url}}" alt="{{couplePhoto.alt}}" />
    </div>
    {{/if}}
    <div class="inv-couple__text">
      <p class="inv-label">The Couple</p>
      <h2 class="inv-heading">{{groom}} &amp; {{bride}}</h2>
      <p class="inv-text">{{coupleStory}}</p>
    </div>
  </div>
</section>

<section class="inv-info">
  <div class="inv-info__inner">
    <p class="inv-label">Save the date</p>
    <h2 class="inv-heading">{{weddingDate}}</h2>
    <div class="inv-info__cards">
      <div class="inv-info__card">
        <p class="inv-info__card-label">Ceremony</p>
        <p class="inv-info__card-time">{{ceremony.time}}</p>
        <p class="inv-info__card-desc">{{ceremony.date}}</p>
      </div>
      <div class="inv-info__card">
        <p class="inv-info__card-label">Reception</p>
        <p class="inv-info__card-time">{{reception.time}}</p>
        <p class="inv-info__card-desc">{{reception.description}}</p>
      </div>
      <div class="inv-info__card">
        <p class="inv-info__card-label">Location</p>
        <p class="inv-info__card-time">{{location.city}}</p>
        <p class="inv-info__card-desc">{{location.province}}</p>
      </div>
    </div>
    {{#if location.venueName}}<p class="inv-info__venue">{{location.venueName}}</p>{{/if}}
  </div>
</section>

{{#if photos.length}}
<section class="inv-gallery">
  <div class="inv-gallery__inner">
    <p class="inv-label">Our memories</p>
    <h2 class="inv-heading">Những khoảnh khắc</h2>
    <div class="inv-gallery__grid">
      {{#each photos}}
      <img src="{{this.url}}" alt="{{this.alt}}" class="inv-gallery__img" />
      {{/each}}
    </div>
  </div>
</section>
{{/if}}

<section class="inv-closing">
  <p class="inv-closing__label">With love</p>
  <h2 class="inv-closing__names">{{groom}} &amp; {{bride}}</h2>
  <p class="inv-closing__text">Cảm ơn bạn đã đến và chia sẻ niềm vui cùng chúng mình.</p>
</section>`

const DEFAULT_CSS = `/* ===== WISPIC Custom Template ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }

.inv-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
}
.inv-hero__bg {
  position: absolute;
  inset: 0;
}
.inv-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.inv-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
}
.inv-hero__content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 1.5rem;
}
.inv-hero__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5em;
  margin-bottom: 1.5rem;
}
.inv-hero__names {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3.5rem;
  font-style: italic;
  line-height: 1.1;
}
.inv-hero__divider {
  width: 5rem;
  height: 1px;
  background: rgba(255,255,255,0.7);
  margin: 2rem auto;
}
.inv-hero__date {
  font-size: 0.85rem;
  letter-spacing: 0.3em;
}

.inv-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: #9b8878;
}
.inv-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-style: italic;
  margin-top: 1rem;
}
.inv-text {
  font-size: 0.9rem;
  line-height: 2;
  color: #706861;
  margin-top: 1.5rem;
}
.inv-parents {
  font-size: 0.75rem;
  line-height: 1.8;
  color: #9b8878;
  margin-top: 1rem;
  letter-spacing: 0.05em;
}

.inv-intro {
  padding: 7rem 1.5rem;
}
.inv-intro__inner {
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
}

.inv-couple {
  background: #fff;
  padding: 6rem 1.5rem;
}
.inv-couple__grid {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}
@media (min-width: 768px) {
  .inv-couple__grid { grid-template-columns: 1fr 1fr; }
}
.inv-couple__photo img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  border-radius: 2rem;
}
.inv-couple__text {
  padding: 1rem 0;
}

.inv-info {
  padding: 7rem 1.5rem;
}
.inv-info__inner {
  max-width: 56rem;
  margin: 0 auto;
  text-align: center;
}
.inv-info__cards {
  display: grid;
  gap: 1.25rem;
  margin-top: 3.5rem;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .inv-info__cards { grid-template-columns: repeat(3, 1fr); }
}
.inv-info__card {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
}
.inv-info__card-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #9b8878;
}
.inv-info__card-time {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  margin-top: 1rem;
}
.inv-info__card-desc {
  font-size: 0.85rem;
  color: #706861;
  margin-top: 0.5rem;
}
.inv-info__venue {
  font-size: 0.85rem;
  font-style: italic;
  color: #706861;
  margin-top: 1.5rem;
}

.inv-gallery {
  background: #fff;
  padding: 6rem 1.5rem;
}
.inv-gallery__inner {
  max-width: 80rem;
  margin: 0 auto;
  text-align: center;
}
.inv-gallery__grid {
  display: grid;
  gap: 1rem;
  margin-top: 3rem;
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 768px) {
  .inv-gallery__grid { grid-template-columns: repeat(3, 1fr); }
}
.inv-gallery__img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 1rem;
}

.inv-closing {
  background: #302b27;
  padding: 8rem 1.5rem;
  text-align: center;
  color: #fff;
}
.inv-closing__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  color: rgba(255,255,255,0.5);
}
.inv-closing__names {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem;
  font-style: italic;
  margin-top: 1.5rem;
}
.inv-closing__text {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  margin-top: 2rem;
}`

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<T>
}

export async function readAdminTemplates(): Promise<AdminTemplate[]> {
  try {
    const res = await fetch(API, { cache: 'no-store' })
    return await handleResponse<AdminTemplate[]>(res)
  } catch {
    return []
  }
}

export async function readAdminTemplate(id: string): Promise<AdminTemplate | null> {
  try {
    const res = await fetch(`${API}/${id}`, { cache: 'no-store' })
    if (res.status === 404) return null
    return await handleResponse<AdminTemplate>(res)
  } catch {
    return null
  }
}

export async function saveAdminTemplate(template: AdminTemplate) {
  const method = template.id.includes('-') ? 'PUT' : 'POST'
  const url = template.id.includes('-') ? `${API}/${template.id}` : API
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template),
  })
}

export async function deleteAdminTemplate(id: string) {
  await fetch(`${API}/${id}`, { method: 'DELETE' })
}

export function createAdminTemplate(
  overrides?: Partial<Pick<AdminTemplate, 'name' | 'category' | 'description'>>,
): AdminTemplate {
  return {
    id: createId(),
    name: overrides?.name ?? 'Mẫu tùy chỉnh',
    category: overrides?.category ?? 'Tùy chỉnh',
    description: overrides?.description ?? 'Mẫu thiệp do admin tạo.',
    swatches: ['#f7f3ee', '#302b27'],
    accent: '#9b8878',
    html: DEFAULT_HTML,
    css: DEFAULT_CSS,
    sections: defaultTemplateSections(),
    isCustom: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}