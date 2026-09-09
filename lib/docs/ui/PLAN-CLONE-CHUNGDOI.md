# Kế Hoạch Clone Website Thiệp Cưới Online (chungdoi.com)

## Tổng Quan

Website thiệp cưới online — cho phép người dùng tạo thiệp cưới đẹp, quản lý khách mời, RSVP, và gửi thiệp qua link/Zalo/Facebook.

---

## 1. Cấu Trúc Trang (Pages)

### Landing Page (Trang chủ)
- [ ] Hero section: Tagline + CTA "Tạo Thiệp Ngay"
- [ ] Showcase mẫu thiệp (grid template thumbnails ~20+ mẫu)
- [ ] Section "Hướng dẫn 3 bước": Chọn mẫu → Điền thông tin → Gửi thiệp
- [ ] Section Đánh giá khách hàng (testimonial carousel)
- [ ] Section "Đổi mẫu tự do — giữ nguyên dữ liệu"
- [ ] Section Hỗ trợ đa ngôn ngữ
- [ ] Blog/Cẩm nang cưới (6 bài viết preview)
- [ ] FAQ section (8 câu hỏi thường gặp)
- [ ] Footer (Products, Tools, Resources, Legal links)

### Auth Pages
- [ ] Login / Sign up
- [ ] Forgot password

### Dashboard (Sau đăng nhập)
- [ ] Trang quản lý thiệp cưới đã tạo
- [ ] Trang tạo thiệp mới

### Editor (Trình chỉnh sửa thiệp)
- [ ] Chọn template từ gallery
- [ ] Form nhập thông tin: tên cô dâu chú rể, bố mẹ, ngày giờ cưới, địa điểm
- [ ] Upload ảnh (ảnh đại diện, ảnh couples, gallery)
- [ ] Preview realtime
- [ ] Đổi template mà không mất dữ liệu

### Preview Page
- [ ] Xem thiệp cưới như khách mời thấy
- [ ] Responsive trên mobile

### Guest Management (Quản lý khách mời)
- [ ] Thêm khách mời (đơn lẻ hoặc hàng loạt)
- [ ] Phân nhóm: gia đình, bàn, nhóm bạn...
- [ ] Gửi link thiệp riêng cho từng khách
- [ ] Dashboard thống kê: tổng khách, đã xác nhận, chưa phản hồi

### RSVP Page (Trang phản hồi khách mời)
- [ ] Khách xác nhận đến/không đến
- [ ] Số lượng khách đi cùng
- [ ] Yêu cầu phương tiện đi lại
- [ ] Chế độ ăn (chay, dị ứng)
- [ ] Ghi chú / Lời nhắn

### Public Invitation Page (Thiệp công khai)
- [ ] Trang thiệp cưới render theo template đã chọn
- [ ] Hiển thị đa ngôn ngữ (song song)
- [ ] Đếm ngược ngày cưới (Countdown timer)
- [ ] Bản đồ Google Maps chỉ đường
- [ ] QR Code cho in ấn

### Pricing Page
- [ ] Bảng giá (Freemium: miễn phí tạo, trả phí giữ vĩnh viễn)

### Blog
- [ ] Danh sách bài viết
- [ ] Chi tiết bài viết

---

## 2. Chức Năng Cốt Lõi (Features)

### 2.1 Template Engine
- [ ] 20+ template thiệp cưới với nhiều color variant
- [ ] Template categories: Truyền thống (Song Hỷ, Long Phụng), Hiện đại (Boho Floral, Baroque)
- [ ] Swap template giữ nguyên data
- [ ] Responsive trên mọi thiết bị

### 2.2 Editor
- [ ] Visual editor — click để chỉnh sửa
- [ ] WYSIWYG (What You See Is What You Get)
- [ ] Upload ảnh không nén
- [ ] Photo gallery / Album

### 2.3 Guest & RSVP
- [ ] CRUD khách mời
- [ ] Bulk import (CSV/Excel?)
- [ ] Guest groups / tables
- [ ] Unique invitation link per guest (personalized greeting)
- [ ] RSVP tracking dashboard
- [ ] Shared guest management (family members add guests without login)

### 2.4 Sharing
- [ ] Share via link (Zalo, Messenger, Facebook)
- [ ] QR Code generation
- [ ] Gift money QR (nhận tiền mừng)

### 2.5 Multi-language
- [ ] 14 ngôn ngữ (VI, EN, ZH-TW, ZH-CN, AR, FR, PT, ES, JA, RU, ID, TH, DE, KO)
- [ ] Hiển thị song song 2 ngôn ngữ trên cùng thiệp

### 2.6 Theme
- [ ] Dark/Light mode toggle
- [ ] Persist preference in localStorage

### 2.7 Payment
- [ ] One-time payment (không subscription)
- [ ] Pricing theo quốc gia
- [ ] Integrate LemonSqueezy hoặc Stripe
- [ ] 3 ngày dùng thử miễn phí sau khi publish

---

## 3. Technical Stack (Đề xuất)

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | Tailwind CSS + DaisyUI |
| Font | Pattaya (decorative), Geist (body) |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Auth | Supabase Auth |
| Image Storage | Supabase Storage / Cloudinary |
| Payment | LemonSqueezy hoặc Stripe |
| i18n | next-intl hoặc custom solution |
| Email | Resend / Nodemailer |
| Maps | Google Maps API |
| QR Code | qrcode.react |
| Analytics | Google Analytics + Facebook Pixel |
| PWA | next-pwa |

