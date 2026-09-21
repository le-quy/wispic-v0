# WISPIC — Template Authoring Spec (thông số cho agent sinh HTML)

> File này là **contract duy nhất**. Bất kỳ agent nào được giao "tạo mẫu thiệp cưới WISPIC"
> phải đọc kỹ và bám theo đúng: danh sách section chuẩn, cú pháp biến, quy ước CSS và cấu trúc
> output. Chỉ cần tuân đúng contract, HTML sinh ra sẽ hiển thị chính xác và lưu vào database hợp lệ.

---

## 1. VAI TRÒ & NHIỆM VỤ CỦA AGENT

Bạn là **chuyên gia thiết kế thiệp cưới số**. Nhiệm vụ: sinh ra **1 bản ghi template** cho trang
WISPIC, gồm:

- Metadata (tên, danh mục, mô tả, màu sắc).
- File CSS toàn trang (font, nền, biến màu, class dùng chung).
- Danh sách **section HTML** theo thứ tự hiển thị trên thiệp. Mỗi section độc lập, dùng đúng
  **key chuẩn** và đúng **biến dữ liệu** được phép của section đó.

Kết quả đầu ra phải nằm trong khối `--TEMPLATE-JSON--` để hệ thống import được vào bảng
`templates` (xem mục 8).

> Không được tự bịa key mới. Không được chèn thẻ `<html>`, `<head>`, `<style>`, `<script>` vào
> HTML của section — engine toàn cục tự lo những phần đó (mục 5 & 6).

---

## 2. DANH SÁCH SECTION CHUẨN (CANONICAL SECTION REGISTRY)

Thiệp cưới được chia thành các **slot** cố định. Engine nhận diện section bằng `key`; dữ liệu
đúng của từng slot sẽ được điền vào. Admin có thể: bỏ bớt, thêm lại, sắp xếp thứ tự tuỳ ý —
tạo nên vô số bố cục mới.

### 2.1 Nhóm section TĨNH (admin viết HTML, engine điền biến)

| Key | Tên hiển thị | Nội dung | Biến được phép dùng |
|---|---|---|---|
| `hero` | Ảnh bìa | Ảnh nền full màn hình, tên đôi, ngày cưới | `groom`, `bride`, `weddingDate`, `avatar` |
| `family` | Kính mời song thân | Giới thiệu bố mẹ hai bên, dòng "con trai / con gái" | `groomParents`, `brideParents`, `groom`, `bride` |
| `intro` | Lời mời | Câu giới thiệu / lời mời chung | `introduction`, `groom`, `bride` |
| `couple` | Cặp đôi & câu chuyện | Ảnh đôi + chuyện tình | `couplePhoto`, `coupleStory`, `groom`, `bride` |
| `details` | Save-the-date | Lễ, tiệc, địa điểm | `weddingDate`, `ceremony.*`, `reception.*`, `location.*` |
| `gallery` | Bộ sưu tập ảnh | Lưới ảnh kỷ niệm | `photos` (each: `url`, `alt`) |
| `closing` | Lời cảm ơn | Kết trang, tên đôi | `groom`, `bride` |

### 2.2 Nhóm section WIDGET (engine tự render widget chuẩn)

Admin **chỉ viết phần bao ngoài** (section chứa tiêu đề, chú thích, bố cục) và đặt placeholder
`{{#widget key}}`. Engine tự sinh khối tương tác chuẩn (nút RSVP, form lời chúc, thẻ tài khoản,
bản đồ, đếm ngược…) và tự ẩn đi nếu dữ liệu của đôi cưới chưa bật tính năng đó.

| Key | Tên hiển thị | Widget tự render |
|---|---|---|
| `countdown` | Đếm ngược tới ngày cưới | 4 ô Ngày / Giờ / Phút / Giây |
| `timeline` | Lịch trình buổi tiệc | Timeline từ `timeline[]` (mỗi mốc: `time`, `title`) |
| `dressCode` | Dress code | Tiêu đề, mô tả, vòng tròn màu gợi ý |
| `gift` | Mừng cưới | Thẻ tài khoản ngân hàng + QR từ `gift` |
| `map` | Bản đồ chỉ đường | Khung Google Maps từ `map.embedUrl` |
| `guestbook` | Sổ lưu bút / lời chúc | Ô nhập + nút gửi lời chúc |
| `rsvp` | Xác nhận tham dự | Nút "Tôi sẽ đến" / "Không đến được" + câu hỏi |
| `envelope` | Lời chào phong bì | Trích lời chào `envelope.greeting` |
| `music` | Nhạc nền | Nút nhạc nổi góc phải dưới (MP3 / YouTube) |

