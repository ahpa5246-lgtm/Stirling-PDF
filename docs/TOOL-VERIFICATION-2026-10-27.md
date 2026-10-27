# Tool expansion verification — 2026-10-27

## Latest implemented scope

Eleven browser PDF tools use the existing MIT-licensed `@cantoo/pdf-lib` package. The original eight provide page reversal, duplication, odd/even extraction, three blank-page operations and bookmark removal. The latest three remove link annotations, document Info/XMP metadata, or custom page labels. Each is registered with a direct URL. The PDF engine loads on demand.

Metadata cleanup is limited to the document Info dictionary and catalog XMP stream, not hidden content or embedded-object metadata. Link cleanup removes clickable Link annotations, not URL text. PDF rewriting invalidates digital signatures.

## Latest verification

- Full editor Vitest workspace: **577 test files, 5,857 tests passed**. Command: `cd frontend/editor && ../node_modules/.bin/vitest run --mode core`.
- Focused PDF behavior: **20 tests passed** across the page-operation and document-cleanup suites. Tests verify counts, ordering, blank pages, independent duplicate page objects, malformed input, no-even-page rejection, outline removal, metadata removal, retaining non-link annotations, retaining a real form field and its value, and repeated cleanup.
- **11 Chromium browser tests passed** in `src/core/tests/stubbed/local-pdf-tools.spec.ts`. Each opens a local tool, checks it cannot run without a file, uploads a generated PDF, runs the actual browser-side transformation and checks the named output appears. Bootstrap APIs are stubbed; PDF transformation is real and does not use a backend processing mock.
- Core TypeScript, whole-frontend oxlint, and whole-frontend oxfmt checks passed.

The normal Playwright Chromium download failed with a truncated archive. The browser checks used a temporary Chromium 153 executable extracted from `@sparticuz/chromium`, without changing project dependencies. The temporary launcher configuration was kept outside the project after the run.

## Remaining coverage

These results do not establish that every tool works in deployment. Backend Java, externally installed conversion/OCR programs, full browser-to-server integration, large files, encrypted input behavior in the UI, and more complex real-world PDFs still require testing. Java 17 is currently installed, while the project defaults to Java 25; the backend suite was not rerun in this session. The Task binary is absent, so direct frontend commands were used.

Prior selected backend, live API and split-browser results in the PR are historical, not newly repeated results. AI document translation and generative summarization are not implemented by this batch. Page-copy operations can discard document-level forms, outlines and metadata; the interface displays a warning. Browser memory limits still apply.
