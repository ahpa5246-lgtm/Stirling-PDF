import { test, expect } from "@app/tests/helpers/stub-test-base";
import { PDFDocument } from "@cantoo/pdf-lib";

const tools = [
  ["reverse-pages", "reversePages"],
  ["duplicate-pages", "duplicatePages"],
  ["odd-pages", "oddPages"],
  ["even-pages", "evenPages"],
  ["interleave-blank-pages", "interleaveBlanks"],
  ["prepend-blank-page", "prependBlank"],
  ["append-blank-page", "appendBlank"],
  ["remove-bookmarks", "removeBookmarks"],
  ["remove-links", "removeLinks"],
  ["clear-document-metadata", "clearDocumentMetadata"],
  ["reset-page-labels", "clearPageLabels"],
];
for (const [route, id] of tools) {
  test(`${id} processes an uploaded PDF locally`, async ({ page }) => {
    const pdf = await PDFDocument.create();
    pdf.addPage([200, 400]);
    pdf.addPage([300, 400]);
    await page.goto(`/${route}`);
    const run = page.locator('[data-tour="run-button"]');
    await expect(run).toBeDisabled();
    await page.getByTestId("files-button").click();
    await page.getByTestId("file-input").setInputFiles({
      name: "sample.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from(await pdf.save()),
    });
    await expect(run).toBeEnabled({ timeout: 30000 });
    await run.click();
    await expect(page.getByTestId("review-panel-container")).toBeVisible({
      timeout: 30000,
    });
    await expect(
      page.getByText(`sample_${id}.pdf`, { exact: true }).first(),
    ).toBeVisible({ timeout: 30000 });
  });
}