**Cấu trúc section widget ví dụ:**

```html
<section class="wt-gift">
  <p class="wt-eyebrow">Mừng cưới</p>
  <h2 class="wt-title">Chung vui cùng cặp đôi</h2>
  <p class="wt-note">Nếu bạn muốn gửi lời chúc mừng, chúng mình rất trân trọng.</p>
  {{#widget gift}}
</section>
```

### 2.3 Thứ tự hợp lệ đề nghị

`hero → family → intro → couple → details → countdown → timeline → gallery → dressCode → gift → map → guestbook → rsvp → envelope → closing`

> Đây chỉ là thứ tự *gợi ý*. Agent được phép chọn bất kỳ thứ tự nào, miễn `hero` (hoặc một
> section mở màn) đứng đầu và `closing` đứng cuối. Các section không muốn dùng thì **bỏ hẳn**.

---

## 3. MÔ HÌNH DỮ LIỆU (DÙNG ĐỂ TEST & ĐIỀN BIẾN)

### 3.1 Cấu trúc `WeddingData`

```ts
groom: string                        // tên chú rể
bride: string                        // tên cô dâu
groomParents: string                 // "Ông X & Bà Y"
brideParents: string
weddingDate: string                  // "20 · 10 · 2026"
ceremony:   { time: string, date: string }        // giờ lễ, ngày lễ chi tiết
reception:  { time: string, description: string }
location:   { city, province, venueName: string }
introduction: string
coupleStory: string
avatar:      { url: string, alt?: string } | null // ảnh bìa
couplePhoto: { url: string, alt?: string } | null // ảnh đôi
photos:      { url: string, alt?: string }[]      // album

// Dữ liệu widget (thường không cần tham chiếu trực tiếp trong HTML section,
// widget đọc từ đây):
timeline:     { time: string, title: string }[]
dressCode:    { enabled, title, subtitle, colors: string[] }
gift:         { enabled, title, accounts: [{bankName, accountNumber, holderName, qrUrl?}] }
map:          { embedUrl?, address? }
guestbook:    { enabled, questions[] }
rsvp:         { enabled, displayMode, maxGuestCount, questions[] }
envelope:     { greeting: string }
music:        { enabled, url?, title? }
```

> Quy ước **null/optional**: nếu một trường rỗng, section tĩnh dùng biến đó phải được bọc
> `{{#if ...}}` để tự ẩn (xem 4.3).

### 3.2 Dữ liệu mẫu (dùng để kiểm tra bản render)

```
groom = "Wis"                        bride = "Paoziiee"
groomParents = "Ông Minh Châu & Bà Thu Hà"
brideParents = "Ông Đình Quân & Bà Thanh Lan"
weddingDate = "20 · 10 · 2026"
ceremony  = { time: "10:00", date: "20 tháng 10, 2026" }
reception = { time: "18:00", description: "Tiệc cưới" }
location  = { city: "Quy Nhơn", province: "Bình Định", venueName: "Trung tâm tiệc cưới Hoàng Gia" }
introduction = "Có những cuộc gặp gỡ tưởng như tình cờ, nhưng rồi lại trở thành điều đẹp nhất trong cuộc đời..."
coupleStory  = "Từ một cuộc gặp gỡ bình thường, chúng mình đã cùng nhau đi qua rất nhiều khoảnh khắc..."
avatar, couplePhoto, photos: URL ảnh Unsplash bất kỳ
```

---

## 4. CÚ PHÁP TEMPLATE (ENGINE)

ENGINE = WISPIC Template Engine. Dùng 4 loại tag duy nhất:

### 4.1 Biến `{{path.to.field}}`

```html
<h1>{{groom}} &amp; {{bride}}</h1>
<p>{{weddingDate}}</p>
<p>{{ceremony.time}} — {{reception.time}}</p>
<p>{{location.venueName}}</p>
```

- Hỗ trợ truy cập lồng nhau như `{{ceremony.time}}`, `{{avatar.url}}`, `{{location.city}}`.
- Văn bản được **tự escape HTML** (an toàn XSS) — không cần lo dấu ngoặc trong dữ liệu.
- Trường ảnh object (`avatar`, `couplePhoto`) công khai qua `{{avatar.url}}`, `{{avatar.alt}}`.

