export interface StoryPage {
  pageNumber: number
  titleVi: string
  titleEn: string
  subtitleVi: string
  subtitleEn: string
  quoteVi?: string
  quoteEn?: string
  contentVi: string
  contentEn: string
  images: {
    src: string
    altVi: string
    altEn: string
    captionVi?: string
    captionEn?: string
    aspect?: string
  }[]
  layout: 'split' | 'full-bleed' | 'duo' | 'trio'
  locationVi: string
  locationEn: string
}

export interface CoupleStory {
  id: string
  slug: string
  coupleVi: string
  coupleEn: string
  dateVi: string
  dateEn: string
  locationVi: string
  locationEn: string
  categoryVi: string
  categoryEn: string
  coverImage: string
  synopsisVi: string
  synopsisEn: string
  highlightQuoteVi: string
  highlightQuoteEn: string
  pages: StoryPage[]
}

export interface PortfolioAlbum {
  id: string
  slug: string
  titleVi: string
  titleEn: string
  category: 'wedding-day' | 'pre-wedding' | 'concept' | 'destination'
  categoryLabelVi: string
  categoryLabelEn: string
  coupleVi: string
  coupleEn: string
  locationVi: string
  locationEn: string
  dateVi: string
  dateEn: string
  coverImage: string
  gallery: {
    src: string
    captionVi: string
    captionEn: string
    aspect?: string
  }[]
  storySummaryVi: string
  storySummaryEn: string
}

export interface StudioService {
  id: string
  number: string
  titleVi: string
  titleEn: string
  badgeVi: string
  badgeEn: string
  descriptionVi: string
  descriptionEn: string
  priceVi: string
  priceEn: string
  featuredImage: string
  inclusionsVi: string[]
  inclusionsEn: string[]
  deliverablesVi: string[]
  deliverablesEn: string[]
  idealForVi: string
  idealForEn: string
}

