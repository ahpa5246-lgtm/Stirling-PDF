import { describe, it, expect } from "vitest";
import { PDFDocument, PDFName, PDFArray, PDFDict } from "@cantoo/pdf-lib";
import { transformPdf } from "@app/hooks/tools/localPdf/localPdf";

describe("document cleanup tools", () => {
  it("removes only link annotations and retains other annotations", async () => {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage();
    page.node.set(
      PDFName.of("Annots"),
      pdf.context.obj([
        { Type: "Annot", Subtype: "Link", Rect: [0, 0, 100, 30] },
        { Type: "Annot", Subtype: "Text", Rect: [0, 40, 100, 70] },
        { Type: "Annot", Subtype: "Widget", Rect: [0, 80, 100, 100] },
      ]),
    );
    const output = await PDFDocument.load(
      await transformPdf("removeLinks", await pdf.save()),
    );
    const annotations = output
      .getPage(0)
      .node.lookup(PDFName.of("Annots"), PDFArray);
    expect(annotations.size()).toBe(2);
    expect(annotations.lookup(0, PDFDict).get(PDFName.of("Subtype"))).toBe(
      PDFName.of("Text"),
    );
    expect(annotations.lookup(1, PDFDict).get(PDFName.of("Subtype"))).toBe(
      PDFName.of("Widget"),
    );
  });
  it("removes Info and XMP without removing content or bookmarks", async () => {
    const pdf = await PDFDocument.create();
    pdf.addPage().drawText("Retained content");
    pdf.setAuthor("Private author");
    pdf.setTitle("Private title");
    pdf.catalog.set(
      PDFName.of("Metadata"),
      pdf.context.register(pdf.context.stream("private XMP")),
    );
    pdf.catalog.set(PDFName.of("Outlines"), pdf.context.obj({ Count: 0 }));
    const output = await PDFDocument.load(
      await transformPdf("clearDocumentMetadata", await pdf.save()),
      { updateMetadata: false },
    );
    expect(output.context.trailerInfo.Info).toBeUndefined();
    expect(output.catalog.has(PDFName.of("Metadata"))).toBe(false);
    expect(output.catalog.has(PDFName.of("Outlines"))).toBe(true);
    expect(output.getPage(0).node.Contents()).toBeDefined();
  });
  it("removes custom page labels but retains the outline", async () => {
    const pdf = await PDFDocument.create();
    pdf.addPage();
    pdf.catalog.set(
      PDFName.of("PageLabels"),
      pdf.context.obj({ Nums: [0, { S: "r" }] }),
    );
    pdf.catalog.set(PDFName.of("Outlines"), pdf.context.obj({ Count: 0 }));
    const output = await PDFDocument.load(
      await transformPdf("clearPageLabels", await pdf.save()),
    );
    expect(output.catalog.has(PDFName.of("PageLabels"))).toBe(false);
    expect(output.catalog.has(PDFName.of("Outlines"))).toBe(true);
  });
});

it("keeps a fillable text field and its value when removing links", async () => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage();
  const field = pdf.getForm().createTextField("customer");
  field.setText("Test customer");
  field.addToPage(page, { x: 10, y: 10, width: 200, height: 30 });
  const link = pdf.context.register(
    pdf.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [0, 50, 100, 80],
      A: { S: "URI" },
    }),
  );
  page.node.addAnnot(link);
  const output = await PDFDocument.load(
    await transformPdf("removeLinks", await pdf.save()),
  );
  expect(output.getForm().getTextField("customer").getText()).toBe(
    "Test customer",
  );
  expect(output.getPage(0).node.Annots()?.size()).toBe(1);
});

it.each(["removeLinks", "clearDocumentMetadata", "clearPageLabels"] as const)(
  "%s can run twice without changing page count",
  async (id) => {
    const pdf = await PDFDocument.create();
    pdf.addPage();
    const first = await transformPdf(id, await pdf.save());
    const second = await PDFDocument.load(await transformPdf(id, first));
    expect(second.getPageCount()).toBe(1);
  },
);