### 4.2 Điều kiện `{{#if ...}} ... {{/if}}`

```html
{{#if avatar}}
  <img src="{{avatar.url}}" alt="{{avatar.alt}}" />
{{/if}}

{{#if groomParents}}<p>{{groomParents}} · con trai</p>{{/if}}

{{#if location.venueName}}<p class="venue">{{location.venueName}}</p>{{/if}}

{{#if photos.length}}
  <div class="grid">{{#each photos}}...{{/each}}</div>
{{/if}}
```

- Truthy/falsy theo dữ liệu thực: chuỗi rỗng, `null`, mảng rỗng → falsy (block bị ẩn).

### 4.3 Vòng lặp `{{#each listName}} ... {{/each}}`

```html
<div class="gallery">
  {{#each photos}}
    <img src="{{this.url}}" alt="{{this.alt}}" />
  {{/each}}
</div>
```

- Trong vòng lặp, phần tử hiện tại truy cập bằng **`this`** (`{{this.url}}`, `{{this.alt}}`).
- Luôn bọc với `{{#if photos.length}}` để tránh khung trống khi chưa có ảnh.

### 4.4 Widget `{{#widget key}}`

Chèn 1 trong các key widget ở mục 2.2 (`timeline`, `dressCode`, `gift`, `map`, `guestbook`,
`rsvp`, `envelope`, `countdown`, `music`). Engine thay thế bằng khối tương tác chuẩn và tự ẩn
nếu tính năng tắt hoặc dữ liệu rỗng.

**QUY TẮC MẸ:** nếu dùng biến mà có thể rỗng → luôn bọc `{{#if}}`. Nếu dùng ảnh → luôn có
`{{#if}}` kiểm tra trước.

---

## 5. QUY ƯỚC CSS

### 5.1 Phân tầng stylesheet

- **CSS toàn trang** (field `css`): font import, `:root` biến màu, rule `body`, và các class
  dùng chung nhiều section. Engine đã mặc định body với font `Be Vietnam Pro` (300) + màu nền
  sáng + `font-family: 'Cormorant Garamond'` cho serif — bạn *có thể* để mặc định hoặc override.
- **CSS từng section** (field `css` trong từng phần tử `sections[]`): class riêng của section đó.

### 5.2 Quy tắc đặt tên (KHÔNG ĐƯỢC BỎ QUA)

- Mọi class trong section HTML/CSS phải có **tiền tố** `wt-` (WISPIC Template): `.wt-hero`,
  `.wt-gallery__grid`, `closing` = `.wt-closing__names`, …
- **Không dùng** class chung chung như `.title`, `.card`, `.grid` (dễ đụng độ widget chuẩn).
- Tránh modifier quá dài; giữ cấu trúc BEM nhẹ: `.wt-block__elem--mod`.

### 5.3 Biến màu toàn cục

Engine cung cấp 3 màu chủ đạo mặc định, bạn NÊN map vào CSS riêng của mình:

```css
:root {
  --wt-bg: #f7f3ee;      /* nền trang          -> swatches[0] */
  --wt-bg-dark: #302b27; /* nền section tối    -> swatches[1] */
  --wt-accent: #9b8878;  /* điểm nhấn          -> accent      */
  --wt-text: #302b27;
  --wt-muted: #706861;
  --wt-card: #ffffff;
}
```

Tái sử dụng trong section: `color: var(--wt-accent); background: var(--wt-bg);`

### 5.4 Chuẩn kỹ thuật

- **Mobile-first**: mặc định 1 cột; mở rộng bằng `@media (min-width: 768px)`.
- Không `position: fixed` tránh bị cắt trong khung chính (trừ khi thực sự cần overlay).
- Font serif tiêu đề: `font-family: 'Cormorant Garamond', serif;` thường kèm `font-style: italic`.
- Ảnh full-width: `aspect-ratio` + `object-fit: cover`.
- Responsive lưới ảnh: `display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;` +
  `@media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }`
- Độ đọc: chữ thân ≥ `0.9rem`, line-height ≥ `1.8`, màu phụ dịu hơn chữ chính.
- **KHÔNG** `transition`/`animation` phụ thuộc JS — đảm bảo hoạt động bình thường không JS.

---

## 6. RÀNG BUỘC KỸ THUẬT

