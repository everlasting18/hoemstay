type UploadFileOptions = {
  folder?: string;
  onProgress?: (percent: number) => void;
};

export type UploadedAsset = {
  url: string;
  thumbnailUrl?: string;
  publicId?: string;
  name?: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  url?: string;
  public_id?: string;
  original_filename?: string;
  eager?: Array<{ secure_url?: string; url?: string }>;
  error?: {
    message?: string;
  };
};

export const getCloudinaryConfig = () => ({
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() || "",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim() || "",
  imageTransform: import.meta.env.VITE_CLOUDINARY_IMAGE_TRANSFORM?.trim() || "f_webp,q_auto"
});

export const hasCloudinaryUploadConfig = () => {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  return Boolean(cloudName && uploadPreset);
};

const sanitizeFolder = (folder?: string) => {
  if (!folder) return "";
  return folder.replace(/^\/+|\/+$/g, "");
};

const toCloudinaryDeliveryUrl = (url: string, transform: string) => {
  if (!transform) return url;

  const uploadSegment = "/image/upload/";
  const uploadIndex = url.indexOf(uploadSegment);
  if (uploadIndex === -1) return url;

  const beforeUpload = url.slice(0, uploadIndex + uploadSegment.length);
  const afterUpload = url.slice(uploadIndex + uploadSegment.length);

  if (afterUpload.startsWith(`${transform}/`)) return url;
  return `${beforeUpload}${transform}/${afterUpload}`;
};

export async function uploadFileToCloudinary(file: File, options: UploadFileOptions = {}): Promise<UploadedAsset> {
  const { cloudName, uploadPreset, imageTransform } = getCloudinaryConfig();

  if (!cloudName || !uploadPreset) {
    throw new Error("Thiếu VITE_CLOUDINARY_CLOUD_NAME hoặc VITE_CLOUDINARY_UPLOAD_PRESET.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const folder = sanitizeFolder(options.folder);
  if (folder) {
    formData.append("folder", folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`;

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("POST", endpoint);

    request.upload.onprogress = (event) => {
      if (!options.onProgress || !event.lengthComputable) return;
      options.onProgress(Math.round((event.loaded / event.total) * 100));
    };

    request.onerror = () => reject(new Error("Không thể upload ảnh lên Cloudinary."));

    request.onload = () => {
      let payload: CloudinaryUploadResponse | null = null;

      try {
        payload = request.responseText ? (JSON.parse(request.responseText) as CloudinaryUploadResponse) : null;
      } catch {
        reject(new Error("Cloudinary trả response không hợp lệ."));
        return;
      }

      if (request.status < 200 || request.status >= 300) {
        reject(new Error(payload?.error?.message || `Cloudinary upload lỗi ${request.status}.`));
        return;
      }

      const sourceUrl = payload?.secure_url || payload?.url;
      if (!sourceUrl) {
        reject(new Error("Cloudinary upload thành công nhưng không trả về URL."));
        return;
      }

      const deliveryUrl = toCloudinaryDeliveryUrl(sourceUrl, imageTransform);

      resolve({
        url: deliveryUrl,
        thumbnailUrl: payload?.eager?.[0]?.secure_url || payload?.eager?.[0]?.url,
        publicId: payload?.public_id,
        name: payload?.original_filename
      });
    };

    request.send(formData);
  });
}
