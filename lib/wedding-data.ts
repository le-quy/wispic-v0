export type WeddingPhoto = { id: string; url: string; alt?: string };

export type CeremonyDetail = { time: string; date: string };
export type ReceptionDetail = { time: string; description: string };
export type LocationDetail = { city: string; province: string; venueName: string };

export type RsvpQuestion = { id: string; text: string; type: 'yes_no' | 'text' };

export type RsvpConfig = {
  enabled: boolean;
  displayMode: 'button' | 'inline';
  maxGuestCount: number;
  questions: RsvpQuestion[];
};

export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  holderName: string;
  qrUrl?: string;
};

export type GiftConfig = {
  enabled: boolean;
  displayMode: 'button' | 'inline';
  title: string;
  accounts: BankAccount[];
};

export type TimelineEvent = { id: string; time: string; title: string };

export type DressCode = {
  enabled: boolean;
  title: string;
  subtitle: string;
  colors: string[];
};

export type MusicConfig = {
  enabled: boolean;
  url?: string;
  title?: string;
};

export type GuestbookConfig = {
  enabled: boolean;
  questions: RsvpQuestion[];
};

export type EnvelopeConfig = { greeting: string };

export type OgConfig = { style: 'envelope' | 'photo'; customUrl?: string };

export type MapConfig = {
  embedUrl?: string;
  address?: string;
};

export type WeddingData = {
  groom: string;
  bride: string;
  groomParents: string;
  brideParents: string;
  weddingDate: string;
  ceremony: CeremonyDetail;
  reception: ReceptionDetail;
  location: LocationDetail;
  introduction: string;
  coupleStory: string;
  avatar: WeddingPhoto | null;
  couplePhoto: WeddingPhoto | null;
  photos: WeddingPhoto[];
  rsvp: RsvpConfig;
  gift: GiftConfig;
  timeline: TimelineEvent[];
  dressCode: DressCode;
  music: MusicConfig;
  guestbook: GuestbookConfig;
  envelope: EnvelopeConfig;
  og: OgConfig;
  map: MapConfig;
};

export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85";
export const DEFAULT_COUPLE_PHOTO =
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85";

export const DEFAULT_RSVP: RsvpConfig = {
  enabled: true,
  displayMode: 'button',
  maxGuestCount: 5,
  questions: [],
};

export const DEFAULT_GIFT: GiftConfig = {
  enabled: true,
  displayMode: 'button',
  title: 'Mừng cưới',
  accounts: [],
};

export const DEFAULT_TIMELINE: TimelineEvent[] = [
  { id: 'tl-01', time: '17:30', title: 'Đón khách' },
  { id: 'tl-02', time: '18:00', title: 'Chụp ảnh kỷ niệm' },
  { id: 'tl-03', time: '19:00', title: 'Tiệc chính thức' },
];

export const DEFAULT_DRESS_CODE: DressCode = {
  enabled: true,
  title: 'Dress Code',
  subtitle: 'Tông màu hoà cùng ngày vui',
  colors: ['#6F7558', '#F7F2E9'],
};

export const DEFAULT_MUSIC: MusicConfig = {
  enabled: false,
  url: '',
  title: '',
};

export const DEFAULT_GUESTBOOK: GuestbookConfig = {
  enabled: true,
  questions: [],
};

export const DEFAULT_ENVELOPE: EnvelopeConfig = {
  greeting: 'Mời bạn đến chia sẻ niềm vui cùng chúng mình',
};

export const DEFAULT_OG: OgConfig = {
  style: 'envelope',
  customUrl: '',
};

export const DEFAULT_MAP: MapConfig = {
  embedUrl: '',
  address: '',
};

export const demoWedding: WeddingData = {
  groom: "Wis",
  bride: "Paoziiee",
  groomParents: "Ông Minh Châu & Bà Thu Hà",
  brideParents: "Ông Đình Quân & Bà Thanh Lan",
  weddingDate: "20 · 10 · 2026",
  ceremony: { time: "10:00", date: "20 tháng 10, 2026" },
  reception: { time: "18:00", description: "Tiệc cưới" },
  location: {
    city: "Quy Nhơn",
    province: "Bình Định",
    venueName: "Trung tâm tiệc cưới Hoàng Gia",
  },
  introduction:
    "Có những cuộc gặp gỡ tưởng như tình cờ, nhưng rồi lại trở thành điều đẹp nhất trong cuộc đời. Minh và Vy rất vui khi được chia sẻ ngày đặc biệt này cùng những người thân yêu.",
  coupleStory:
    "Từ một cuộc gặp gỡ bình thường, chúng mình đã cùng nhau đi qua rất nhiều khoảnh khắc. Và hôm nay, chúng mình muốn bắt đầu một hành trình mới — cùng nhau.",
  avatar: { id: "avatar", url: DEFAULT_AVATAR, alt: "Cô dâu & chú rể" },
  couplePhoto: {
    id: "couple",
    url: DEFAULT_COUPLE_PHOTO,
    alt: "Khoảnh khắc của cặp đôi",
  },
  photos: [
    {
      id: "memory-01",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
      alt: "Wedding memory",
    },
    {
      id: "memory-02",
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",
      alt: "Wedding memory",
    },
    {
      id: "memory-03",
      url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85",
      alt: "Wedding memory",
    },
  ],
  rsvp: { ...DEFAULT_RSVP },
  gift: { ...DEFAULT_GIFT },
  timeline: DEFAULT_TIMELINE.map((e) => ({ ...e })),
  dressCode: { ...DEFAULT_DRESS_CODE },
  music: { ...DEFAULT_MUSIC },
  guestbook: { ...DEFAULT_GUESTBOOK },
  envelope: { ...DEFAULT_ENVELOPE },
  og: { ...DEFAULT_OG },
  map: { ...DEFAULT_MAP },
};
