export interface ConversionPreset {
  fromExtension: string;
  toExtension: string;
}
export const CONVERSION_PRESETS: Readonly<Record<string, ConversionPreset>> = {
  "/word-to-pdf": { fromExtension: "docx", toExtension: "pdf" },
  "/powerpoint-to-pdf": { fromExtension: "pptx", toExtension: "pdf" },
  "/excel-to-pdf": { fromExtension: "xlsx", toExtension: "pdf" },
  "/jpg-to-pdf": { fromExtension: "jpg", toExtension: "pdf" },
  "/png-to-pdf": { fromExtension: "png", toExtension: "pdf" },
  "/img-to-pdf": { fromExtension: "image", toExtension: "pdf" },
  "/file-to-pdf": { fromExtension: "any", toExtension: "pdf" },
  "/html-to-pdf": { fromExtension: "html", toExtension: "pdf" },
  "/markdown-to-pdf": { fromExtension: "md", toExtension: "pdf" },
  "/eml-to-pdf": { fromExtension: "eml", toExtension: "pdf" },
  "/svg-to-pdf": { fromExtension: "svg", toExtension: "pdf" },
  "/ebook-to-pdf": { fromExtension: "epub", toExtension: "pdf" },
  "/cbr-to-pdf": { fromExtension: "cbr", toExtension: "pdf" },
  "/cbz-to-pdf": { fromExtension: "cbz", toExtension: "pdf" },
  "/pdf-to-jpg": { fromExtension: "pdf", toExtension: "jpg" },
  "/pdf-to-img": { fromExtension: "pdf", toExtension: "jpg" },
  "/pdf-to-png": { fromExtension: "pdf", toExtension: "png" },
  "/pdf-to-word": { fromExtension: "pdf", toExtension: "docx" },
  "/pdf-to-powerpoint": { fromExtension: "pdf", toExtension: "pptx" },
  "/pdf-to-presentation": { fromExtension: "pdf", toExtension: "pptx" },
  "/pdf-to-excel": { fromExtension: "pdf", toExtension: "xlsx" },
  "/pdf-to-xlsx": { fromExtension: "pdf", toExtension: "xlsx" },
  "/pdf-to-csv": { fromExtension: "pdf", toExtension: "csv" },
  "/pdf-to-text": { fromExtension: "pdf", toExtension: "txt" },
  "/pdf-to-markdown": { fromExtension: "pdf", toExtension: "md" },
  "/pdf-to-html": { fromExtension: "pdf", toExtension: "html" },
  "/pdf-to-xml": { fromExtension: "pdf", toExtension: "xml" },
  "/pdf-to-pdfa": { fromExtension: "pdf", toExtension: "pdfa" },
  "/pdf-to-ua": { fromExtension: "pdf", toExtension: "pdfua" },
  "/pdf-to-cbz": { fromExtension: "pdf", toExtension: "cbz" },
  "/pdf-to-cbr": { fromExtension: "pdf", toExtension: "cbr" },
  "/pdf-to-epub": { fromExtension: "pdf", toExtension: "epub" },
};
export const getConversionPreset = (path: string): ConversionPreset | null =>
  Object.hasOwn(CONVERSION_PRESETS, path) ? CONVERSION_PRESETS[path] : null;
