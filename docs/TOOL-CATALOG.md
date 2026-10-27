# Core PDF tools

The core registry contains 68 regular tool IDs, in addition to Read, Multi-Tool and Automate. The classification step is pipeline-only. The listing describes code registration, not proof of a working deployment.

## Registered regular tools

- `certSign`
- `sign`
- `sharedSign`
- `addText`
- `addPassword`
- `removePassword`
- `removePages`
- `removeBlanks`
- `removeAnnotations`
- `removeImage`
- `changePermissions`
- `watermark`
- `sanitize`
- `split`
- `merge`
- `convert`
- `ocr`
- `addImage`
- `rotate`
- `autoRotate`
- `annotate`
- `scannerImageSplit`
- `editTableOfContents`
- `autoRename`
- `pageLayout`
- `scalePages`
- `adjustContrast`
- `crop`
- `pdfToSinglePage`
- `repair`
- `compare`
- `addPageNumbers`
- `redact`
- `flatten`
- `removeCertSign`
- `unlockPDFForms`
- `compress`
- `classify`
- `extractPages`
- `reorganizePages`
- `extractImages`
- `addStamp`
- `addAttachments`
- `extractAttachments`
- `renameAttachment`
- `deleteAttachment`
- `scannerEffect`
- `createPortfolio`
- `flattenPortfolio`
- `changeMetadata`
- `overlayPdfs`
- `getPdfInfo`
- `validateSignature`
- `timestampPdf`
- `replaceColor`
- `showJS`
- `bookletImposition`
- `pdfTextEditor`
- `formFill`
- `autoFormDetection`

## Conversion shortcuts

The conversion tool supports shortcuts for Word, Excel, PowerPoint, images, HTML, Markdown, email, ebooks, PDF/A and related formats. The exact route-to-format mapping is in `frontend/editor/src/core/hooks/tools/convert/conversionPresets.ts`.

## Newly exposed backend operations

- Extract, rename or delete PDF attachments.
- Flatten a PDF portfolio while preserving its embedded attachments.
- Apply a scanner effect to an existing PDF. This rasterizes pages and may remove searchable text and interactive content.

## Production gaps

- AI document translation and generative summarization are not provided by this change.
- Live behavior depends on the deployed backend and optional tools such as OCR and office conversion engines.
- Some directories in this repository have separate restricted licenses. Review the deployed composition and third-party licenses before commercial use.
- Frontend unit tests do not substitute for browser tests and real PDF round trips.

## Live PDF round-trip smoke test

With the backend running and `pypdf` installed, run `STIRLING_BASE_URL=http://127.0.0.1:8080 python testing/live_tool_roundtrip.py`. The script creates a synthetic five-page PDF with two text attachments, exercises split, extract, rename, delete and scanner-effect endpoints, and checks page counts and attachment bytes. It sends the synthetic document to the specified server.

## Browser PDF operations

Eight tools use the existing `@cantoo/pdf-lib` dependency (MIT; see the installed package's LICENSE.md and https://github.com/cantoo-scribe/pdf-lib). No external service or model is required.

- `reversePages`: `/reverse-pages`
- `duplicatePages`: `/duplicate-pages`
- `oddPages`: `/odd-pages`
- `evenPages`: `/even-pages`
- `interleaveBlanks`: `/interleave-blank-pages`
- `prependBlank`: `/prepend-blank-page`
- `appendBlank`: `/append-blank-page`
- `removeBookmarks`: `/remove-bookmarks`

These operations rewrite the document and invalidate digital signatures. Page-copy operations may discard document-level forms, bookmarks and metadata. Encrypted inputs are rejected. A document without even pages produces an explicit error for even-page extraction. Input originals should be retained. Browser memory limits still apply; large-file and browser end-to-end coverage remains outstanding.
