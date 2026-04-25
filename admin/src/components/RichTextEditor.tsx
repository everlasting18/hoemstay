import { useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Autoformat,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  FileRepository,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Plugin,
  Table,
  TableToolbar,
  Underline
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { getCloudinaryConfig, hasCloudinaryUploadConfig } from "@/lib/cloudinary";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  uploadFolder?: string;
};

class CloudinaryUploadAdapter {
  private loader: { file: Promise<File> };
  private folder: string;

  constructor(loader: { file: Promise<File> }, folder: string) {
    this.loader = loader;
    this.folder = folder;
  }

  async upload(): Promise<{ default: string }> {
    const file = await this.loader.file;
    const { cloudName, uploadPreset, imageTransform } = getCloudinaryConfig();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const sanitizedFolder = this.folder.replace(/^\/+|\/+$/g, "");
    if (sanitizedFolder) {
      formData.append("folder", sanitizedFolder);
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`;
    const response = await fetch(endpoint, { method: "POST", body: formData });

    if (!response.ok) {
      throw new Error(`Cloudinary upload lỗi ${response.status}`);
    }

    const payload = (await response.json()) as { secure_url?: string; url?: string };
    const sourceUrl = payload.secure_url || payload.url;

    if (!sourceUrl) {
      throw new Error("Cloudinary không trả về URL ảnh.");
    }

    if (imageTransform) {
      const uploadSegment = "/image/upload/";
      const idx = sourceUrl.indexOf(uploadSegment);
      if (idx !== -1) {
        const before = sourceUrl.slice(0, idx + uploadSegment.length);
        const after = sourceUrl.slice(idx + uploadSegment.length);
        return { default: `${before}${imageTransform}/${after}` };
      }
    }

    return { default: sourceUrl };
  }

  abort() {}
}

function makeCloudinaryPlugin(folder: string) {
  return class CloudinaryPlugin extends Plugin {
    init() {
      const fileRepository = this.editor.plugins.get(FileRepository);
      fileRepository.createUploadAdapter = (loader) =>
        new CloudinaryUploadAdapter(loader as { file: Promise<File> }, folder);
    }
  };
}

export function RichTextEditor({ value, onChange, uploadFolder = "/windy-hill/content" }: RichTextEditorProps) {
  const canUpload = hasCloudinaryUploadConfig();

  // Tạo plugin class một lần duy nhất cho mỗi uploadFolder
  const CloudinaryPlugin = useMemo(() => makeCloudinaryPlugin(uploadFolder), [uploadFolder]);

  const plugins = [
    Essentials,
    Autoformat,
    Bold,
    Italic,
    Underline,
    Heading,
    Paragraph,
    List,
    Link,
    BlockQuote,
    Indent,
    IndentBlock,
    Image,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    ImageUpload,
    FileRepository,
    Table,
    TableToolbar,
    MediaEmbed,
    PasteFromOffice,
    ...(canUpload ? [CloudinaryPlugin] : [])
  ];

  return (
    <div className="ckeditor-wrapper rounded-xl overflow-hidden border border-border/70">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          plugins,
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "outdent",
              "indent",
              "|",
              "link",
              "blockQuote",
              ...(canUpload ? ["uploadImage"] : []),
              "insertTable",
              "mediaEmbed",
              "|",
              "undo",
              "redo"
            ]
          },
          heading: {
            options: [
              { model: "paragraph", title: "Đoạn văn", class: "ck-heading_paragraph" },
              { model: "heading2", view: "h2", title: "Tiêu đề 2", class: "ck-heading_heading2" },
              { model: "heading3", view: "h3", title: "Tiêu đề 3", class: "ck-heading_heading3" },
              { model: "heading4", view: "h4", title: "Tiêu đề 4", class: "ck-heading_heading4" }
            ]
          },
          image: {
            toolbar: [
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
              "|",
              "toggleImageCaption",
              "imageTextAlternative",
              "|",
              "resizeImage"
            ]
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"]
          },
          link: {
            defaultProtocol: "https://"
          },
          licenseKey: "GPL"
        }}
        onChange={(_event, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
