// Replace placeholder contacts, brand name, and local image files here before launch.

export type NavItem = {
  href: string;
  label: string;
};

export type MediaItem =
  | { type: "image"; src: string; title?: string }
  | { type: "video"; src: string; poster?: string; title?: string };

export type Room = {
  slug: string;
  name: string;
  type: string;
  summary: string;
  description: string;
  guests: string;
  area: string;
  view: string;
  highlight: string;
  amenities: string[];
  media: MediaItem[];
};

export type Service = {
  name: string;
  summary: string;
  description: string;
  timing: string;
  image: string;
};

export type GalleryItem = {
  title: string;
  caption: string;
  image: string;
  category: "canh-quan" | "luu-tru" | "trai-nghiem" | "check-in";
};

export type Review = {
  name: string;
  origin: string;
  quote: string;
  isFeatured: boolean;
};

const imagePaths = {
  hero: "/images/views/view.jpg",
  viewLake: "/images/views/view.jpg",
  viewRoad: "/images/views/view1.jpg",
  viewSunset: "/images/views/view2.jpg",
  bungalow: [
    "/images/tri-ton/stay-bungalow-main.jpg",
    "/images/tri-ton/stay-bungalow-detail.jpg"
  ],
  family: [
    "/images/tri-ton/stay-family-main.jpg",
    "/images/tri-ton/stay-family-detail.jpg"
  ],
  cabin: [
    "/images/tri-ton/stay-cabin-main.jpg",
    "/images/tri-ton/stay-cabin-detail.jpg"
  ],
  shuttle: "/images/views/view1.jpg",
  sup: "/images/views/view.jpg",
  food: "/images/views/caphe.jpg",
  camp: "/images/views/soda.jpg",
  tour: "/images/views/view2.jpg",
  rest: "/images/views/caphe.jpg",
  outdoor: "/images/views/soda.jpg",
  signage: "/images/views/view1.jpg"
} as const;

export const navigation: NavItem[] = [
  { href: "/#dich-vu", label: "Dịch vụ" },
  { href: "/#phong-nghi", label: "Phòng nghỉ" },
  { href: "/#hinh-anh", label: "Hình ảnh" },
  { href: "/#lien-he", label: "Liên hệ" }
];

export const siteMeta = {
  name: "Windy Hill",
  shortName: "Windy Hill",
  tagline: "HomeStay",
  description:
    "Landing page dịch vụ Windy Hill tại Tri Tôn, An Giang: cảnh đẹp, dịch vụ trải nghiệm và CTA liên hệ nhanh qua Zalo.",
  location: "Tri Tôn, An Giang",
  heroImage: imagePaths.hero,
  contact: {
    phoneDisplay: "090 123 4567",
    phoneHref: "tel:+84901234567",
    zalo: "https://zalo.me/84901234567",
    facebook: "https://facebook.com/khudulichtriton",
    email: "hello@khudulichtriton.vn",
    mapEmbed: "https://www.google.com/maps?q=Tri%20Ton%2C%20An%20Giang&z=12&output=embed"
  }
} as const;

export type HeroSlide = {
  image: string;
  title: string;
};

export const hero = {
  title: "Windy Hill HomeStay",
  subtitle: "Trải nghiệm Tri Tôn",
  slides: [
    { image: imagePaths.hero, title: "Mặt hồ buổi sáng" },
    { image: imagePaths.viewLake, title: "Cảnh đẹp Bảy Núi" },
    { image: imagePaths.viewSunset, title: "Hoàng hôn trên đồi" },
    { image: imagePaths.viewRoad, title: "Đường dạo nội khu" },
    { image: imagePaths.bungalow[0], title: "Bungalow ven hồ" }
  ] as HeroSlide[]
} as const;