export const COUPLE_STORIES: CoupleStory[] = [
  {
    id: 'minh-ha',
    slug: 'minh-ha-an-bang',
    coupleVi: 'Minh & Hà',
    coupleEn: 'Minh & Ha',
    dateVi: 'Tháng 12, 2025',
    dateEn: 'December 2025',
    locationVi: 'Biển An Bàng, Hội An',
    locationEn: 'An Bang Beach, Hoi An',
    categoryVi: 'Pre-wedding Biển',
    categoryEn: 'Coastal Pre-wedding',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    synopsisVi: 'Một buổi chiều muộn không kịch bản, chỉ có tiếng sóng biển và những cái ôm siết trong làn gió cuối năm.',
    synopsisEn: 'An unscripted late afternoon with only the sound of surf and quiet embraces in the year-end sea breeze.',
    highlightQuoteVi: '“Chúng mình không cần một album ảnh lộng lẫy, chỉ cần khi mười năm sau nhìn lại, vẫn thấy ánh mắt của ngày hôm ấy.”',
    highlightQuoteEn: '“We didn’t want an extravagant shoot, only that ten years later, we still recognize the way we looked at each other that day.”',
    pages: [
      {
        pageNumber: 1,
        titleVi: 'Buổi chiều hẹn hò bên bờ cát An Bàng',
        titleEn: 'Late Afternoon on An Bang Sands',
        subtitleVi: 'Khởi đầu một ngày chụp không áp lực tạo dáng',
        subtitleEn: 'The beginning of a day without posed strain',
        quoteVi: '“Hà bảo thích cảm giác chân trần chạm vào cát mát sau một ngày làm việc mệt nhoài.”',
        quoteEn: '“Ha said she loves the cold damp sand on bare feet after months of city noise.”',
        contentVi: 'Chúng mình gặp Minh và Hà tại một quán cà phê nhỏ lợp mái cọ ven biển Hội An. Không có thợ trang điểm dặm phấn liên tục, không có đèn hắt sáng cồng kềnh. Buổi chụp bắt đầu như một buổi hẹn hò bình thường của hai người khi đi dạo đón gió hoàng hôn.',
        contentEn: 'We met Minh and Ha at a small palm-thatched cafe on Hoi An’s coast. No heavy makeup touch-ups, no overwhelming reflector panels. The shoot unfolded simply as an everyday seaside stroll in the twilight breeze.',
        layout: 'split',
        locationVi: 'Bờ biển An Bàng · 16:30',
        locationEn: 'An Bang Shoreline · 16:30',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
            altVi: 'Minh và Hà tựa đầu bên bờ biển',
            altEn: 'Minh and Ha resting by the shore',
            captionVi: 'Ánh nắng 16:30 phủ lên vai áo lụa mỏng một sắc vàng êm ả.',
            captionEn: 'Soft 4:30 PM sunlight draping across raw silk in golden warmth.',
          },
        ],
      },
      {
        pageNumber: 2,
        titleVi: 'Những khoảng lặng tự nhiên',
        titleEn: 'Quiet Unforced Spaces',
        subtitleVi: 'Khi máy ảnh chỉ là người quan sát thầm lặng',
        subtitleEn: 'When the camera is merely an unobtrusive watcher',
        quoteVi: '“Anh nhớ từng câu chuyện cười ngô nghê của em lúc hai đứa mới quen.”',
        quoteEn: '“I remember every silly laugh from the days we first met.”',
        contentVi: 'Nhiếp ảnh gia Wispic luôn lùi lại phía sau từ 5 đến 10 mét. Khi để cặp đôi có không gian riêng, những cử chỉ ngập tràn yêu thương sẽ tự nhiên diễn ra — cái nắm tay siết nhẹ, tiếng cười khẽ khi ngọn sóng tràn qua mắt cá chân.',
        contentEn: 'Our photographers step back 5 to 10 meters. With enough breathing room, affection unfolds organically — a reassuring squeeze of the hand, a burst of laughter as seawater rushes over cold ankles.',
        layout: 'duo',
        locationVi: 'Bãi cát thoai thoải',
        locationEn: 'Open sandy flats',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85',
            altVi: 'Minh dắt tay Hà bước dọc bãi biển',
            altEn: 'Minh guiding Ha along the shore',
            captionVi: 'Bước chân thong thả không vội vã.',
            captionEn: 'Slow, unhurried footsteps.',
          },
          {
            src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=85',
            altVi: 'Chi tiết chiếc nhẫn và bàn tay đan vào nhau',
            altEn: 'Detail of wedding band and entwined fingers',
            captionVi: 'Chiếc nhẫn mộc và cái siết tay bình yên.',
            captionEn: 'Simple ring and quiet touch.',
          },
        ],
      },
      {
        pageNumber: 3,
        titleVi: 'Khi hoàng hôn nhuộm tím mặt biển',
        titleEn: 'When Dusk Turns the Tide Violet',
        subtitleVi: 'Khoảnh khắc diệu kỳ nhất của ngày',
        subtitleEn: 'The most magical moment of dusk',
        quoteVi: '“Cảm ơn Wispic vì đã cho tụi mình một buổi chiều như được yêu lại từ đầu.”',
        quoteEn: '“Thank you Wispic for an afternoon where we fell in love all over again.”',
        contentVi: 'Chỉ vỏn vẹn 15 phút trước khi mặt trời lặn hẳn dưới chân trời, ánh sáng chuyển từ hổ phách sang tím dịu. Chúng mình chụp bằng máy phim 35mm để giữ lại trọn vẹn chất hạt mịn màng và độ tương phản tự nhiên của làn da dưới nắng xế.',
        contentEn: 'In the brief 15 minutes before the sun dips below the horizon, amber shifts into soft violet. We switched to 35mm film stock to preserve the organic grain and skin glow.',
        layout: 'full-bleed',
        locationVi: 'Đường chân trời biển Hội An',
        locationEn: 'Hoi An horizon line',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=85',
            altVi: 'Khoảnh khắc hoàng hôn ôm trọn đôi bạn',
            altEn: 'Dusk embrace between Minh and Ha',
            captionVi: 'Khoảnh khắc trước lúc hoàng hôn buông xuống hoàn toàn.',
            captionEn: 'Moments right before twilight deepens.',
          },
        ],
      },
    ],
  },
  {
    id: 'tuan-linh',
    slug: 'tuan-linh-da-lat',
    coupleVi: 'Tuấn & Linh',
    coupleEn: 'Tuan & Linh',
    dateVi: 'Tháng 11, 2025',
    dateEn: 'November 2025',
    locationVi: 'Rừng thông & Biệt thự cổ, Đà Lạt',
    locationEn: 'Pine Forest & Colonial Villa, Da Lat',
    categoryVi: 'Pre-wedding Cao Nguyên',
    categoryEn: 'Highland Pre-wedding',
    coverImage: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1600&q=85',
    synopsisVi: 'Sương sớm bảng lảng đồi thông, áo len ấm và tách trà nóng trong căn biệt thự gỗ 70 năm tuổi.',
    synopsisEn: 'Early morning mist in highland pines, warm knitwear, and hot tea in a 70-year-old timber villa.',
    highlightQuoteVi: '“Đà Lạt đối với chúng mình là chốn bình yên nhất. Wispic đã bắt trọn sự ấm áp ấy giữa tiết trời 14 độ.”',
    highlightQuoteEn: '“Da Lat is our quiet refuge. Wispic captured that exact warmth in 14-degree chill.”',
    pages: [
      {
        pageNumber: 1,
        titleVi: 'Bình minh 14 độ trên đồi cỏ hồng',
        titleEn: '14-Degree Dawn on Pink Grass Hill',
        subtitleVi: 'Hít thở không khí trong lành của cao nguyên',
        subtitleEn: 'Breathing the crisp mountain breeze',
        quoteVi: '“Hơi sương đọng trên tóc Linh, Tuấn đưa tay vuốt nhẹ rồi mỉm cười.”',
        quoteEn: '“Dew sat on Linh’s hair; Tuan brushed it away with an effortless smile.”',
        contentVi: 'Chúng mình thức dậy lúc 4:30 sáng khi Đà Lạt còn chìm trong màn sương mù dày đặc. Khi những tia nắng đầu tiên xuyên qua rặng thông già, Tuấn khoác thêm chiếc áo choàng len cho Linh. Bức ảnh đầu tiên ra đời từ chính cử chỉ săn sóc ấy.',
        contentEn: 'We woke at 4:30 AM while Da Lat was still wrapped in thick morning fog. As the first sunbeams pierced the pine boughs, Tuan draped a knit shawl over Linh. The first frame captured that spontaneous tenderness.',
        layout: 'split',
        locationVi: 'Thung lũng Lang Biang · 05:45',
        locationEn: 'Lang Biang Valley · 05:45',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=85',
            altVi: 'Tuấn và Linh giữa sương mờ đồi thông',
            altEn: 'Tuan and Linh in Da Lat pine mist',
            captionVi: 'Bình minh cao nguyên trong làn sương bạc.',
            captionEn: 'Highland sunrise through silvery mist.',
          },
        ],
      },
      {
        pageNumber: 2,
        titleVi: 'Góc hiên nhà gỗ & Chiếc đàn cũ',
        titleEn: 'Porch Corner & The Old Guitar',
        subtitleVi: 'Giai điệu thân quen của những ngày bên nhau',
        subtitleEn: 'Familiar melodies of unhurried days',
        quoteVi: '“Không cần diễn, chỉ cần hai đứa cùng ngồi nhâm nhi cà phê như ở nhà.”',
        quoteEn: '“No acting required; just sitting with coffee like home on a weekend.”',
        contentVi: 'Chuyển cảnh về căn biệt thự gỗ cổ, Linh pha ấm trà dâu tây còn Tuấn ngồi khẽ đệm đàn bản tình ca quen thuộc. Mọi khoảnh khắc diễn ra dịu êm như một thước phim điện ảnh quay chậm.',
        contentEn: 'Transitioning to the vintage wooden villa, Linh brewed strawberry tea while Tuan gently strummed an acoustic tune. Every moment moved with the graceful cadence of slow cinema.',
        layout: 'duo',
        locationVi: 'Biệt thự cổ Đà Lạt',
        locationEn: 'Heritage Da Lat Villa',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=85',
            altVi: 'Góc hiên biệt thự cổ',
            altEn: 'Old villa veranda corner',
            captionVi: 'Không gian nhuốm màu thời gian và sự an yên.',
            captionEn: 'A timeless sanctuary bathed in calm.',
          },
          {
            src: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=85',
            altVi: 'Chi tiết cuốn sổ tay và ảnh phim',
            altEn: 'Detail of notebook and film prints',
            captionVi: 'Những kỷ vật nhỏ mang theo nhiều ký ức.',
            captionEn: 'Cherished keepsakes rich with shared history.',
          },
        ],
      },
    ],
  },
  {
    id: 'duc-trang',
    slug: 'duc-trang-hoi-an',
    coupleVi: 'Đức & Trang',
    coupleEn: 'Duc & Trang',
    dateVi: 'Tháng 01, 2026',
    dateEn: 'January 2026',
    locationVi: 'Lễ cưới sân vườn, Hội An',
    locationEn: 'Courtyard Garden Wedding, Hoi An',
    categoryVi: 'Phóng sự Cưới',
    categoryEn: 'Wedding Day Documentary',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    synopsisVi: 'Một đám cưới thân mật 40 khách với nến thơm, hoa sen trắng và giọt nước mắt hạnh phúc của ba mẹ.',
    synopsisEn: 'An intimate 40-guest celebration with scented beeswax, white lotuses, and parents’ joyful tears.',
    highlightQuoteVi: '“Những giọt nước mắt lúc ba dắt tay Trang trao cho Đức là khoảnh khắc vô giá nhất cuộc đời mình.”',
    highlightQuoteEn: '“The tears when dad placed Trang’s hand in Duc’s are the most priceless treasure of our lives.”',
    pages: [
      {
        pageNumber: 1,
        titleVi: 'Buổi sáng chuẩn bị trong căn nhà cổ',
        titleEn: 'Morning Preparation in the Heritage House',
        subtitleVi: 'Sự hồi hộp dịu dàng trước giờ làm lễ',
        subtitleEn: 'Tender anticipation before the vow exchange',
        quoteVi: '“Mẹ cài chiếc trâm ngọc lên tóc Trang, dặn dò vài câu rồi nghẹn ngào.”',
        quoteEn: '“Mother placed the pearl pin in Trang’s hair, whispered a blessing, and held back tears.”',
        contentVi: 'Phóng sự cưới là thế mạnh đặc biệt của Wispic. Chúng mình không yêu cầu cô dâu chú rể phải dừng lại để chụp lại dáng chụp vừa xong. Từng ánh mắt, từng giọt nước mắt hay tiếng cười giòn giã đều được lưu lại hoàn toàn chân thật.',
        contentEn: 'Documentary wedding day coverage is our core craft. We never ask the bride or groom to pause and redo an emotional moment. Every tear, gaze, and burst of laughter is captured purely in flow.',
        layout: 'split',
        locationVi: 'Phòng cô dâu · 08:30',
        locationEn: 'Bridal Suite · 08:30',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
            altVi: 'Trang chuẩn bị áo dài cưới',
            altEn: 'Trang preparing her wedding gown',
            captionVi: 'Những giây phút tĩnh lặng trước khi khách đến.',
            captionEn: 'Quiet moments before guests arrive.',
          },
        ],
      },
      {
        pageNumber: 2,
        titleVi: 'Lời thề nguyện dưới bóng cây cổ thụ',
        titleEn: 'Vows Beneath the Ancient Banyan',
        subtitleVi: 'Chỉ có 40 người thân thiết nhất chứng kiến',
        subtitleEn: 'Witnessed by forty of their dearest loved ones',
        quoteVi: '“Đức hứa sẽ luôn là bờ vai vững chãi nhất cho Trang dù cuộc đời có sóng gió đến đâu.”',
        quoteEn: '“Duc promised to be Trang’s safest haven no matter how life twists.”',
        contentVi: 'Dưới ánh nắng vàng rọi qua tán lá râm ran, hai bạn đọc to những dòng thư tay viết cho nhau. Cả không gian như ngừng lại, chỉ còn rung động của tình yêu thuần khiết.',
        contentEn: 'Under sunlight dappling through dense leaves, they read handwritten vows aloud. The garden seemed to stand still, held by the purity of unadorned love.',
        layout: 'duo',
        locationVi: 'Khu vườn bí mật Hội An',
        locationEn: 'Secret Courtyard Hoi An',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=85',
            altVi: 'Khoảnh khắc trao lời thề nguyện',
            altEn: 'Vow exchange under the trees',
            captionVi: 'Ánh mắt rạng ngời lúc trao nhẫn cưới.',
            captionEn: 'Radiant gaze as the rings were exchanged.',
          },
          {
            src: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=85',
            altVi: 'Không gian tiệc cưới tối lung linh',
            altEn: 'Evening dinner table illuminated by candlelight',
            captionVi: 'Bàn tiệc tối ấm cúng ngập ánh nến.',
            captionEn: 'Intimate dinner bathed in candlelight.',
          },
        ],
      },
    ],
  },
]

