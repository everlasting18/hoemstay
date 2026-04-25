# Windy Hill Admin

React admin app tách riêng khỏi Astro frontend public, dựng bằng `Vite + React + Tailwind + shadcn/ui`.

## Env

Tạo `admin/.env`:

```bash
VITE_POCKETBASE_URL=http://127.0.0.1:8090
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
VITE_CLOUDINARY_IMAGE_TRANSFORM=f_webp,q_auto
```

`VITE_CLOUDINARY_UPLOAD_PRESET` phải là unsigned upload preset trong Cloudinary. Không cần backend riêng để ký upload.
`VITE_CLOUDINARY_IMAGE_TRANSFORM` mặc định là `f_webp,q_auto`, nên URL lưu vào PocketBase sẽ là URL delivery WebP.

## Commands

```bash
cd admin
npm install
npm run dev
npm run check
npm run build
```

## Scope hiện tại

- Đăng nhập bằng PocketBase superuser
- CRUD cho `settings`, `hero_slides`, `rooms`, `services`, `gallery`, `reviews`
- `amenities` và `featured_images` được bọc UI nhiều dòng, nhưng khi lưu vẫn convert về JSON string để khớp schema MVP hiện tại
- field ảnh có nút upload lên Cloudinary, URL sẽ tự đổ vào form
- layout dùng `shadcn/ui`, có sidebar desktop và sheet mobile responsive