export const rooms: Room[] = [
  {
    slug: "bungalow-ven-ho",
    name: "Bungalow Ven Hồ",
    type: "Khu nghỉ đôi",
    summary: "Phòng nhỏ nhìn ra mặt nước và đồi xa, hợp khách đi đôi muốn ở yên và chụp ảnh đẹp.",
    description:
      "Không gian dùng bảng màu sáng, gỗ mộc và cửa kính lớn để bắt được nắng chiều Tri Tôn. Cảm giác ở đây nhẹ, thoáng và hợp với kiểu khách đi nghỉ ngắn ngày kết hợp tham quan.",
    guests: "2 khách",
    area: "30 m²",
    view: "View hồ & núi",
    highlight: "Hiên ngắm hoàng hôn",
    amenities: [
      "Giường queen bed",
      "Điều hòa & quạt trần",
      "Bàn trà ngoài hiên",
      "Phòng tắm riêng",
      "Nước suối & khăn sẵn",
      "Xe điện đón nội khu"
    ],
    media: [
      { type: "image", src: imagePaths.bungalow[0], title: "Bungalow view hồ" },
      { type: "image", src: imagePaths.bungalow[1] },
      { type: "image", src: imagePaths.viewSunset, title: "Hoàng hôn trên hồ" }
    ]
  },
  {
    slug: "nha-san-thot-not",
    name: "Nhà Sàn Thốt Nốt",
    type: "Khu nghỉ gia đình",
    summary: "Nhà sàn thoáng rộng cho gia đình hoặc nhóm nhỏ, nhìn ra vườn và lối đi nội khu.",
    description:
      "Mẫu lưu trú này phù hợp với khách đi theo nhóm, cần chỗ nghỉ sạch, thoải mái và gần các điểm check-in trong khu du lịch. Thiết kế ưu tiên sự mộc mạc và cảm giác gần cảnh quan miền Tây hơn là kiểu resort quá kiểu cách.",
    guests: "4 khách",
    area: "42 m²",
    view: "Vườn thốt nốt",
    highlight: "Sân ngồi sinh hoạt chung",
    amenities: [
      "2 giường đôi",
      "Khu ngồi uống trà",
      "Máy nước nóng",
      "Tủ lạnh mini",
      "Bàn ăn nhỏ",
      "Bãi đỗ xe gần phòng"
    ],
    media: [
      { type: "image", src: imagePaths.family[0], title: "Nhà sàn gia đình" },
      { type: "image", src: imagePaths.family[1] },
      { type: "image", src: imagePaths.outdoor }
    ]
  },
  {
    slug: "cabin-doi-cao",
    name: "Cabin Đồi Cao",
    type: "Cabin ngắm cảnh",
    summary: "Cabin riêng cho khách thích góc nhìn rộng, yên và lên hình đẹp vào sáng sớm hoặc chiều muộn.",
    description:
      "Cabin đặt ở vị trí cao hơn mặt bằng chung, phù hợp với khách thích ngắm cảnh, săn nắng đẹp và ở gần khu trải nghiệm ngoài trời. Đây là lựa chọn hợp với cặp đôi hoặc nhóm bạn nhỏ muốn ở tiện nhưng vẫn có chất riêng.",
    guests: "2 - 3 khách",
    area: "34 m²",
    view: "Đồi & ruộng xa",
    highlight: "Ban công nhìn toàn cảnh",
    amenities: [
      "Giường king bed",
      "Sofa bed phụ",
      "Cửa kính lớn",
      "Bộ bàn ghế balcony",
      "Điểm đón xe điện gần cabin",
      "Combo ăn sáng nội khu"
    ],
    media: [
      { type: "image", src: imagePaths.cabin[0], title: "Cabin view đồi" },
      { type: "image", src: imagePaths.cabin[1], title: "Ban công ngắm cảnh" },
      { type: "image", src: imagePaths.viewRoad }
    ]
  }
];

export const services: Service[] = [
  {
    name: "Xe điện tham quan nội khu",
    summary: "Di chuyển nhẹ nhàng qua hồ, khu check-in, vườn cây và điểm ngắm cảnh.",
    description:
      "Phù hợp cho gia đình có trẻ nhỏ hoặc khách đi đông, muốn tham quan trọn khu du lịch mà không phải đi bộ quá nhiều trong nắng.",
    timing: "08:00 - 18:00",
    image: imagePaths.shuttle
  },
  {
    name: "Chèo sup & đạp vịt",
    summary: "Hoạt động nhẹ trên hồ, hợp khách trẻ và nhóm bạn thích vừa chơi vừa chụp ảnh.",
    description:
      "Đây là dịch vụ lên hình tốt, dễ bán và tạo cảm giác khu du lịch có trải nghiệm thật chứ không chỉ có cảnh để ngắm.",
    timing: "07:00 - 17:30",
    image: imagePaths.sup
  },
  {
    name: "Ẩm thực Bảy Núi",
    summary: "Khu ăn uống phục vụ món địa phương, set gia đình và bữa trưa đoàn.",
    description:
      "Nội dung dịch vụ nên nhấn vào sự đặc trưng vùng Tri Tôn: món địa phương dễ nhớ, trình bày sạch và có không gian ngồi thoáng cho nhóm khách lớn.",
    timing: "10:00 - 21:00",
    image: imagePaths.food
  },
  {
    name: "Cắm trại & lửa tối",
    summary: "Khu cỏ rộng cho nhóm bạn, lớp học, team building hoặc khách đi gia đình đông người.",
    description:
      "Hoạt động này giúp khu du lịch có thêm lý do để khách ở lại lâu hơn, nhất là các nhóm muốn kết hợp vui chơi ban ngày và sinh hoạt tối.",
    timing: "17:00 - 22:00",
    image: imagePaths.camp
  },
  {
    name: "Tour check-in Tri Tôn",
    summary: "Gợi ý hành trình ảnh đẹp quanh hồ, đồi, hàng thốt nốt và các góc sunset nổi bật.",
    description:
      "Phù hợp cho khách đi theo cặp hoặc nhóm nhỏ, muốn được chỉ sẵn các điểm chụp đẹp để không mất thời gian tự tìm góc.",
    timing: "Đặt trước 1 ngày",
    image: imagePaths.tour
  }
];

