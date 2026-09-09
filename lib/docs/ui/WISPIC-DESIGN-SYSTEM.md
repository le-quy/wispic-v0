# WISPIC Design System

> **Ghi dấu cảm xúc.**
> Design system dùng chung cho toàn project WISPIC-WEDDING — mọi template, page, UI mới đều phải bám theo tài liệu này.

---

## 1. Brand Identity

| | |
|---|---|
| **Brand** | WISPIC — thương hiệu cá nhân của photographer |
| **Core business** | Photography |
| **Sản phẩm phụ** | Wedding Invitation online |
| **Feeling** | Warm · Editorial · Emotional · Vietnamese · Premium |
| **Tagline** | WISPIC — Ghi dấu cảm xúc. |
| **Direction** | Vietnamese Contemporary Luxury |

> ⚠️ WISPIC **KHÔNG** là SaaS wedding platform. Homepage/template phải có cảm giác portfolio của photographer.

---

## 2. Color System

### Palette

| Token | Hex | Vai trò |
|---|---|---|
| `--tangerine` | `#D97832` | **Brand accent** — dùng tối thiểu |
| `--terracotta` | `#A9573F` | Accent phụ |
| `--earth` | `#594238` | Text phụ, muted |
| `--charcoal` | `#292522` | Text chính (*foreground*) |
| `--ivory` | `#F7F2E9` | Nền chủ đạo (*background*) |
| `--sand` | `#DED0BD` | Nền section phụ, border |
| `--olive` | `#6F7558` | Accent thiên nhiên (hiếm dùng) |

### Tỷ lệ sử dụng

```
70% Warm Ivory / neutral
15% Sand / beige
10% Dark Brown / charcoal
 5% Tangerine / Terracotta
```

### Quy tắc

- ✅ Tangerine = **brand accent**: buttons, dot, icon, star, điểm nhấn chữ
- ❌ KHÔNG dùng Tangerine làm nền chủ đạo toàn page
- ✅ Nền page = `bg-background` (ivory), section đổi nhịp = `bg-secondary/40`
- ✅ Text chính = charcoal, text phụ = `text-muted-foreground` (earth)
- ✅ Label/section caption = `text-terracotta`

### Token mapping (shadcn)

```css
--background:      #f7f2e9  (ivory)
--foreground:      #292522  (charcoal)
--card:            #fbf7ef
--primary:         #d97832  (tangerine)
--primary-foreground: #f7f2e9
--secondary:       #eee5d4  (sand nhạt)
--secondary-foreground: #594238 (earth)
--muted:           #f0e9db
--muted-foreground: #594238 (earth)
--accent:          #a9573f  (terracotta)
--accent-foreground: #fbf7ef
--border:          #e2d6c3
--ring:            #d97832
```

Tailwind v4 có sẵn utilities từ token: `text-tangerine`, `bg-ivory`, `border-sand`, `text-olive`, `text-charcoal`, `text-earth`, `text-terracotta`...

---

## 3. Typography

| Loại | Font | Weight |
|---|---|---|
| **Heading** | Cormorant Garamond (`font-serif`) | 400–700 |
| **Body / UI** | Be Vietnam Pro (`font-sans`) | 300–600 |

- Hỗ trợ tiếng Việt đầy đủ (subset `vietnamese`)
- Đặt scss: `font-serif` cho heading, body mặc định `font-sans`

### Hierarchy

| Element | Class |
|---|---|
| H1 (hero) | `font-serif text-[2.75rem] md:text-6xl lg:text-7xl font-medium leading-[1.05]` |
| H2 (section) | `wispic-h2` — `font-serif text-4xl md:text-5xl font-medium` |
| Label trên H2 | `wispic-label` — `text-xs uppercase tracking-[0.28em] text-terracotta` |
| Body | `text-base font-light leading-relaxed text-muted-foreground` |

### Nguyên tắc

- Editorial typography, serif thanh lịch, sans rõ ràng
- `tracking-tight` cho heading lớn, `tracking-[0.25-0.3em]` cho label uppercase
- `leading-relaxed` cho body (generous line-height)
- Dùng `text-balance` cho heading, `text-pretty` cho paragraph

---

## 4. Logo

Concept: **Tangerine + Camera + Leaf**.

- Component: `components/logo.tsx`
  - `Logo` — mark + wordmark "WISPIC"
  - `WispicMark` — SVG camera/leaf standalone
- Logo là **visual identity element**, dùng ở header + footer mọi trang
- Không sửa concept, không drop vào decorative context

```tsx
import { Logo } from '@/components/logo'
// header: <a href="#top"><Logo /></a>
// footer: <Logo />
```

---

## 5. Layout & Spacing

| Token | Giá trị |
|---|---|
| Container | `max-w-6xl` (1152px) |
| Container class | `wispic-container` → `mx-auto w-full max-w-6xl px-5 md:px-8` |
| Section padding | `wispic-section` → `py-20 md:py-28 scroll-mt-24` |
| Card gap | `gap-5` (grid), `gap-6` (feature list) |
| Grid templates | 3 cols desktop / 2 cols tablet / 1 col mobile |

