export const LOCAL_PDF_TOOLS = {
  removeLinks: {
    title: "Remove Clickable Links",
    description:
      "Remove link annotations while keeping text, comments and form fields.",
  },
  clearDocumentMetadata: {
    title: "Clear Document Metadata",
    description:
      "Remove document Info and XMP metadata. Hidden content and metadata inside embedded objects are not scrubbed.",
  },
  clearPageLabels: {
    title: "Reset Page Labels",
    description:
      "Remove custom page labels, such as roman numerals, while retaining the document outline.",
  },
  reversePages: {
    title: "Reverse Pages",
    description: "Reverse the order of every page.",
  },
  duplicatePages: {
    title: "Duplicate Every Page",
    description: "Place a copy immediately after each page.",
  },
  oddPages: {
    title: "Extract Odd Pages",
    description: "Keep pages 1, 3, 5 and so on.",
  },
  evenPages: {
    title: "Extract Even Pages",
    description: "Keep pages 2, 4, 6 and so on.",
  },
  interleaveBlanks: {
    title: "Insert Blank Pages",
    description: "Insert a matching blank page after every page.",
  },
  prependBlank: {
    title: "Add Blank First Page",
    description: "Insert a blank page matching the first page size.",
  },
  appendBlank: {
    title: "Add Blank Last Page",
    description: "Append a blank page matching the last page size.",
  },
  removeBookmarks: {
    title: "Remove Bookmarks",
    description: "Remove the document outline while keeping its pages.",
  },
} as const;
export type LocalPdfToolId = keyof typeof LOCAL_PDF_TOOLS;

/** Rewrites a PDF using the installed pdf-lib fork. Encrypted inputs are rejected.
 * Page-copy operations retain page content, but do not preserve document-level forms or signatures. */
export async function transformPdf(
  id: LocalPdfToolId,
  bytes: Uint8Array,
): Promise<Uint8Array> {
  const { PDFDocument, PDFName, PDFDict, PDFRef } =
    await import("@cantoo/pdf-lib");
  const source = await PDFDocument.load(bytes, { updateMetadata: false });
  const count = source.getPageCount();
  if (!count) throw new Error("No matching pages in this PDF.");
  if (id === "clearDocumentMetadata") {
    const info = source.context.trailerInfo.Info;
    if (info instanceof PDFRef) source.context.delete(info);
    delete source.context.trailerInfo.Info;
    const metadata = source.catalog.get(PDFName.of("Metadata"));
    source.catalog.delete(PDFName.of("Metadata"));
    if (metadata instanceof PDFRef) source.context.delete(metadata);
    return source.save();
  }
  if (id === "clearPageLabels") {
    source.catalog.delete(PDFName.of("PageLabels"));
    return source.save();
  }
  if (id === "removeLinks") {
    for (const page of source.getPages()) {
      const annotations = page.node.Annots();
      if (!annotations) continue;
      for (let i = annotations.size() - 1; i >= 0; i--) {
        const annotation = source.context.lookup(annotations.get(i));
        if (
          annotation instanceof PDFDict &&
          annotation.get(PDFName.of("Subtype")) === PDFName.of("Link")
        )
          annotations.remove(i);
      }
    }
    return source.save();
  }
  if (id === "removeBookmarks") {
    source.catalog.delete(PDFName.of("Outlines"));
    if (
      source.catalog.get(PDFName.of("PageMode")) === PDFName.of("UseOutlines")
    ) {
      source.catalog.delete(PDFName.of("PageMode"));
    }
    return source.save();
  }
  if (
    id === "prependBlank" ||
    id === "appendBlank" ||
    id === "interleaveBlanks"
  ) {
    if (id === "prependBlank") {
      const p = source.getPage(0);
      source.insertPage(0, [p.getWidth(), p.getHeight()]);
    } else if (id === "appendBlank") {
      const p = source.getPage(count - 1);
      source.addPage([p.getWidth(), p.getHeight()]);
    } else {
      for (let i = count - 1; i >= 0; i--) {
        const p = source.getPage(i);
        source.insertPage(i + 1, [p.getWidth(), p.getHeight()]);
      }
    }
    return source.save();
  }
  let indices = source.getPageIndices();
  if (id === "reversePages") indices.reverse();
  if (id === "oddPages") indices = indices.filter((i) => i % 2 === 0);
  if (id === "evenPages") indices = indices.filter((i) => i % 2 === 1);
  if (!indices.length) throw new Error("No matching pages in this PDF.");
  const output = await PDFDocument.create();
  for (const index of indices) {
    const copies = await output.copyPages(
      source,
      id === "duplicatePages" ? [index, index] : [index],
    );
    copies.forEach((page) => output.addPage(page));
  }
  return output.save();
}
