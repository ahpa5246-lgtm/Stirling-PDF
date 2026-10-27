import { describe, it, expect } from "vitest";
import { PDFDocument } from "@cantoo/pdf-lib";
import { transformPdf } from "@app/hooks/tools/localPdf/localPdf";

describe("local PDF tools", () => {
  it.each([
    ["reversePages", [300, 200, 100]],
    ["duplicatePages", [100, 100, 200, 200, 300, 300]],
    ["oddPages", [100, 300]],
    ["evenPages", [200]],
    ["interleaveBlanks", [100, 100, 200, 200, 300, 300]],
    ["prependBlank", [100, 100, 200, 300]],
    ["appendBlank", [100, 200, 300, 300]],
    ["removeBookmarks", [100, 200, 300]],
  ] as const)("%s produces the expected page order", async (id, widths) => {
    const pdf = await PDFDocument.create();
    [100, 200, 300].forEach((w) => pdf.addPage([w, 400]));
    const result = await PDFDocument.load(
      await transformPdf(id, await pdf.save()),
    );
    expect(result.getPages().map((p) => p.getWidth())).toEqual(widths);
  });
  it("rejects even-page extraction when the document has no even pages", async () => {
    const pdf = await PDFDocument.create();
    pdf.addPage();
    await expect(transformPdf("evenPages", await pdf.save())).rejects.toThrow(
      "No matching pages",
    );
  });
});

describe("PDF content preservation", () => {
  it("inserts empty pages and preserves original content streams", async () => {
    const pdf = await PDFDocument.create();
    pdf.addPage([200, 400]).drawText("Original content");
    const output = await PDFDocument.load(
      await transformPdf("interleaveBlanks", await pdf.save()),
    );
    expect(output.getPage(0).node.Contents()).toBeDefined();
    expect(output.getPage(1).node.Contents()).toBeUndefined();
  });
  it("removes the outline without changing page content", async () => {
    const { PDFName } = await import("@cantoo/pdf-lib");
    const pdf = await PDFDocument.create();
    pdf.addPage().drawText("Preserved");
    pdf.catalog.set(
      PDFName.of("Outlines"),
      pdf.context.obj({ Type: "Outlines", Count: 0 }),
    );
    pdf.catalog.set(PDFName.of("PageMode"), PDFName.of("UseOutlines"));
    const output = await PDFDocument.load(
      await transformPdf("removeBookmarks", await pdf.save()),
    );
    expect(output.catalog.has(PDFName.of("Outlines"))).toBe(false);
    expect(output.catalog.has(PDFName.of("PageMode"))).toBe(false);
    expect(output.getPage(0).node.Contents()).toBeDefined();
  });
  it("rejects malformed input instead of returning a success file", async () => {
    await expect(
      transformPdf("reversePages", new Uint8Array([1, 2, 3])),
    ).rejects.toThrow();
  });
});

it("duplicates pages as independent page objects", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  const output = await PDFDocument.load(
    await transformPdf("duplicatePages", await pdf.save()),
  );
  expect(output.getPage(0).ref.toString()).not.toBe(
    output.getPage(1).ref.toString(),
  );
});