export const PORTFOLIO_ALBUMS: PortfolioAlbum[] = [
  {
    id: 'alb-1',
    slug: 'minh-ha-hoian',
    titleVi: 'Minh & Hà · Hoàng hôn biển An Bàng',
    titleEn: 'Minh & Ha · Twilight at An Bang',
    category: 'pre-wedding',
    categoryLabelVi: 'Pre-wedding Ngoại cảnh',
    categoryLabelEn: 'Outdoor Pre-wedding',
    coupleVi: 'Minh & Hà',
    coupleEn: 'Minh & Ha',
    locationVi: 'Hội An, Quảng Nam',
    locationEn: 'Hoi An, Central Coast',
    dateVi: 'Tháng 12, 2025',
    dateEn: 'Dec 2025',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    storySummaryVi: 'Một buổi chiều muộn dịu dàng đón gió biển, không cầu kỳ trang phục, chỉ có tình yêu mộc mạc và chân thành.',
    storySummaryEn: 'A gentle late afternoon catching ocean gusts, unpretentious wardrobe, just genuine affection.',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Khoảnh khắc tựa đầu bình yên bên bờ cát',
        captionEn: 'Peaceful rest upon the sands',
      },
      {
        src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Nụ cười rạng rỡ dưới nắng chiều vàng',
        captionEn: 'Radiant smile in golden afternoon glow',
      },
      {
        src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Chi tiết nhẫn cưới và chất vải lụa tơ tằm',
        captionEn: 'Wedding band details and raw silk texture',
      },
    ],
  },
  {
    id: 'alb-2',
    slug: 'duc-trang-wedding',
    titleVi: 'Đức & Trang · Ngày cưới ngập tràn tiếng cười',
    titleEn: 'Duc & Trang · Wedding Day of Joy',
    category: 'wedding-day',
    categoryLabelVi: 'Phóng sự Ngày cưới',
    categoryLabelEn: 'Wedding Day Documentary',
    coupleVi: 'Đức & Trang',
    coupleEn: 'Duc & Trang',
    locationVi: 'Hội An Garden Estate',
    locationEn: 'Hoi An Garden Estate',
    dateVi: 'Tháng 01, 2026',
    dateEn: 'Jan 2026',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    storySummaryVi: 'Phóng sự trọn vẹn từ lúc làm lễ gia tiên buổi sáng đến tiệc tối ngoài trời lung linh dưới ánh đèn lồng.',
    storySummaryEn: 'Full day coverage from ancestral ceremonies to illuminated lantern-lit dinner.',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Lễ cưới sân vườn ấm cúng với người thân',
        captionEn: 'Intimate garden wedding ceremony',
      },
      {
        src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Ánh mắt hạnh phúc của ba mẹ trong lễ rước dâu',
        captionEn: 'Parents’ joyful gaze during the procession',
      },
      {
        src: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Bàn tiệc tối lung linh ánh nến ấm áp',
        captionEn: 'Dinner table aglow with warm candlelight',
      },
    ],
  },
  {
    id: 'alb-3',
    slug: 'tuan-linh-dalat',
    titleVi: 'Tuấn & Linh · Sương sớm và đồi thông Đà Lạt',
    titleEn: 'Tuan & Linh · Da Lat Pine Horizons',
    category: 'pre-wedding',
    categoryLabelVi: 'Pre-wedding Cao Nguyên',
    categoryLabelEn: 'Highland Pre-wedding',
    coupleVi: 'Tuấn & Linh',
    coupleEn: 'Tuan & Linh',
    locationVi: 'Đà Lạt, Lâm Đồng',
    locationEn: 'Da Lat Highlands',
    dateVi: 'Tháng 11, 2025',
    dateEn: 'Nov 2025',
    coverImage: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=85',
    storySummaryVi: 'Chuyến đi ngẫu hứng lên Đà Lạt những ngày chớm đông, những cái ôm ấm áp giữa trời se lạnh.',
    storySummaryEn: 'Spontaneous winter getaway to Da Lat, warm embraces amidst the mountain crispness.',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Rặng thông mù sương trong sớm mai',
        captionEn: 'Misty pine ridge at daybreak',
      },
      {
        src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Góc hiên gỗ quen thuộc của căn homestay',
        captionEn: 'Familiar wooden porch of the highland retreat',
      },
    ],
  },
  {
    id: 'alb-4',
    slug: 'viet-mai-concept',
    titleVi: 'Việt & Mai · Tình yêu phong cách Điện ảnh Cổ điển',
    titleEn: 'Viet & Mai · Cinematic Noir Love',
    category: 'concept',
    categoryLabelVi: 'Concept & Chân Dung Studio',
    categoryLabelEn: 'Studio Concept & Portrait',
    coupleVi: 'Việt & Mai',
    coupleEn: 'Viet & Mai',
    locationVi: 'Wispic Studio, Sài Gòn',
    locationEn: 'Wispic Studio, Saigon',
    dateVi: 'Tháng 10, 2025',
    dateEn: 'Oct 2025',
    coverImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=85',
    storySummaryVi: 'Tone màu phim cổ điển đen trắng và màu vintage thập niên 90, tự nhiên và cuốn hút.',
    storySummaryEn: 'Monochrome and 90s vintage film aesthetic, effortless and magnetic.',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Nụ cười tự nhiên không chút khiên cưỡng',
        captionEn: 'Spontaneous smile without artifice',
      },
    ],
  },
  {
    id: 'alb-5',
    slug: 'hoang-anh-destination',
    titleVi: 'Hoàng & Anh · Hôn lễ bên vách đá Ninh Bình',
    titleEn: 'Hoang & Anh · Karst Cliffs of Ninh Binh',
    category: 'destination',
    categoryLabelVi: 'Destination Wedding',
    categoryLabelEn: 'Destination Wedding',
    coupleVi: 'Hoàng & Anh',
    coupleEn: 'Hoang & Anh',
    locationVi: 'Tràng An, Ninh Bình',
    locationEn: 'Trang An, Ninh Binh',
    dateVi: 'Tháng 09, 2025',
    dateEn: 'Sep 2025',
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85',
    storySummaryVi: 'Chiếc thuyền gỗ trôi trên dòng nước ngọc bích, lời thề hẹn giữa đất trời bao la hùng vĩ.',
    storySummaryEn: 'Wooden sampan drifting along emerald waters, promises spoken beneath towering karst peaks.',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85',
        captionVi: 'Khung cảnh thiên nhiên kỳ vĩ tôn lên tình yêu đôi lứa',
        captionEn: 'Majestic natural expanse framing their devotion',
      },
    ],
  },
]

