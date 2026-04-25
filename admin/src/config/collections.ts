import type { AdminSection } from "../lib/types";

export const adminSections: AdminSection[] = [
  {
    key: "settings",
    title: "Thiết lập Site",
    description: "Thông tin thương hiệu, liên hệ, hero metadata và map.",
    singleton: true,
    fields: [
      { key: "site_name", label: "Tên site", type: "text", required: true },
      { key: "short_name", label: "Tên ngắn", type: "text", required: true },
      { key: "tagline", label: "Tagline", type: "text", required: true },
      { key: "description", label: "Mô tả SEO", type: "textarea", rows: 3, required: true },
      { key: "location", label: "Địa điểm", type: "text", required: true },
      { key: "hero_title", label: "Hero title", type: "text", required: true },
      { key: "hero_subtitle", label: "Hero subtitle", type: "text", required: true },
      {
        key: "hero_image",
        label: "Hero image URL",
        type: "imageUrl",
        required: true,
        preview: "image",
        supportsUpload: true,
        uploadFolder: "/windy-hill/settings"
      },
      { key: "phone_display", label: "Số hiển thị", type: "text", required: true },
      { key: "phone_href", label: "Link gọi", type: "text", required: true },
      { key: "zalo_url", label: "Zalo URL", type: "url", required: true },
      { key: "facebook_url", label: "Facebook URL", type: "url", required: true },
      { key: "email", label: "Email", type: "text", required: true },
      { key: "map_embed", label: "Map embed URL", type: "textarea", rows: 3, required: true }
    ]
  },
  {
    key: "hero_slides",
    title: "Hero Slides",
    description: "Ảnh hero và caption dùng ở đầu trang.",
    sort: "order",
    primaryField: "title",
    fields: [
      { key: "title", label: "Tiêu đề", type: "text", required: true },
      {
        key: "image",
        label: "Image URL",
        type: "imageUrl",
        required: true,
        preview: "image",
        supportsUpload: true,
        uploadFolder: "/windy-hill/hero-slides"
      },
      { key: "order", label: "Thứ tự", type: "number" }
    ]
  },
  {
    key: "rooms",
    title: "Phòng nghỉ",
    description: "Quản lý card phòng, chi tiết phòng và gallery phòng.",
    sort: "order",
    primaryField: "name",
    slugFrom: "name",
    fields: [
      { key: "slug", label: "Slug", type: "text", required: true },
      { key: "name", label: "Tên phòng", type: "text", required: true },
      { key: "type", label: "Loại phòng", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea", rows: 3, required: true },
      { key: "description", label: "Mô tả", type: "richtext", required: true, uploadFolder: "/windy-hill/rooms" },
      { key: "guests", label: "Sức chứa", type: "text", required: true },
      { key: "area", label: "Diện tích", type: "text", required: true },
      { key: "view", label: "View", type: "text", required: true },
      { key: "highlight", label: "Điểm nhấn", type: "text", required: true },
      {
        key: "amenities",
        label: "Tiện nghi",
        type: "linesToJson",
        rows: 6,
        required: true,
        description: "Mỗi dòng là một tiện nghi. Khi lưu sẽ tự chuyển thành JSON string."
      },
      {
        key: "featured_images",
        label: "Ảnh phòng",
        type: "linesToJson",
        rows: 6,
        required: true,
        preview: "image-list",
        supportsUpload: true,
        uploadFolder: "/windy-hill/rooms",
        description: "Mỗi dòng là một Cloudinary URL. Khi lưu sẽ tự chuyển thành JSON string."
      },
      { key: "order", label: "Thứ tự", type: "number" }
    ]
  },
  {
    key: "services",
    title: "Dịch vụ",
    description: "Các dịch vụ hiển thị ở homepage.",
    sort: "order",
    primaryField: "name",
    fields: [
      { key: "name", label: "Tên dịch vụ", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea", rows: 3, required: true },
      { key: "description", label: "Mô tả", type: "richtext", required: true, uploadFolder: "/windy-hill/services" },
      { key: "timing", label: "Khung giờ", type: "text", required: true },
      {
        key: "image",
        label: "Image URL",
        type: "imageUrl",
        required: true,
        preview: "image",
        supportsUpload: true,
        uploadFolder: "/windy-hill/services"
      },
      { key: "order", label: "Thứ tự", type: "number" }
    ]
  },
  {
    key: "gallery",
    title: "Gallery",
    description: "Ảnh thực tế và category dùng cho gallery section.",
    sort: "order",
    primaryField: "title",
    fields: [
      { key: "title", label: "Tiêu đề", type: "text", required: true },
      { key: "caption", label: "Caption", type: "textarea", rows: 3, required: true },
      {
        key: "image",
        label: "Image URL",
        type: "imageUrl",
        required: true,
        preview: "image",
        supportsUpload: true,
        uploadFolder: "/windy-hill/gallery"
      },
      {
        key: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["canh-quan", "luu-tru", "trai-nghiem", "check-in"]
      },
      { key: "order", label: "Thứ tự", type: "number" }
    ]
  },
  {
    key: "reviews",
    title: "Reviews",
    description: "Review khách cũ hiển thị ở homepage.",
    sort: "-created",
    primaryField: "name",
    fields: [
      { key: "name", label: "Tên khách", type: "text", required: true },
      { key: "origin", label: "Khu vực", type: "text", required: true },
      { key: "quote", label: "Nội dung", type: "textarea", rows: 4, required: true },
      { key: "is_featured", label: "Nổi bật", type: "checkbox" }
    ]
  }
];
