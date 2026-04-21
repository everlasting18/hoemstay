// Replace placeholder contacts, brand name, and local image files here before launch.

export type NavItem = {
  href: string;
  label: string;
};

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
  images: string[];
  media?: RoomMedia[];
};

export type RoomMedia = {
  type: "image" | "video";
  src: string;
  poster?: string;
  title?: string;
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
};

export type GalleryCollection = {
  id: string;
  title: string;
  intro: string;
  items: GalleryItem[];
};

export type Review = {
  name: string;
  origin: string;
  quote: string;
};

export type ItineraryStop = {
  name: string;
  detail: string;
  x: number;
  y: number;
  tone: "olive" | "accent" | "sage";
};

export type ItineraryDay = {
  title: string;
  summary: string;
  spots: string[];
};

const triTonImages = {
  heroMain: "/images/views/view.jpg",
  heroView: "/images/views/view1.jpg",
  heroContact: "/images/views/view2.jpg",
  sceneLake: "/images/views/view.jpg",
  sceneRoad: "/images/views/view1.jpg",
  sceneSunset: "/images/views/view2.jpg",
  stayBungalowMain: "/images/tri-ton/stay-bungalow-main.jpg",
  stayBungalowDetail: "/images/tri-ton/stay-bungalow-detail.jpg",
  stayFamilyMain: "/images/tri-ton/stay-family-main.jpg",
  stayFamilyDetail: "/images/tri-ton/stay-family-detail.jpg",
  stayCabinMain: "/images/tri-ton/stay-cabin-main.jpg",
  stayCabinDetail: "/images/tri-ton/stay-cabin-detail.jpg",
  serviceShuttle: "/images/views/view1.jpg",
  serviceLake: "/images/views/view.jpg",
  serviceFood: "/images/views/caphe.jpg",
  serviceCamp: "/images/views/soda.jpg",
  serviceTour: "/images/views/view2.jpg",
  detailRest: "/images/views/caphe.jpg",
  detailOutdoor: "/images/views/soda.jpg",
  detailSignage: "/images/views/view1.jpg"
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
  heroImage: triTonImages.heroMain,
  heroStack: [
    {
      title: "Cảnh quan mở trang",
      text: "Khách vừa vào là thấy hồ, núi, nắng chiều và không khí của vùng Bảy Núi.",
      image: triTonImages.heroView
    },
    {
      title: "Liên hệ chốt nhanh",
      text: "Zalo nổi, hotline rõ và form nhẹ để khách hỏi tour, vé tham quan hoặc dịch vụ ngay.",
      image: triTonImages.heroContact
    }
  ],
  homeStats: [
    { value: "01", label: "landing page rõ ràng" },
    { value: "Windy Hill", label: "thương hiệu tại An Giang" },
    { value: "Dịch vụ", label: "chốt nhanh qua chat" }
  ],
  contact: {
    phoneDisplay: "090 123 4567",
    phoneHref: "tel:+84901234567",
    zalo: "https://zalo.me/84901234567",
    facebook: "https://facebook.com/khudulichtriton",
    email: "hello@khudulichtriton.vn",
    mapEmbed: "https://www.google.com/maps?q=Tri%20Ton%2C%20An%20Giang&z=12&output=embed"
  }
} as const;