export const STUDIO_SERVICES: StudioService[] = [
  {
    id: 'pre-wedding',
    number: '01',
    titleVi: 'Gói Chụp Pre-Wedding Tự Nhiên',
    titleEn: 'Signature Natural Pre-Wedding',
    badgeVi: 'Được yêu thích nhất',
    badgeEn: 'Most Loved',
    descriptionVi: 'Dành cho các cặp đôi yêu thích phong cách chụp tự nhiên, ấm áp như một buổi hẹn hò thực thụ. Không rập khuôn tạo dáng, chụp cả ngoại cảnh lẫn studio với tone màu độc quyền của Wispic.',
    descriptionEn: 'For couples who cherish warm, authentic moments captured like a real weekend date. No rigid poses, blending outdoor scenery and studio settings with Wispic’s signature warm tone.',
    priceVi: 'Từ 15.000.000 VNĐ',
    priceEn: 'From ~600 USD',
    featuredImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    inclusionsVi: [
      '01 Ekip chuyên nghiệp (01 Nhiếp ảnh gia chính + 01 Trợ lý ánh sáng)',
      '01 Chuyên viên trang điểm & làm tóc đi theo dặm dặm suốt buổi chụp',
      '02 Trang phục cưới thiết kế cao cấp cho Cô dâu + 02 Bộ Vest cho Chú rể',
      'Xe ô tô 7 chỗ di chuyển trọn vẹn trong ngày chụp',
      'Không giới hạn số lượng ảnh chụp trong ngày',
    ],
    inclusionsEn: [
      'Dedicated team (Lead photographer + lighting assistant)',
      'Professional hair & makeup artist following on location',
      '2 designer bridal gowns + 2 bespoke suits for the groom',
      'Comfortable 7-seater transit throughout the shoot day',
      'No limits on raw frames captured',
    ],
    deliverablesVi: [
      'Toàn bộ file gốc chất lượng cao bàn giao trong 24 giờ',
      '45 – 60 ảnh chỉnh sửa màu độc quyền (Retouch tỉ mỉ)',
      '01 Album Photobook cao cấp khổ 30x30cm (30 trang giấy mỹ thuật)',
      '01 Ảnh cổng pha lê / gỗ cao cấp kích thước 60x90cm',
      '01 Slideshow ảnh cưới lồng nhạc cảm xúc',
    ],
    deliverablesEn: [
      'Complete high-res raw gallery delivered within 24 hours',
      '45–60 meticulously edited & color graded frames',
      '1 Luxury 30x30cm fine-art photobook (30 pages)',
      '1 Large format 60x90cm fine art reception canvas',
      '1 Cinematic musical photo slideshow',
    ],
    idealForVi: 'Các cặp đôi muốn có một bộ ảnh cưới nhẹ nhàng, cảm xúc, không áp lực và lưu giữ đúng tính cách của hai bạn.',
    idealForEn: 'Couples seeking an unhurried, heartfelt engagement album that reflects their true personality.',
  },
  {
    id: 'wedding-day',
    number: '02',
    titleVi: 'Phóng Sự Ngày Cưới (Wedding Day)',
    titleEn: 'Documentary Wedding Day',
    badgeVi: 'Khoảnh khắc trọn đời',
    badgeEn: 'Once in a Lifetime',
    descriptionVi: 'Ghi lại chân thật từng giọt nước mắt xúc động, ánh mắt trao nhau và nụ cười rạng rỡ của gia đình trong ngày trọng đại nhất cuộc đời bạn.',
    descriptionEn: 'Documenting the genuine tears of emotion, intimate glances, and radiant smiles of both families on your most meaningful day.',
    priceVi: 'Từ 12.000.000 VNĐ',
    priceEn: 'From ~500 USD',
    featuredImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    inclusionsVi: [
      '02 Máy chụp phóng sự bắt trọn cả góc nhà gái & nhà trai',
      'Ghi hình từ lúc chuẩn bị buổi sáng đến hết tiệc tối thân mật',
      'Bắt trọn khoảnh khắc tự nhiên, không làm gián đoạn buổi lễ',
      'Hỗ trợ chụp ảnh gia đình, bạn bè lưu niệm đầy đủ',
    ],
    inclusionsEn: [
      'Dual photographer coverage covering both bride and groom preparations',
      'Comprehensive coverage from dawn preparations through evening party',
      'Candid documentary approach without halting ceremonial flow',
      'Full family and guest portrait sessions included',
    ],
    deliverablesVi: [
      '1.000 – 1.800 file ảnh gốc chất lượng cao',
      'Toàn bộ ảnh được cân chỉnh màu sắc ấm áp, trong trẻo',
      '80 ảnh retouch chi tiết cho album gia đình',
      '01 Hộp kỷ vật gỗ khắc laser kèm 50 ảnh in lụa',
      'Tặng kèm 01 link lưu trữ trực tuyến vĩnh viễn',
    ],
    deliverablesEn: [
      '1,000–1,800 full-resolution digital frames',
      'All frames color-corrected with our warm, timeless look',
      '80 polished editorial portraits for the family archive',
      '1 Laser-engraved timber keepsake box with 50 silk prints',
      'Complimentary lifetime private cloud gallery',
    ],
    idealForVi: 'Cặp đôi trân trọng những khoảnh khắc gia đình, muốn lưu giữ cảm xúc chân thật nhất của ngày cưới.',
    idealForEn: 'Couples who treasure family emotions and want memories preserved authentically.',
  },
  {
    id: 'wedding-film',
    number: '03',
    titleVi: 'Phim Cưới Phóng Sự Cinematic 4K',
    titleEn: 'Cinematic 4K Wedding Film',
    badgeVi: 'Điện ảnh & Cảm xúc',
    badgeEn: 'Cinematic Emotion',
    descriptionVi: 'Thước phim cưới được biên tập theo phong cách điện ảnh với âm thanh thu trực tiếp lời thề nguyện, phóng vấn người thân và nhạc nền được sáng tác riêng.',
    descriptionEn: 'Cinematic wedding film crafted with ambient audio of vows, candid family voices, and tailored soundtrack.',
    priceVi: 'Từ 18.000.000 VNĐ',
    priceEn: 'From ~720 USD',
    featuredImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
    inclusionsVi: [
      '02 Quay phim chuyên nghiệp + Thiết bị gimbal, flycam 4K',
      'Micro thu âm chuyên dụng cài áo chống tạp âm cho lời thề',
      'Ghi hình trọn vẹn cả ngày lễ và tiệc mừng',
    ],
    inclusionsEn: [
      '2 professional cinematographers + 4K drone & gimbal rigs',
      'Dedicated wireless lapel audio for pristine vow recordings',
      'Full day ceremonial and reception documentation',
    ],
    deliverablesVi: [
      '01 Teaser phim ngắn 1 phút đăng tải mạng xã hội (trong 72h)',
      '01 Highlight Film 5 – 8 phút đong đầy cảm xúc',
      '01 Full documentary film 25 – 45 phút lưu trữ toàn bộ buổi lễ',
      'Bàn giao file 4K trên ổ cứng gỗ khắc tên cô dâu chú rể',
    ],
    deliverablesEn: [
      '1-minute social teaser delivered within 72 hours',
      '5–8 minute emotional cinematic highlight film',
      '25–45 minute comprehensive archival documentary film',
      'Delivered in master 4K on a personalized wooden USB drive',
    ],
    idealForVi: 'Cặp đôi muốn sống lại cảm xúc rung động của ngày cưới qua hình ảnh chuyển động và thanh âm chân thật.',
    idealForEn: 'Couples wanting to relive the voices, tears, and cheers through cinematic motion.',
  },
  {
    id: 'digital-invitations',
    number: '04',
    titleVi: 'Thiệp Cưới Online & Tương Tác Số',
    titleEn: 'Digital Wedding Invitations & Suite',
    badgeVi: 'Công nghệ & Thẩm mỹ',
    badgeEn: 'Smart & Aesthetic',
    descriptionVi: 'Trang web thiệp cưới độc bản dành riêng cho hai bạn. Khách mời mở thiệp như lật giở một tác phẩm nghệ thuật, dễ dàng xác nhận tham dự (RSVP), nghe nhạc nền và xem bản đồ chỉ đường.',
    descriptionEn: 'Bespoke wedding website designed exclusively for you. Guests open invitations like turning pages of an artbook, easily confirming attendance with RSVP, listening to your soundtrack, and navigating the venue.',
    priceVi: 'Từ 1.200.000 VNĐ',
    priceEn: 'From ~50 USD',
    featuredImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85',
    inclusionsVi: [
      'Tên miền riêng dạng ten-co-dau-chu-re.wispic.vn',
      'Không giới hạn số lượng khách mời truy cập',
      'Tích hợp nhạc nền tự phát theo danh sách yêu thích',
      'Bản đồ chỉ đường Google Maps trực quan dẫn đường 1 chạm',
      'Hộp đếm ngược ngày cưới & Album ảnh cưới lướt cảm ứng',
    ],
    inclusionsEn: [
      'Custom wedding link (e.g. bride-groom.wispic.vn)',
      'Unlimited guest access and invitations sent',
      'Embedded audio player with your favorite love songs',
      'One-tap Google Maps venue navigation',
      'Wedding countdown & interactive touch gallery',
    ],
    deliverablesVi: [
      'Hệ thống quản lý RSVP thông minh (báo cáo khách tham dự qua Zalo/Email)',
      'Khung gửi lời chúc mừng trực tiếp từ khách lưu vào sổ lưu niệm số',
      'Mã QR thông minh để in lên thiệp giấy truyền thống',
      'Giao diện tương thích hoàn hảo trên iPhone, Android và máy tính',
    ],
    deliverablesEn: [
      'Smart RSVP guest dashboard with real-time notifications',
      'Interactive digital guestbook for warm blessings',
      'High-resolution QR code ready for physical stationery',
      'Flawless responsive experience across iOS, Android & Desktop',
    ],
    idealForVi: 'Các cặp đôi hiện đại muốn gửi thiệp cưới tinh tế tới bạn bè ở xa, tiện lợi và tiết kiệm thời gian.',
    idealForEn: 'Modern couples sharing refined invitations with distant friends with seamless ease.',
  },
]
