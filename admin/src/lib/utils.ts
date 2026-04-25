import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Chuyển tiếng Việt có dấu → slug ASCII (vd: "Phòng Đôi View Núi" → "phong-doi-view-nui")
export function toSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tổ hợp
    .replace(/đ/gi, "d")             // đ → d
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // chỉ giữ chữ cái, số, space, gạch ngang
    .trim()
    .replace(/[\s]+/g, "-")          // space → gạch ngang
    .replace(/-+/g, "-");            // gộp nhiều gạch ngang liên tiếp
}