---

## 4. Database Schema (Draft)

### users
- id, email, name, avatar, created_at

### weddings
- id, user_id, groom_name, bride_name, groom_parents, bride_parents
- wedding_date, ceremony_time, reception_time
- venue_name, venue_address, venue_lat, venue_lng
- introduction_text, couple_story
- template_id, language
- status (draft, published, expired)
- published_at, created_at

### wedding_photos
- id, wedding_id, type (avatar, couple, gallery), url, alt, sort_order

### templates
- id, name, slug, category, color_variants[], thumbnail_url, is_new

### guests
- id, wedding_id, group_name, name, email, phone
- personal_greeting, address_label
- attending (null, yes, no), companions_count
- transport_needed, dietary, song_request, note
- invitation_token (unique link), sent_at, responded_at

### translations
- id, wedding_id, language, field_key, value

### payments
- id, user_id, wedding_id, amount, currency, status, lemon_squeezy_id, created_at

---

## 5. Phân Loại Mẫu Thiệp

| Category | Templates | Style |
|---|---|---|
| Truyền thống Việt | Song Hỷ (Đỏ/Xanh), Long Phụng, Song Long, Song Phụng | Phong bao đỏ, chữ Hỷ, rồng phụng |
| Hiện đại | Hoa Mộc, Mai Lan, Hoa Lụa, Gấm Hoa | Minimalist, floral |
| Sang trọng | Lâu Đài, Baroque, Hoa Thuỷ Tinh | Castle, crystal, luxury |
| Bohemian | Boho Floral (Green/Pink) | Boho, dried flowers |
| Tự nhiên | Cherry Blossom, Elegant Leaf, Jasmine, Silk Flora | Nature-inspired |

---

## 6. Pages Route Map

```
/                          → Landing page
/vi/mau-thiep              → Template gallery
/vi/bang-gia               → Pricing page
/vi/blog                   → Blog listing
/vi/blog/[slug]            → Blog article
/vi/huong-dan              → Guide / How-to

/auth/login                → Login
/auth/sign-up              → Sign up
/auth/forgot-password      → Forgot password

/dashboard                 → My invitations list
/dashboard/create          → Create new invitation
/dashboard/[id]/edit       → Editor
/dashboard/[id]/preview    → Preview invitation
/dashboard/[id]/guests     → Guest management
/dashboard/[id]/rsvp       → RSVP dashboard
/dashboard/[id]/settings   → Invitation settings

/inv/[token]               → Public invitation page (guest view)
/inv/[token]/rsvp          → RSVP form (guest)
```

---

## 7. TIẾN ĐỘ ĐỀ XUẤT

### Phase 1: Foundation (Tuần 1-2)
- [ ] Setup project Next.js + Supabase + Tailwind/DaisyUI
- [ ] Auth (login/signup/forgot password)
- [ ] Database schema + Supabase setup
- [ ] Landing page cơ bản (Hero + Footer)

### Phase 2: Template System (Tuần 3-4)
- [ ] Xây dựng 2-3 template thiệp cưới đầu tiên (1 truyền thống + 1 hiện đại + 1 sang trọng)
- [ ] Template rendering engine
- [ ] Preview page

### Phase 3: Editor (Tuần 5-6)
- [ ] Visual editor (form nhập thông tin)
- [ ] Upload ảnh
- [ ] Đổi template giữ data
- [ ] Publish / Unpublish

### Phase 4: Guest & RSVP (Tuần 7-8)
- [ ] CRUD khách mời
- [ ] Unique invitation links
- [ ] RSVP page cho khách
- [ ] Dashboard thống kê

### Phase 5: Landing & Polish (Tuần 9-10)
- [ ] Hoàn thiện landing page (all sections)
- [ ] Template gallery
- [ ] Multi-language support
- [ ] Dark/Light theme
- [ ] Responsive polish

### Phase 6: Payment & Launch (Tuần 11-12)
- [ ] Integrate payment (LemonSqueezy/Stripe)
- [ ] Pricing page
- [ ] Blog system
- [ ] SEO + Analytics
- [ ] Testing + Bug fixes
- [ ] Deploy

---

## 8. Template Design Specs

### Mỗi template cần:
- Hero section (ảnh + tên cô dâu chú rể + ngày cưới)
- Introduction section
- Couple story / Love timeline
- Wedding details (lễ vật, tiệc, địa điểm)
- Photo gallery
- Google Maps
- RSVP section
- Countdown timer
- Closing / Thank you

### Color Variants per template:
- Template gốc: 1-2 màu chính
- Mỗi variant: đổi accent color, background, text

---

## 9. KEY DIFFERENTIATORS (Từ competitor)

1. **Đổi mẫu giữ data** — không cần nhập lại khi đổi template
2. **RSVP chi tiết** — companion count, transport, dietary, song request
3. **Guest link riêng** — personalized greeting per guest
4. **Đa ngôn ngữ song song** — hiển thị 2 ngôn ngữ cùng lúc
5. **Hỗ trợ 24/7** — reply under 1 minute
6. **No coding needed** — pure visual editor
