import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTranslatedToolCatalog } from "@app/data/useTranslatedToolRegistry";
import { extractAttachmentsOperationConfig } from "@app/hooks/tools/attachments/useExtractAttachments";
import { deleteAttachmentOperationConfig } from "@app/hooks/tools/attachments/useDeleteAttachment";
import { renameAttachmentOperationConfig } from "@app/hooks/tools/attachments/useRenameAttachment";
import { scannerEffectOperationConfig } from "@app/hooks/tools/scannerEffect/useScannerEffect";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { language: "en-US" },
  }),
}));

describe("registered tools", () => {
  const configs = [
    extractAttachmentsOperationConfig,
    deleteAttachmentOperationConfig,
    renameAttachmentOperationConfig,
    scannerEffectOperationConfig,
  ];
  it.each(configs)(
    "exposes $operationType with its backend endpoint",
    (config) => {
      const { result } = renderHook(() => useTranslatedToolCatalog());
      const tool = result.current.allTools[config.operationType];
      expect(tool.component).toBeTruthy();
      expect(tool.operationConfig?.endpoint).toBe(config.endpoint);
      expect(tool.supportedFormats).toEqual(["pdf"]);
    },
  );
  it("preserves an attachment's exact name in multipart requests", () => {
    const file = new File(["pdf"], "source.pdf");
    const form = renameAttachmentOperationConfig.buildFormData(
      { attachmentName: " تقرير.pdf ", newName: "جديد.pdf" },
      file,
    );
    expect(form.get("fileInput")).toBe(file);
    expect(form.get("attachmentName")).toBe(" تقرير.pdf ");
    expect(form.get("newName")).toBe("جديد.pdf");
    expect(
      deleteAttachmentOperationConfig.validateParams?.({ attachmentName: " " }),
    ).toBe(false);
  });
  it("keeps extraction requests file-only", () => {
    const form = extractAttachmentsOperationConfig.buildFormData(
      {},
      new File(["pdf"], "source.pdf"),
    );
    expect([...form.keys()]).toEqual(["fileInput"]);
  });
});