1. Viết **HTML5 ngữ nghĩa**: `<section>`, `<header>`, `<footer>`, `<figure>`, `<h1>–<h3>`.
2. Mỗi section là một cụm độc lập; có thể đứng riêng hoặc ghép nối liền mạch.
3. **KHÔNG** đặt `<style>`, `<script>`, `<html>`, `<head>`, `<body>` trong `html` của section.
   - Tất cả CSS tập trung ở field `css` toàn trang + field `css` của section.
4. Mọi `img` dùng thẻ `<img>` thuần (không `next/image`), luôn có `alt`.
5. Nội dung tiếng Việt, trang trọng, khai thác văn hoá cưới Việt Nam.
6. Chỉ dùng biến **có trong registry** của từng section (bảng mục 2). Không dùng biến lạ.
7. Output phải theo đúng cấu trúc mục 8 để import được vào database.

---

## 7. BẢN TEMPLATE THAM CHIẾU ĐẦY ĐỦ (CÓ THỂ "SINH PHÔI TỪ ĐÂY")

Đây là mẫu chuẩn đã được hệ thống xác nhận hoạt động đúng. Agent có thể dùng làm nền, đổi
màu/typography/bố cục tạo biến thể mới. Cấu trúc: các section theo thứ tự gợi ý, kèm CSS toàn
trang và CSS riêng 1–2 section minh hoạ.

### 7.1 HTML từng section (array `sections`)

**`hero`**
```html
<section class="wt-hero">
  {{#if avatar}}<img src="{{avatar.url}}" alt="{{avatar.alt}}" class="wt-hero__img" />{{/if}}
  <div class="wt-hero__overlay"></div>
  <div class="wt-hero__content">
    <p class="wt-hero__label">Wedding Invitation</p>
    <h1 class="wt-hero__names">{{groom}} &amp; {{bride}}</h1>
    <div class="wt-hero__divider"></div>
    <p class="wt-hero__date">{{weddingDate}}</p>
  </div>
</section>
```

**`family`**
```html
<section class="wt-family">
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
</section>
```

**`intro`**
```html
<section class="wt-intro">
  <div class="wt-intro__inner">
    <p class="wt-eyebrow">We are getting married</p>
    <h2 class="wt-intro__title">Hai người, một câu chuyện.</h2>
    <p class="wt-intro__text">{{introduction}}</p>
  </div>
</section>
```

**`couple`**
```html
<section class="wt-couple">
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
</section>
```

**`details`**
```html
<section class="wt-details">
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
</section>
```

**`countdown`**
```html
<section class="wt-widget">
  <p class="wt-eyebrow">Đếm ngược</p>
  <h2 class="wt-widget__title">Ngày vui đang đến gần</h2>
  {{#widget countdown}}
</section>
```

**`timeline`**
```html
<section class="wt-widget wt-widget--bg">
  <p class="wt-eyebrow">Timeline</p>
  <h2 class="wt-widget__title">Lịch trình buổi tiệc</h2>
  {{#widget timeline}}
</section>
```

**`gallery`**
```html
{{#if photos.length}}
<section class="wt-gallery">
  <p class="wt-eyebrow">Our memories</p>
  <h2 class="wt-gallery__title">Những khoảnh khắc</h2>
  <div class="wt-gallery__grid">
    {{#each photos}}
    <img src="{{this.url}}" alt="{{this.alt}}" class="wt-gallery__img" />
    {{/each}}
  </div>
</section>
{{/if}}
```

**`dressCode`**
```html
<section class="wt-widget">
  <p class="wt-eyebrow">Dress Code</p>
  <h2 class="wt-widget__title">Tông màu hoà cùng ngày vui</h2>
  {{#widget dressCode}}
</section>
```

**`gift`**
```html
<section class="wt-gift">
  <p class="wt-eyebrow">Mừng cưới</p>
  <h2 class="wt-gift__title">Chung vui cùng cặp đôi</h2>
  <p class="wt-gift__note">Nếu bạn muốn gửi lời chúc mừng, chúng mình rất trân trọng.</p>
  {{#widget gift}}
</section>
```

**`map`**
```html
<section class="wt-widget">
  <p class="wt-eyebrow">Chỉ đường</p>
  <h2 class="wt-widget__title">Bản đồ</h2>
  {{#widget map}}
</section>
```

**`guestbook`**
```html
<section class="wt-widget">
  <p class="wt-eyebrow">Lời chúc</p>
  <h2 class="wt-widget__title">Gửi lời chúc đến cặp đôi</h2>
  {{#widget guestbook}}
</section>
```