### Nguyên tắc

- ✅ Generous whitespace
- ✅ Asymmetric layout khi phù hợp (ví dụ features: 0.9fr/1.1fr)
- ✅ Thin borders `border-border/60–70`
- ❌ Tránh card SaaS đặc kín, tránh shadow nặng

---

## 6. Components (Reusable)

### Utilities trong `globals.css`

| Utility | Usage |
|---|---|
| `wispic-container` | Wrapper section |
| `wispic-section` | Section spacing + scroll-margin |
| `wispic-label` | Section label |
| `wispic-h2` | Section heading |
| `wispic-btn-primary` | Nút chính (tangerine) |
| `wispic-btn-outline` | Nút phụ (border) |
| `wispic-card` | Card: `rounded-lg border border-border/70 bg-card` |
| `scrollbar-hide` | Ẩn scrollbar (carousel) |

### Components có sẵn

| Component | Dùng cho |
|---|---|
| `Reveal` | Scroll reveal (fade-up, IntersectionObserver) |
| `Logo` / `WispicMark` | Brand identity |
| `SiteHeader` / `SiteFooter` | Layout trang |
| `Hero`, `TemplateShowcase`, `Features`, `HowItWorks`, `Testimonials`, `Faq`, `FinalCta` | Trang chủ |

### Button style

- Nút chính: `wispic-btn-primary` — primary bg (tangerine), rounded-full, text ivory
- Nút phụ: `wispic-btn-outline` — border, text foreground, hover bg-secondary

### Radius & Border & Shadow

| Token | Giá trị |
|---|---|
| Base radius | `0.5rem` |
| Card | `rounded-lg` (0.5rem) |
| Image/hero portrait | `rounded-[1.25rem]` tối đa |
| CTA block | `rounded-[1.75rem]` tối đa |
| Border | `1px border-border/60-70` |
| Shadow | mềm, nhạt: `shadow-[0_24px_60px_-40px_rgba(41,37,34,0.4)]` |

> Nguyên tắc: **minimal rounded corners**. Tránh bo tròn quá mức (2rem trên mọi card = sai).

---

## 7. Photography Direction

Chủ đề ảnh ưu tiên:

- Vietnamese couples, wedding moments
- Áo dài, lễ gia tiên
- Family moments, candid emotions
- Portrait, fashion/editorial
- Natural Vietnamese light

Mood: warm · intimate · cinematic · natural · sophisticated.

> Ảnh là "photography" — không phải stock illustration. Với template thiệp, ảnh cưới của cặp đôi là trung tâm.

---

## 8. Motion

Nguyên tắc: **subtle, phục vụ storytelling, không thêm để "cho đẹp"**.

| Motion | Cách dùng |
|---|---|
| Fade-up | `animate-fade-up` (hero) |
| Scroll reveal | `Reveal` component (threshold 15%) |
| Image scale | `group-hover:scale-[1.04]` — nhẹ, 1200ms ease-out |
| Hover | opacity chuyển màu, translate icon nhỏ |

Có sẵn keyframes trong `--theme`: `fade-up`, `fade-in`.

---

## 9. Checklist cho Template/Page mới

Khi tạo template thiệp hoặc page UI mới, kiểm tra:

- [ ] Nền dùng `bg-background`, không sáng quá / tối quá
- [ ] Heading dùng `font-serif`, body `font-sans`
- [ ] Section label = `wispic-label`
- [ ] Rounded corner: card `rounded-lg`, ảnh lớn ≤ `rounded-[1.25rem]`
- [ ] Tangerine chỉ dùng làm accent (<5% diện tích)
- [ ] Nút dùng `wispic-btn-primary` / `wispic-btn-outline`
- [ ] Border mỏng `border-border/60-70`, shadow mềm
- [ ] Đủ whitespace, section spacing = `wispic-section`
- [ ] Ảnh theo photography direction (warm, Vietnamese, editorial)
- [ ] Animation: chỉ fade/reveal, không flashy
- [ ] Responsive: kiểm tra mobile (1 col) / desktop (3 col)
- [ ] Tiếng Việt font hỗ trợ chuẩn

---

## 10. Do — Don't

| ✅ Do | ❌ Don't |
|---|---|
| Ivory làm nền chủ đạo | Orange làm nền toàn page |
| Tangerine làm accent | Generic SaaS marketing card |
| Serif heading thanh lịch | Gradient mạnh |
| Thân thiện, editorial | Bo tròn quá mức (2rem+ khắp nơi) |
| Nhiếp ảnh Việt, chân thực | Stocky, flashy animation |
| Motion nhẹ nhàng | Shadow dày, đậm |
| Restrained UI | Kiểu "template marketplace" |