export const itineraryBoard: {
  label: string;
  title: string;
  intro: string;
  mapTitle: string;
  mapIntro: string;
  mapStops: ItineraryStop[];
  days: ItineraryDay[];
  highlights: string[];
  tips: string[];
} = {
  label: "Lịch trình gợi ý",
  title: "Khám phá Tri Tôn theo nhịp riêng – hồ, đồi, suối và hàng thốt nốt xanh ngút",
  intro:
    "Chỉ cần 2 ngày 1 đêm, bạn có thể ghé đủ các điểm đặc trưng nhất của vùng Bảy Núi: mặt hồ sáng sớm, chùa trên đồi cao, cánh đồng thốt nốt và suối mát cuối hành trình.",
  mapTitle: "Hành trình 2 ngày ở Tri Tôn",
  mapIntro: "Bản đồ gợi ý để khách hình dung nhanh nhịp tham quan hồ, chùa, suối và hàng thốt nốt.",
  mapStops: [
    {
      name: "Hồ Soài So",
      detail: "Mở ngày bằng mặt hồ rộng, dễ chụp ảnh sáng sớm.",
      x: 18,
      y: 32,
      tone: "olive"
    },
    {
      name: "Chùa Tà Pạ",
      detail: "Điểm nhìn cao, hợp ghé sau khi rời khu hồ.",
      x: 38,
      y: 20,
      tone: "accent"
    },
    {
      name: "Cánh đồng thốt nốt",
      detail: "Khung cảnh rất Tri Tôn, hợp buổi chiều và sunset.",
      x: 62,
      y: 44,
      tone: "sage"
    },
    {
      name: "Suối Tà Lọt",
      detail: "Không gian xanh, hợp cho ngày 2 nhẹ và mát hơn.",
      x: 52,
      y: 68,
      tone: "olive"
    },
    {
      name: "Hồ Ô Tà Sóc",
      detail: "Kết lại hành trình bằng cảnh nước và đồi thoáng.",
      x: 82,
      y: 58,
      tone: "accent"
    }
  ],
  days: [
    {
      title: "Ngày 1: hồ, đồi và góc nhìn cao",
      summary: "Ưu tiên cảnh đẹp dễ wow khách ngay từ đầu và giữ nhịp ảnh thật sáng, thật thoáng.",
      spots: ["Hồ Soài So", "Chùa Tà Pạ", "Check-in đồi cao", "Ăn trưa món địa phương"]
    },
    {
      title: "Ngày 2: thiên nhiên và chất địa phương",
      summary: "Đi chậm hơn, nhiều cây xanh hơn và chốt cảm giác Bảy Núi rõ hơn trước khi về.",
      spots: ["Suối Tà Lọt", "Cánh đồng thốt nốt", "Hồ Ô Tà Sóc", "Mua đặc sản địa phương"]
    }
  ],
  highlights: [
    "Ảnh hồ và núi mở đầu",
    "Một điểm cao để lấy toàn cảnh",
    "Một nhịp thiên nhiên mát hơn cho ngày 2",
    "Một điểm ăn uống đậm chất địa phương"
  ],
  tips: [
    "Đi chiều muộn để ảnh đẹp hơn và không quá gắt nắng.",
    "Trang phục sáng màu sẽ hợp cảnh hồ, đồng và đá núi.",
    "Nên để số điện thoại và Zalo nổi ngay cạnh block này để khách hỏi lịch liền."
  ]
};

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
    images: [
      triTonImages.stayBungalowMain,
      triTonImages.stayBungalowDetail,
      triTonImages.sceneSunset
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
    images: [
      triTonImages.stayFamilyMain,
      triTonImages.stayFamilyDetail,
      triTonImages.detailOutdoor
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
    images: [
      triTonImages.stayCabinMain,
      triTonImages.stayCabinDetail,
      triTonImages.sceneRoad
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
    image: triTonImages.serviceShuttle
  },
  {
    name: "Chèo sup & đạp vịt",
    summary: "Hoạt động nhẹ trên hồ, hợp khách trẻ và nhóm bạn thích vừa chơi vừa chụp ảnh.",
    description:
      "Đây là dịch vụ lên hình tốt, dễ bán và tạo cảm giác khu du lịch có trải nghiệm thật chứ không chỉ có cảnh để ngắm.",
    timing: "07:00 - 17:30",
    image: triTonImages.serviceLake
  },
  {
    name: "Ẩm thực Bảy Núi",
    summary: "Khu ăn uống phục vụ món địa phương, set gia đình và bữa trưa đoàn.",
    description:
      "Nội dung dịch vụ nên nhấn vào sự đặc trưng vùng Tri Tôn: món địa phương dễ nhớ, trình bày sạch và có không gian ngồi thoáng cho nhóm khách lớn.",
    timing: "10:00 - 21:00",
    image: triTonImages.serviceFood
  },
  {
    name: "Cắm trại & lửa tối",
    summary: "Khu cỏ rộng cho nhóm bạn, lớp học, team building hoặc khách đi gia đình đông người.",
    description:
      "Hoạt động này giúp khu du lịch có thêm lý do để khách ở lại lâu hơn, nhất là các nhóm muốn kết hợp vui chơi ban ngày và sinh hoạt tối.",
    timing: "17:00 - 22:00",
    image: triTonImages.serviceCamp
  },
  {
    name: "Tour check-in Tri Tôn",
    summary: "Gợi ý hành trình ảnh đẹp quanh hồ, đồi, hàng thốt nốt và các góc sunset nổi bật.",
    description:
      "Phù hợp cho khách đi theo cặp hoặc nhóm nhỏ, muốn được chỉ sẵn các điểm chụp đẹp để không mất thời gian tự tìm góc.",
    timing: "Đặt trước 1 ngày",
    image: triTonImages.serviceTour
  }
];

export const galleryCollections: GalleryCollection[] = [
  {
    id: "canh-quan",
    title: "Cảnh quan Tri Tôn",
    intro: "Không gian thiên nhiên rộng mở với hồ nước xanh, đồi núi trập trùng và những buổi hoàng hôn tuyệt đẹp đặc trưng của vùng Bảy Núi An Giang.",
    items: [
      {
        title: "Mặt hồ buổi sáng",
        caption: "Mặt hồ phẳng lặng, trong xanh – địa điểm lý tưởng để thư giãn và chụp ảnh buổi sáng.",
        image: triTonImages.sceneLake
      },
      {
        title: "Đường dạo nội khu",
        caption: "Lối đi nội khu thoáng rộng, xanh mát quanh năm, thuận tiện cho xe điện và đi bộ tham quan.",
        image: triTonImages.sceneRoad
      },
      {
        title: "Hoàng hôn trên đồi",
        caption: "Hoàng hôn trên đồi Tri Tôn – khoảnh khắc vàng mà du khách không muốn bỏ lỡ.",
        image: triTonImages.sceneSunset
      }
    ]
  },
  {
    id: "luu-tru",
    title: "Khu nghỉ & lưu trú",
    intro: "Không gian lưu trú sạch sẽ, thoáng mát với view đẹp – được thiết kế để bạn nghỉ ngơi thật sự thoải mái.",
    items: [
      {
        title: "Bungalow view hồ",
        caption: "Phòng bungalow view hồ thoáng sáng, thiết kế mộc mạc hài hòa với cảnh quan thiên nhiên.",
        image: triTonImages.stayBungalowMain
      },
      {
        title: "Nhà sàn gia đình",
        caption: "Nhà sàn rộng rãi với sân chung, phù hợp cho gia đình và nhóm bạn.",
        image: triTonImages.stayFamilyMain
      },
      {
        title: "Ban công ngắm cảnh",
        caption: "Ban công cabin nhìn toàn cảnh đồi núi – nơi lý tưởng để đón bình minh và hoàng hôn.",
        image: triTonImages.stayCabinDetail
      }
    ]
  },
  {
    id: "trai-nghiem",
    title: "Trải nghiệm & dịch vụ",
    intro: "Xe điện tham quan, chèo SUP, ẩm thực địa phương, cắm trại và tour check-in – mỗi trải nghiệm đều có điểm nhấn riêng biệt.",
    items: [
      {
        title: "Khu hoạt động ngoài trời",
        caption: "Khu hoạt động ngoài trời rộng rãi, lý tưởng cho cắm trại và sinh hoạt nhóm ban đêm.",
        image: triTonImages.serviceCamp
      },
      {
        title: "Trải nghiệm trên hồ",
        caption: "Chèo SUP và đạp vịt trên mặt hồ – trải nghiệm nhẹ nhàng, thú vị và lên hình đẹp.",
        image: triTonImages.serviceLake
      },
      {
        title: "Khu ẩm thực địa phương",
        caption: "Ẩm thực Bảy Núi đậm đà hương vị địa phương – đặc sản khó tìm ở nơi khác.",
        image: triTonImages.serviceFood
      }
    ]
  },
  {
    id: "check-in",
    title: "Góc check-in & chi tiết",
    intro: "Từng góc nhỏ trong khu được chăm chút tỉ mỉ – những chi tiết tạo nên trải nghiệm đáng nhớ.",
    items: [
      {
        title: "Góc nghỉ chân",
        caption: "Góc nghỉ chân xanh mát, thiết kế hài hòa với khung cảnh thiên nhiên xung quanh.",
        image: triTonImages.detailRest
      },
      {
        title: "Khu bàn ghế ngoài trời",
        caption: "Không gian ngoài trời thoáng đãng với bàn ghế gỗ mộc – nơi lý tưởng để thư giãn buổi chiều.",
        image: triTonImages.detailOutdoor
      },
      {
        title: "Chi tiết nhận diện",
        caption: "Biển hiệu và lối đi được thiết kế chỉn chu, tạo ấn tượng ngay từ lần đầu đặt chân vào khu.",
        image: triTonImages.detailSignage
      }
    ]
  }
];

export const reviews: Review[] = [
  {
    name: "Ngọc Diễm",
    origin: "Long Xuyên",
    quote:
      "Cảnh quan Tri Tôn đẹp và hoang sơ, không thua gì ảnh trên mạng. Đặc biệt là hoàng hôn trên đồi – mình chụp được rất nhiều ảnh đẹp trong buổi chiều đó."
  },
  {
    name: "Phú & Gia đình",
    origin: "Cần Thơ",
    quote:
      "Gia đình mình đi 4 người, 2 ngày 1 đêm. Xe điện nội khu tiện lắm, đồ ăn ngon đúng chất địa phương. Bọn trẻ thích mê sup trên hồ, đòi đi lại lần thứ hai."
  },
  {
    name: "Thảo Vy",
    origin: "TP.HCM",
    quote:
      "Lần đầu đến Tri Tôn mà cảm giác như đã quen chỗ rồi. Nhân viên nhiệt tình, cabin view đồi rất đẹp và yên tĩnh – đúng thứ mình cần sau tuần làm việc mệt."
  }
];
