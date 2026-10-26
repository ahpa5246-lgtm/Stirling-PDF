import { describe, expect, it } from "vitest";
import {
  buildArchiveName,
  uniqueExtractedNames,
  validateAttachmentName,
} from "@app/hooks/tools/attachments/attachmentTools";
import { URL_TO_TOOL_MAP } from "@app/utils/urlMapping";

describe("attachment tools", () => {
  it.each(["", " ", "\n\t"])("rejects blank names", (name) =>
    expect(validateAttachmentName(name)).toBe(false),
  );
  it("accepts names with meaningful Unicode and spaces", () =>
    expect(validateAttachmentName(" تقرير.pdf ")).toBe(true));
  it("avoids duplicate archive and extracted names in a batch", () => {
    const a = buildArchiveName("report.pdf", "id-a");
    const b = buildArchiveName("report.pdf", "id-b");
    expect(a).not.toBe(b);
    const names = [
      ...uniqueExtractedNames(a, ["notes.txt", "notes.txt"]),
      ...uniqueExtractedNames(b, ["notes.txt"]),
    ];
    expect(new Set(names).size).toBe(3);
  });
  it("registers all backend attachment tools", () => {
    expect(URL_TO_TOOL_MAP["/extract-attachments"]).toBe("extractAttachments");
    expect(URL_TO_TOOL_MAP["/rename-attachment"]).toBe("renameAttachment");
    expect(URL_TO_TOOL_MAP["/delete-attachment"]).toBe("deleteAttachment");
  });
});
