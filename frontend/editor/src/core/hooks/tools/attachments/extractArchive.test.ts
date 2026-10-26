import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ResponseHandler } from "@app/utils/toolResponseProcessor";

const captured = vi.hoisted(() => ({
  handler: undefined as ResponseHandler | undefined,
}));
vi.mock("@app/hooks/tools/shared/useToolOperation", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@app/hooks/tools/shared/useToolOperation")
    >();
  return {
    ...actual,
    useToolOperation: (config: { responseHandler: ResponseHandler }) => {
      captured.handler = config.responseHandler;
      return {};
    },
  };
});
import { useExtractAttachmentsOperation } from "@app/hooks/tools/attachments/useExtractAttachments";

describe("attachment archives", () => {
  it("returns the complete server archive and assigns distinct batch names", async () => {
    renderHook(useExtractAttachmentsOperation);
    const source = new File(["pdf"], "report.pdf");
    const archive = new Blob(["zip bytes"], { type: "application/zip" });
    const first = await captured.handler!(archive, [source]);
    const second = await captured.handler!(archive, [source]);
    expect(first).toHaveLength(1);
    expect(first[0].size).toBe(archive.size);
    expect(first[0].type).toBe("application/zip");
    expect(first[0].name).toMatch(/^report_.*_attachments\.zip$/);
    expect(second[0].name).not.toBe(first[0].name);
  });
});
