import type { WeddingData } from '@/lib/wedding-data'
import type { TemplateSection } from '@/lib/template-sections'

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

function buildVars(wedding: WeddingData): TemplateVars {
  return {
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
}

export function renderCustomTemplate(
  html: string,
  css: string,
  wedding: WeddingData,
): string {
  const vars = buildVars(wedding)

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

/* ============================================================
   TEMPLATE SECTIONS — render mẫu theo từng section (admin-created)
   ============================================================ */

function parseWeddingDate(dateStr: string): Date | null {
  const parts = dateStr.match(/\d{1,2}/g)
  if (!parts || parts.length < 3) return null
  const [d, m, y] = parts.map((p) => parseInt(p, 10))
  const target = new Date(y, m - 1, d, 0, 0, 0)
  return Number.isNaN(target.getTime()) ? null : target
}

function isAudioUrl(url?: string): boolean {
  if (!url) return false
  const lower = url.toLowerCase()
  return (
    lower.endsWith('.mp3') ||
    lower.endsWith('.wav') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.m4a') ||
    lower.endsWith('.aac') ||
    lower.endsWith('.flac')
  )
}

function extractYoutubeId(url?: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /^([\w-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function attrEsc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

/* ---------------- Widget markup (chạy trong iframe) ---------------- */

function renderCountdownWidget(wedding: WeddingData): string {
  const target = parseWeddingDate(wedding.weddingDate)
  if (!target) return ''
  return `<div class="wt-countdown" data-wispic-countdown="${target.getTime()}">
  <div class="wt-countdown__cell"><span class="wt-countdown__val" data-wt-cd="d">--</span><span class="wt-countdown__label">Ngày</span></div>
  <div class="wt-countdown__cell"><span class="wt-countdown__val" data-wt-cd="h">--</span><span class="wt-countdown__label">Giờ</span></div>
  <div class="wt-countdown__cell"><span class="wt-countdown__val" data-wt-cd="m">--</span><span class="wt-countdown__label">Phút</span></div>
  <div class="wt-countdown__cell"><span class="wt-countdown__val" data-wt-cd="s">--</span><span class="wt-countdown__label">Giây</span></div>
</div>`
}

function renderTimelineWidget(wedding: WeddingData): string {
  const items = wedding.timeline ?? []
  if (items.length === 0) return ''
  const rows = items
    .map(
      (ev) => `<div class="wt-timeline__item">
  <span class="wt-timeline__dot"></span>
  <div class="wt-timeline__body">
    ${ev.time ? `<p class="wt-timeline__time">${escapeHtml(ev.time)}</p>` : ''}
    ${ev.title ? `<p class="wt-timeline__title">${escapeHtml(ev.title)}</p>` : ''}
  </div>
</div>`,
    )
    .join('')
  return `<div class="wt-timeline">${rows}</div>`
}

function renderDressCodeWidget(wedding: WeddingData): string {
  const dc = wedding.dressCode
  if (!dc?.enabled || !dc.title) return ''
  const colors = (dc.colors ?? []).filter(Boolean)
  const swatches = colors
    .map(
      (c) => `<span class="wt-dresscode__swatch">
  <span class="wt-dresscode__dot" style="background:${attrEsc(c)}"></span>
  <span class="wt-dresscode__hex">${escapeHtml(c)}</span>
</span>`,
    )
    .join('')
  return `<div class="wt-dresscode">
  ${dc.subtitle ? `<p class="wt-dresscode__subtitle">${escapeHtml(dc.subtitle)}</p>` : ''}
  ${colors.length > 0 ? `<div class="wt-dresscode__colors">${swatches}</div>` : ''}
</div>`
}

function renderGiftWidget(wedding: WeddingData): string {
  const gift = wedding.gift
  if (!gift?.enabled) return ''
  const accounts = (gift.accounts ?? []).filter(
    (a) => a.bankName || a.accountNumber || a.holderName || a.qrUrl,
  )
  if (accounts.length === 0) return ''
  const cards = accounts
    .map(
      (a) => `<div class="wt-gift__card">
  ${a.qrUrl ? `<img class="wt-gift__qr" src="${attrEsc(a.qrUrl)}" alt="QR mừng cưới" />` : ''}
  ${a.bankName ? `<p class="wt-gift__bank">${escapeHtml(a.bankName)}</p>` : ''}
  ${a.accountNumber ? `<p class="wt-gift__num">${escapeHtml(a.accountNumber)}</p>` : ''}
  ${a.holderName ? `<p class="wt-gift__holder">${escapeHtml(a.holderName)}</p>` : ''}
</div>`,
    )
    .join('')
  return `<div class="wt-gift__accounts">${cards}</div>`
}

function renderMapWidget(wedding: WeddingData): string {
  const map = wedding.map
  if (!map?.embedUrl) return ''
  return `<div class="wt-map">
  <iframe class="wt-map__frame" src="${attrEsc(map.embedUrl)}" title="Bản đồ" loading="lazy" allowfullscreen></iframe>
</div>`
}

function renderGuestbookWidget(wedding: WeddingData): string {
  if (!wedding.guestbook?.enabled) return ''
  return `<div class="wt-guestbook">
  <div class="wt-guestbook__row">
    <input class="wt-guestbook__input" type="text" placeholder="Viết lời chúc của bạn..." maxlength="500" />
    <button class="wt-guestbook__btn" type="button" data-wt-guestbook>Gửi</button>
  </div>
  <p class="wt-guestbook__ok" hidden>Cảm ơn lời chúc của bạn!</p>
</div>`
}

function renderRsvpWidget(wedding: WeddingData): string {
  if (!wedding.rsvp?.enabled) return ''
  const hasQuestions = (wedding.rsvp.questions ?? []).length > 0
  return `<div class="wt-rsvp">
  <div class="wt-rsvp__actions">
    <button class="wt-rsvp__btn wt-rsvp__btn--yes" type="button" data-wt-rsvp="yes">Tôi sẽ đến</button>
    <button class="wt-rsvp__btn" type="button" data-wt-rsvp="no">Không đến được</button>
  </div>
  <p class="wt-rsvp__result" hidden></p>
  ${hasQuestions ? '<p class="wt-rsvp__hint">Chi tiết câu hỏi sẽ được gửi qua liên hệ riêng.</p>' : ''}
</div>`
}

function renderEnvelopeWidget(wedding: WeddingData): string {
  const greeting = wedding.envelope?.greeting
  if (!greeting) return ''
  return `<p class="wt-envelope">${escapeHtml(greeting)}</p>`
}

function renderMusicWidget(wedding: WeddingData): string {
  const music = wedding.music
  const src = music?.url?.trim() ?? ''
  if (!src) return ''
  const youtubeId = extractYoutubeId(src)
  const title = music?.title ? attrEsc(music.title) : ''
  if (youtubeId) {
    return `<button class="wt-music__btn" type="button" data-wt-music data-wt-music-kind="yt" data-wt-music-src="${youtubeId}"${title ? ` data-wt-music-title="${title}"` : ''} aria-label="Nhạc nền">♪</button>
<div class="wt-music__pop" hidden>
  <div class="wt-music__frame-wrap"><iframe class="wt-music__frame" src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&amp;rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Nhạc nền"></iframe></div>
  ${title ? `<p class="wt-music__title">${title}</p>` : ''}
</div>`
  }
  if (isAudioUrl(src)) {
    return `<button class="wt-music__btn" type="button" data-wt-music data-wt-music-kind="audio" data-wt-music-src="${attrEsc(src)}"${title ? ` data-wt-music-title="${title}"` : ''} aria-label="Nhạc nền">♪</button>`
  }
  return ''
}

function renderWidgetSlot(key: string, wedding: WeddingData): string {
  switch (key) {
    case 'countdown':
      return renderCountdownWidget(wedding)
    case 'timeline':
      return renderTimelineWidget(wedding)
    case 'dressCode':
      return renderDressCodeWidget(wedding)
    case 'gift':
      return renderGiftWidget(wedding)
    case 'map':
      return renderMapWidget(wedding)
    case 'guestbook':
      return renderGuestbookWidget(wedding)
    case 'rsvp':
      return renderRsvpWidget(wedding)
    case 'envelope':
      return renderEnvelopeWidget(wedding)
    case 'music':
      return renderMusicWidget(wedding)
    default:
      return ''
  }
}

function injectWidgetSlots(html: string, wedding: WeddingData): string {
  return html.replace(/\{\{#widget\s+(\w+)\}\}/g, (_m, key: string) =>
    renderWidgetSlot(key, wedding),
  )
}

/* ---------------- Widget base CSS + client script ---------------- */

const WIDGET_CSS = `
.wt-countdown { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 2rem; }
.wt-countdown__cell { background: var(--wt-card, #ffffff); border-radius: 1rem; min-width: 72px; padding: 1rem 0.75rem; box-shadow: 0 1px 0 rgba(0,0,0,0.04); }
.wt-countdown__val { display: block; font-family: 'Cormorant Garamond', serif; font-size: 2rem; line-height: 1; }
.wt-countdown__label { display: block; margin-top: 0.5rem; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--wt-muted, #9b8878); }
.wt-timeline { max-width: 32rem; margin: 2.5rem auto 0; text-align: left; }
.wt-timeline__item { position: relative; display: flex; gap: 1.25rem; padding: 0.75rem 0; }
.wt-timeline__dot { position: relative; top: 0.5rem; width: 11px; height: 11px; border-radius: 50%; background: var(--wt-accent, #9b8878); flex-shrink: 0; }
.wt-timeline__time { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; line-height: 1.2; }
.wt-timeline__title { margin-top: 0.25rem; font-size: 0.85rem; color: var(--wt-muted, #706861); }
.wt-dresscode { margin-top: 1.5rem; }
.wt-dresscode__subtitle { font-size: 0.85rem; color: var(--wt-muted, #706861); }
.wt-dresscode__colors { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; margin-top: 1.5rem; }
.wt-dresscode__swatch { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.wt-dresscode__dot { width: 3.5rem; height: 3.5rem; border-radius: 50%; border: 1px solid rgba(0,0,0,0.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.4); }
.wt-dresscode__hex { font-size: 0.7rem; color: var(--wt-muted, #706861); }
.wt-gift__accounts { display: grid; gap: 1.25rem; margin-top: 2.5rem; }
@media (min-width: 640px) { .wt-gift__accounts { grid-template-columns: repeat(2, 1fr); } }
.wt-gift__card { background: var(--wt-card, #ffffff); border-radius: 1rem; padding: 1.5rem; text-align: left; }
.wt-gift__qr { width: 7rem; height: 7rem; object-fit: contain; margin: 0 auto 0.75rem; }
.wt-gift__bank { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--wt-accent, #9b8878); }
.wt-gift__num { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-top: 0.4rem; }
.wt-gift__holder { font-size: 0.8rem; color: var(--wt-muted, #706861); margin-top: 0.25rem; }
.wt-map { margin-top: 2.5rem; overflow: hidden; border-radius: 1rem; }
.wt-map__frame { width: 100%; height: 20rem; border: 0; }
.wt-envelope { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.5rem; line-height: 1.6; }
.wt-guestbook { margin-top: 2.5rem; }
.wt-guestbook__row { display: flex; gap: 0.5rem; max-width: 28rem; margin: 0 auto; }
.wt-guestbook__input { flex: 1; border-radius: 999px; border: 1px solid var(--wt-border, #e6ddd1); background: var(--wt-card, #ffffff); padding: 0.75rem 1.25rem; font-size: 0.85rem; }
.wt-guestbook__btn { border: 0; border-radius: 999px; padding: 0 1.5rem; background: var(--wt-accent, #9b8878); color: #fff; font-size: 0.85rem; cursor: pointer; }
.wt-guestbook__ok { margin-top: 0.75rem; color: var(--wt-accent, #9b8878); }
.wt-rsvp { margin-top: 2.5rem; }
.wt-rsvp__actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.75rem; }
.wt-rsvp__btn { border: 1px solid var(--wt-text, #302b27); background: transparent; border-radius: 999px; padding: 0.75rem 1.75rem; font-size: 0.85rem; cursor: pointer; }
.wt-rsvp__btn--yes { border-color: var(--wt-accent, #9b8878); background: var(--wt-accent, #9b8878); color: #fff; }
.wt-rsvp__result { margin-top: 1rem; font-weight: 500; }
.wt-rsvp__hint { margin-top: 1rem; font-size: 0.8rem; color: var(--wt-muted, #706861); }
.wt-music__btn { position: fixed; right: 1.5rem; bottom: 1.5rem; z-index: 50; width: 3rem; height: 3rem; border-radius: 50%; border: 0; background: var(--wt-accent, #9b8878); color: #fff; font-size: 1.25rem; line-height: 1; cursor: pointer; box-shadow: 0 12px 24px rgba(0,0,0,0.25); }
.wt-music__pop { position: fixed; right: 1.5rem; bottom: 5rem; z-index: 50; width: min(90vw, 340px); background: rgba(0,0,0,0.85); color: #fff; border-radius: 1rem; padding: 0.75rem; }
.wt-music__frame { width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 0.5rem; }
.wt-music__title { margin-top: 0.5rem; font-size: 0.75rem; text-align: center; }
`

const WIDGET_SCRIPT = `
(function () {
  'use strict';
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  var slice = function (list) { return Array.prototype.slice.call(list); };

  /* Countdown */
  slice(document.querySelectorAll('[data-wispic-countdown]')).forEach(function (box) {
    var target = parseInt(box.getAttribute('data-wispic-countdown'), 10) || 0;
    var cells = {};
    slice(box.querySelectorAll('[data-wt-cd]')).forEach(function (c) {
      cells[c.getAttribute('data-wt-cd')] = c;
    });
    if (!target) return;
    var upd = function () {
      var diff = Math.max(0, target - Date.now());
      var v = {
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff % 86400000 / 3600000),
        m: Math.floor(diff % 3600000 / 60000),
        s: Math.floor(diff % 60000 / 1000)
      };
      Object.keys(cells).forEach(function (k) { cells[k].textContent = pad(v[k]); });
    };
    upd();
    setInterval(upd, 1000);
  });

  /* Guestbook */
  var showOk = function (box) {
    var ok = box.querySelector('.wt-guestbook__ok');
    if (ok) {
      ok.hidden = false;
      setTimeout(function () { ok.hidden = true; }, 3000);
    }
  };
  slice(document.querySelectorAll('[data-wt-guestbook]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.wt-guestbook');
      var input = box ? box.querySelector('.wt-guestbook__input') : null;
      if (input && input.value.trim()) showOk(box);
    });
  });

  /* RSVP */
  slice(document.querySelectorAll('[data-wt-rsvp]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.wt-rsvp');
      var res = box ? box.querySelector('.wt-rsvp__result') : null;
      if (res) {
        res.hidden = false;
        res.textContent = btn.getAttribute('data-wt-rsvp') === 'yes'
          ? 'Tuyệt vời! Hẹn gặp bạn.'
          : 'Cảm ơn bạn đã phản hồi. Hẹn gặp lại bạn lần khác.';
      }
    });
  });

  /* Music */
  slice(document.querySelectorAll('[data-wt-music]')).forEach(function (btn) {
    var kind = btn.getAttribute('data-wt-music-kind');
    var src = btn.getAttribute('data-wt-music-src') || '';
    if (kind === 'yt') {
      btn.addEventListener('click', function () {
        var pop = btn.nextElementSibling;
        if (pop) pop.hidden = !pop.hidden;
      });
    } else if (kind === 'audio' && src) {
      var audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0.5;
      btn._audio = audio;
      btn.addEventListener('click', function () {
        if (btn._playing) {
          audio.pause();
          btn._playing = false;
        } else {
          var p = audio.play();
          if (p && p.catch) p.catch(function () {});
          btn._playing = true;
        }
      });
    }
  });
})();
`

/**
 * Render mẫu dạng section (admin-created). Thứ tự mảng `sections` quyết định
 * thứ tự hiển thị. Widget ({{#widget key}}) được engine chèn khối chuẩn.
 */
export function renderTemplateSections(
  sections: TemplateSection[],
  css: string,
  wedding: WeddingData,
): string {
  const vars = buildVars(wedding)
  const sectionCss = sections
    .map((s) => (s.css ?? '').trim())
    .filter(Boolean)
    .join('\n')
  const body = sections
    .map((s) => injectWidgetSlots(processTemplate(s.html, vars), wedding))
    .join('\n')

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
    ${WIDGET_CSS}
    ${css}
    ${sectionCss}
  </style>
</head>
<body>
  ${body}
  <script>
  ${WIDGET_SCRIPT}
  </script>
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