export const gallery: GalleryItem[] = [
  {
    title: "Mặt hồ buổi sáng",
    caption: "Mặt hồ phẳng lặng, trong xanh – địa điểm lý tưởng để thư giãn và chụp ảnh buổi sáng.",
    image: imagePaths.viewLake,
    category: "canh-quan"
  },
  {
    title: "Đường dạo nội khu",
    caption: "Lối đi nội khu thoáng rộng, xanh mát quanh năm, thuận tiện cho xe điện và đi bộ tham quan.",
    image: imagePaths.viewRoad,
    category: "canh-quan"
  },
  {
    title: "Hoàng hôn trên đồi",
    caption: "Hoàng hôn trên đồi Tri Tôn – khoảnh khắc vàng mà du khách không muốn bỏ lỡ.",
    image: imagePaths.viewSunset,
    category: "canh-quan"
  },
  {
    title: "Bungalow view hồ",
    caption: "Phòng bungalow view hồ thoáng sáng, thiết kế mộc mạc hài hòa với cảnh quan thiên nhiên.",
    image: imagePaths.bungalow[0],
    category: "luu-tru"
  },
  {
    title: "Nhà sàn gia đình",
    caption: "Nhà sàn rộng rãi với sân chung, phù hợp cho gia đình và nhóm bạn.",
    image: imagePaths.family[0],
    category: "luu-tru"
  },
  {
    title: "Ban công ngắm cảnh",
    caption: "Ban công cabin nhìn toàn cảnh đồi núi – nơi lý tưởng để đón bình minh và hoàng hôn.",
    image: imagePaths.cabin[1],
    category: "luu-tru"
  },
  {
    title: "Khu hoạt động ngoài trời",
    caption: "Khu hoạt động ngoài trời rộng rãi, lý tưởng cho cắm trại và sinh hoạt nhóm ban đêm.",
    image: imagePaths.camp,
    category: "trai-nghiem"
  },
  {
    title: "Trải nghiệm trên hồ",
    caption: "Chèo SUP và đạp vịt trên mặt hồ – trải nghiệm nhẹ nhàng, thú vị và lên hình đẹp.",
    image: imagePaths.sup,
    category: "trai-nghiem"
  },
  {
    title: "Khu ẩm thực địa phương",
    caption: "Ẩm thực Bảy Núi đậm đà hương vị địa phương – đặc sản khó tìm ở nơi khác.",
    image: imagePaths.food,
    category: "trai-nghiem"
  },
  {
    title: "Góc nghỉ chân",
    caption: "Góc nghỉ chân xanh mát, thiết kế hài hòa với khung cảnh thiên nhiên xung quanh.",
    image: imagePaths.rest,
    category: "check-in"
  },
  {
    title: "Khu bàn ghế ngoài trời",
    caption: "Không gian ngoài trời thoáng đãng với bàn ghế gỗ mộc – nơi lý tưởng để thư giãn buổi chiều.",
    image: imagePaths.outdoor,
    category: "check-in"
  },
  {
    title: "Chi tiết nhận diện",
    caption: "Biển hiệu và lối đi được thiết kế chỉn chu, tạo ấn tượng ngay từ lần đầu đặt chân vào khu.",
    image: imagePaths.signage,
    category: "check-in"
  }
];

export const reviews: Review[] = [
  {
    name: "Ngọc Diễm",
    origin: "Long Xuyên",
    isFeatured: true,
    quote:
      "Cảnh quan Tri Tôn đẹp và hoang sơ, không thua gì ảnh trên mạng. Đặc biệt là hoàng hôn trên đồi – mình chụp được rất nhiều ảnh đẹp trong buổi chiều đó."
  },
  {
    name: "Phú & Gia đình",
    origin: "Cần Thơ",
    isFeatured: false,
    quote:
      "Gia đình mình đi 4 người, 2 ngày 1 đêm. Xe điện nội khu tiện lắm, đồ ăn ngon đúng chất địa phương. Bọn trẻ thích mê sup trên hồ, đòi đi lại lần thứ hai."
  },
  {
    name: "Thảo Vy",
    origin: "TP.HCM",
    isFeatured: false,
    quote:
      "Lần đầu đến Tri Tôn mà cảm giác như đã quen chỗ rồi. Nhân viên nhiệt tình, cabin view đồi rất đẹp và yên tĩnh – đúng thứ mình cần sau tuần làm việc mệt."
  }
];