**`rsvp`**
```html
<section class="wt-rsvp">
  <p class="wt-eyebrow">RSVP</p>
  <h2 class="wt-rsvp__title">Xác nhận tham dự</h2>
  <p class="wt-rsvp__note">Hãy cho chúng mình biết bạn có thể đến và tham gia ngày vui.</p>
  {{#widget rsvp}}
</section>
```

**`closing`**
```html
<section class="wt-closing">
  <p class="wt-closing__label">With love</p>
  <h2 class="wt-closing__names">{{groom}} &amp; {{bride}}</h2>
  <p class="wt-closing__text">Cảm ơn bạn đã đến và chia sẻ niềm vui cùng chúng mình.</p>
</section>
```

### 7.2 CSS toàn trang (field `css`)

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --wt-bg: #f7f3ee;
  --wt-bg-dark: #302b27;
  --wt-accent: #9b8878;
  --wt-text: #302b27;
  --wt-muted: #706861;
  --wt-card: #ffffff;
}

body {
  background: var(--wt-bg);
  color: var(--wt-text);
  font-weight: 300;
  line-height: 1.8;
}

img { max-width: 100%; display: block; }

.wt-eyebrow {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: var(--wt-accent);
}
.wt-widget__title, .wt-intro__title, .wt-gallery__title, .wt-details__date,
.wt-rsvp__title, .wt-gift__title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
}

.wt-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  text-align: center;
  padding: 1.5rem;
}
.wt-hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.wt-hero__overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.3); }
.wt-hero__content { position: relative; z-index: 10; }
.wt-hero__label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5em; margin-bottom: 1.5rem; }
.wt-hero__names { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 3.5rem; line-height: 1.1; }
.wt-hero__divider { width: 5rem; height: 1px; background: rgba(255, 255, 255, 0.7); margin: 2rem auto; }
.wt-hero__date { font-size: 0.85rem; letter-spacing: 0.3em; }

.wt-family, .wt-intro, .wt-details, .wt-gift, .wt-rsvp { padding: 7rem 1.5rem; text-align: center; }
.wt-couple { background: var(--wt-card); padding: 6rem 1.5rem; }
.wt-widget { padding: 5rem 1.5rem; text-align: center; }
.wt-widget__title { font-size: 2.25rem; margin-top: 0.75rem; }

.wt-family__inner, .wt-couple__grid { max-width: 56rem; margin: 0 auto; }
.wt-couple__grid { display: grid; gap: 3rem; align-items: center; }
@media (min-width: 768px) { .wt-couple__grid { grid-template-columns: 1fr 1fr; } }
.wt-couple__photo img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 2rem; }
.wt-couple__names { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 3rem; margin-top: 1rem; }
.wt-couple__story { margin-top: 1.5rem; color: var(--wt-muted); }

.wt-details__cards { display: grid; gap: 1.25rem; margin-top: 3rem; }
@media (min-width: 768px) { .wt-details__cards { grid-template-columns: repeat(3, 1fr); } }
.wt-details__card { background: var(--wt-card); border-radius: 1rem; padding: 2rem; }
.wt-details__label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--wt-accent); }
.wt-details__time { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-top: 1rem; }
.wt-details__desc { font-size: 0.85rem; color: var(--wt-muted); margin-top: 0.5rem; }
.wt-details__venue { font-style: italic; color: var(--wt-muted); margin-top: 1.5rem; }

.wt-gallery { background: var(--wt-card); padding: 6rem 1.5rem; text-align: center; }
.wt-gallery__grid { display: grid; gap: 1rem; margin-top: 3rem; grid-template-columns: repeat(2, 1fr); }
@media (min-width: 768px) { .wt-gallery__grid { grid-template-columns: repeat(3, 1fr); } }
.wt-gallery__img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 1rem; }

