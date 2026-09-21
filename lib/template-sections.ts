export type TemplateSectionType = 'static' | 'widget'

export type TemplateSectionDef = {
  key: string
  label: string
  type: TemplateSectionType
  description: string
}

export type TemplateSection = {
  key: string
  html: string
  css?: string
}

/**
 * Registry section chuẩn — nguồn chân lý cho cả editor lẫn template engine.
 * Engine nhận diện section bằng `key`; admin truyền HTML vào đúng từng phần.
 * Widget (type: 'widget') được engine tự render khối tương tác chuẩn khi gặp
 * placeholder `{{#widget key}}`.
 */
export const TEMPLATE_SECTION_DEFS: TemplateSectionDef[] = [
  { key: 'hero', label: 'Ảnh bìa', type: 'static', description: 'Ảnh nền toàn màn hình, tên đôi, ngày cưới' },
  { key: 'family', label: 'Kính mời song thân', type: 'static', description: 'Bố mẹ hai bên, dòng "con trai / con gái"' },
  { key: 'intro', label: 'Lời mời', type: 'static', description: 'Lời giới thiệu / lời mời chung' },
  { key: 'couple', label: 'Cặp đôi & câu chuyện', type: 'static', description: 'Ảnh đôi + chuyện tình' },
  { key: 'details', label: 'Save the date', type: 'static', description: 'Lễ, tiệc, địa điểm' },
  { key: 'countdown', label: 'Đếm ngược', type: 'widget', description: 'Ngày / Giờ / Phút / Giây tới ngày cưới' },
  { key: 'timeline', label: 'Lịch trình buổi tiệc', type: 'widget', description: 'Timeline từ wedding.timeline' },
  { key: 'gallery', label: 'Bộ sưu tập ảnh', type: 'static', description: 'Album ảnh kỷ niệm' },
  { key: 'dressCode', label: 'Dress code', type: 'widget', description: 'Tiêu đề + vòng tròn màu gợi ý' },
  { key: 'gift', label: 'Mừng cưới', type: 'widget', description: 'Thẻ tài khoản ngân hàng + QR' },
  { key: 'map', label: 'Bản đồ chỉ đường', type: 'widget', description: 'Khung Google Maps' },
  { key: 'music', label: 'Nhạc nền', type: 'widget', description: 'Nút nhạc nổi — MP3 / YouTube' },
  { key: 'guestbook', label: 'Sổ lưu bút', type: 'widget', description: 'Ô nhập + gửi lời chúc' },
  { key: 'rsvp', label: 'RSVP', type: 'widget', description: 'Xác nhận tham dự' },
  { key: 'envelope', label: 'Lời chào phong bì', type: 'widget', description: 'Trích envelope.greeting' },
  { key: 'closing', label: 'Lời cảm ơn', type: 'static', description: 'Kết trang + tên đôi' },
]

export const TEMPLATE_SECTION_KEYS: string[] = TEMPLATE_SECTION_DEFS.map((d) => d.key)

const WIDGET_KEYS = new Set(
  TEMPLATE_SECTION_DEFS.filter((d) => d.type === 'widget').map((d) => d.key),
)

export function isWidgetSection(key: string): boolean {
  return WIDGET_KEYS.has(key)
}

export function getSectionDef(key: string): TemplateSectionDef | undefined {
  return TEMPLATE_SECTION_DEFS.find((d) => d.key === key)
}

/** HTML mặc định khi admin thêm một section mới. */
export function defaultSectionHtml(key: string): string {
  const def = getSectionDef(key)
  const label = def?.label ?? key
  if (def && def.type === 'widget') {
    return `<section class="wt-${key}">
  <p class="wt-eyebrow">${label}</p>
  <h2 class="wt-${key}__title"></h2>
  {{#widget ${key}}}
</section>`
  }
  return `<section class="wt-${key}">
  <!-- Thêm nội dung cho "${label}" tại đây -->
</section>`
}

/**
 * Danh sách section mặc định cho mẫu mới (full) — bản tham chiếu đúng contract.
 * Thứ tự trong mảng chính là thứ tự hiển thị trên thiệp.
 */