.wt-closing {
  background: var(--wt-bg-dark);
  color: #fff;
  padding: 8rem 1.5rem;
  text-align: center;
}
.wt-closing__label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.4em; color: rgba(255, 255, 255, 0.5); }
.wt-closing__names { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 3rem; margin-top: 1.5rem; }
.wt-closing__text { font-size: 0.85rem; color: rgba(255, 255, 255, 0.6); margin-top: 2rem; }
```

### 7.3 CSS riêng của `timeline` (minh hoạ phần CSS theo section)

```css
@media (min-width: 640px) {
  .wt-widget--bg { background: var(--wt-bg-dark); color: #fff; }
}
```

---

## 8. ĐỊNH DẠNG OUTPUT (BẮT BUỘC)

Agent phải xuất ra duy nhất **một** khối JSON hợp lệ, đặt trong thẻ:

```
--TEMPLATE-JSON--
{ ... }
--END-TEMPLATE-JSON--
```

Cấu trúc JSON (khớp cột bảng `templates`):

```json
{
  "name": "Tên mẫu (độc đáo, tiếng Việt, ≤ 60 ký tự)",
  "category": "Phong cách — ví dụ: Hiện đại | Truyền thống | Editorial | Minimal",
  "description": "Mô tả 1–2 câu về phong cách mẫu",
  "swatches": ["#màu-nền-1", "#màu-nền-2"],
  "accent": "#màu-điểm-nhấn",
  "is_custom": true,
  "css": "/* CSS toàn trang (mục 7.2) */",
  "sections": [
    { "key": "hero",      "html": "<!-- HTML nhóm 7.1 -->",                        "css": "" },
    { "key": "family",    "html": "...",                                           "css": "" },
    { "key": "intro",     "html": "...",                                           "css": "" },
    { "key": "couple",    "html": "...",                                           "css": "" },
    { "key": "details",   "html": "...",                                           "css": "" },
    { "key": "countdown", "html": "... {{#widget countdown}} ...",                "css": "" },
    { "key": "timeline",  "html": "... {{#widget timeline}} ...",                 "css": "/* CSS riêng timeline */" },
    { "key": "gallery",   "html": "...",                                           "css": "" },
    { "key": "dressCode", "html": "... {{#widget dressCode}} ...",                "css": "" },
    { "key": "gift",      "html": "... {{#widget gift}} ...",                      "css": "" },
    { "key": "map",       "html": "... {{#widget map}} ...",                       "css": "" },
    { "key": "guestbook", "html": "... {{#widget guestbook}} ...",                "css": "" },
    { "key": "rsvp",      "html": "... {{#widget rsvp}} ...",                     "css": "" },
    { "key": "closing",   "html": "...",                                           "css": "" }
  ]
}
```

### 8.1 Câu lệnh INSERT vào database (agent nên sinh kèm để đối soát)

```sql
INSERT INTO templates (name, category, description, swatches, accent, css, sections, is_custom)
VALUES (
  'Tên mẫu',
  'Hiện đại',
  'Mô tả',
  '["#f7f3ee","#302b27"]',
  '#9b8878',
  '<CSS toàn trang>',
  '<JSON. sections — mảng các {key, html, css}>'::jsonb,
  true
);
```

> Trong PHP/lưu trữ: nén `JSON.stringify(sections)` trước khi gửi. `sections` phải là **mảng có
> thứ tự** — thứ tự trong mảng chính là thứ tự hiển thị.

---

## 9. CHECKLIST TRƯỚC KHI NỘP (agent tự soát)

- [ ] Mọi section dùng `key` có trong mục 2; không bịa key mới.
- [ ] Thứ tự sections hợp lý, `hero` đầu / `closing` cuối (hoặc bỏ hẳn).
- [ ] Mọi `{{variable}}` đã kiểm tra: đúng đương dẫn (vd `ceremony.time`, `avatar.url`) và nằm
      trong danh sách biến của section đó.
- [ ] Biến có thể rỗng đều bọc `{{#if ...}}` (ảnh, parents, venueName, photos là bắt buộc).
- [ ] `photos` luôn `{{#each photos}}` + `{{this.url}}` + `{{#if photos.length}}`.
- [ ] Widget đặt placeholder `{{#widget key}}` đúng key (gift/rsvp/guestbook/map/countdown/…).
- [ ] Không có `<style>`, `<script>`, `<html>`, `<head>`, `<body>` trong HTML section.
- [ ] Toàn bộ class có tiền tố `wt-` trừ khi cần đè widget chuẩn.
- [ ] CSS responsive mobile-first (`@media (min-width: 768px)`).
- [ ] JSON hợp lệ, đủ metadata (name/category/description/swatches/accent).
- [ ] Đã kèm câu `INSERT` để import trực tiếp (mục 8.1).

---

## 10. GHI CHÚ BẢO TRÌ

- Registry section là nguồn chân lý; nếu cần thêm section mới phải thêm registry trước,
  không tự sửa ở template.
- 3 mẫu hệ thống (Lãng mạn / Thanh xuân / Song Hỷ) là React component và **không** dùng
  `sections`; model này chỉ áp dụng cho mẫu admin-created.
- Template cũ chỉ có `html`/`css` (không có `sections`) vẫn hoạt động qua đường render fallback.