export function defaultTemplateSections(): TemplateSection[] {
  return [
    {
      key: 'hero',
      html: `<section class="wt-hero">
  {{#if avatar}}<img src="{{avatar.url}}" alt="{{avatar.alt}}" class="wt-hero__img" />{{/if}}
  <div class="wt-hero__overlay"></div>
  <div class="wt-hero__content">
    <p class="wt-hero__label">Wedding Invitation</p>
    <h1 class="wt-hero__names">{{groom}} &amp; {{bride}}</h1>
    <div class="wt-hero__divider"></div>
    <p class="wt-hero__date">{{weddingDate}}</p>
  </div>
</section>`,
    },
    {
      key: 'family',
      html: `<section class="wt-family">
  <p class="wt-eyebrow">Kính mời gia đình thân hữu</p>
  <p class="wt-family__lead">Chúng tôi trân trọng kính mời quý vị đến dự buổi lễ thành hôn của:</p>
  <div class="wt-family__list">
    {{#if groomParents}}
    <p class="wt-family__item">Chú rể <strong>{{groom}}</strong><span class="wt-family__rel">con trai {{groomParents}}</span></p>
    {{/if}}
    {{#if brideParents}}
    <p class="wt-family__item">Cô dâu <strong>{{bride}}</strong><span class="wt-family__rel">con gái {{brideParents}}</span></p>
    {{/if}}
  </div>
</section>`,
    },
    {
      key: 'intro',
      html: `<section class="wt-intro">
  <div class="wt-intro__inner">
    <p class="wt-eyebrow">We are getting married</p>
    <h2 class="wt-intro__title">Hai người, một câu chuyện.</h2>
    <p class="wt-intro__text">{{introduction}}</p>
  </div>
</section>`,
    },
    {
      key: 'couple',
      html: `<section class="wt-couple">
  <div class="wt-couple__grid">
    {{#if couplePhoto}}
    <figure class="wt-couple__photo">
      <img src="{{couplePhoto.url}}" alt="{{couplePhoto.alt}}" />
    </figure>
    {{/if}}
    <div class="wt-couple__text">
      <p class="wt-eyebrow">The Couple</p>
      <h2 class="wt-couple__names">{{groom}} &amp; {{bride}}</h2>
      <p class="wt-couple__story">{{coupleStory}}</p>
    </div>
  </div>
</section>`,
    },
    {
      key: 'details',
      html: `<section class="wt-details">
  <p class="wt-eyebrow">Save the date</p>
  <h2 class="wt-details__date">{{weddingDate}}</h2>
  <div class="wt-details__cards">
    <div class="wt-details__card">
      <p class="wt-details__label">Ceremony</p>
      <p class="wt-details__time">{{ceremony.time}}</p>
      <p class="wt-details__desc">{{ceremony.date}}</p>
    </div>
    <div class="wt-details__card">
      <p class="wt-details__label">Reception</p>
      <p class="wt-details__time">{{reception.time}}</p>
      <p class="wt-details__desc">{{reception.description}}</p>
    </div>
    <div class="wt-details__card">
      <p class="wt-details__label">Location</p>
      <p class="wt-details__time">{{location.city}}</p>
      <p class="wt-details__desc">{{location.province}}</p>
    </div>
  </div>
  {{#if location.venueName}}<p class="wt-details__venue">{{location.venueName}}</p>{{/if}}
</section>`,
    },
    {
      key: 'countdown',
      html: `<section class="wt-widget">
  <p class="wt-eyebrow">Đếm ngược</p>
  <h2 class="wt-widget__title">Ngày vui đang đến gần</h2>
  {{#widget countdown}}
</section>`,
    },
    {
      key: 'timeline',
      html: `<section class="wt-widget">
  <p class="wt-eyebrow">Timeline</p>
  <h2 class="wt-widget__title">Lịch trình buổi tiệc</h2>
  {{#widget timeline}}
</section>`,
    },
    {
      key: 'gallery',
      html: `{{#if photos.length}}
<section class="wt-gallery">
  <p class="wt-eyebrow">Our memories</p>
  <h2 class="wt-gallery__title">Những khoảnh khắc</h2>
  <div class="wt-gallery__grid">
    {{#each photos}}
    <img src="{{this.url}}" alt="{{this.alt}}" class="wt-gallery__img" />
    {{/each}}
  </div>
</section>
{{/if}}`,
    },
    {
      key: 'dressCode',
      html: `<section class="wt-widget">
  <p class="wt-eyebrow">Dress Code</p>
  <h2 class="wt-widget__title">Tông màu hoà cùng ngày vui</h2>
  {{#widget dressCode}}
</section>`,
    },
    {
      key: 'gift',
      html: `<section class="wt-gift">
  <p class="wt-eyebrow">Mừng cưới</p>
  <h2 class="wt-gift__title">Chung vui cùng cặp đôi</h2>
  <p class="wt-gift__note">Nếu bạn muốn gửi lời chúc mừng, chúng mình rất trân trọng.</p>
  {{#widget gift}}
</section>`,
    },
    {
      key: 'map',
      html: `<section class="wt-widget">
  <p class="wt-eyebrow">Chỉ đường</p>
  <h2 class="wt-widget__title">Bản đồ</h2>
  {{#widget map}}
</section>`,
    },
    {
      key: 'music',
      html: `{{#widget music}}`,
    },
    {
      key: 'guestbook',
      html: `<section class="wt-widget">
  <p class="wt-eyebrow">Lời chúc</p>
  <h2 class="wt-widget__title">Gửi lời chúc đến cặp đôi</h2>
  {{#widget guestbook}}
</section>`,
    },
    {
      key: 'rsvp',
      html: `<section class="wt-rsvp">
  <p class="wt-eyebrow">RSVP</p>
  <h2 class="wt-rsvp__title">Xác nhận tham dự</h2>
  <p class="wt-rsvp__note">Hãy cho chúng mình biết bạn có thể đến và tham gia ngày vui.</p>
  {{#widget rsvp}}
</section>`,
    },
    {
      key: 'envelope',
      html: `<section class="wt-widget">
  <p class="wt-eyebrow">Lời ngỏ</p>
  <h2 class="wt-widget__title">Một lời nhắn nhủ</h2>
  {{#widget envelope}}
</section>`,
    },
    {
      key: 'closing',
      html: `<section class="wt-closing">
  <p class="wt-closing__label">With love</p>
  <h2 class="wt-closing__names">{{groom}} &amp; {{bride}}</h2>
  <p class="wt-closing__text">Cảm ơn bạn đã đến và chia sẻ niềm vui cùng chúng mình.</p>
</section>`,
    },
  ]
}