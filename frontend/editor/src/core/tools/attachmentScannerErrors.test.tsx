import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExtractAttachments from "@app/tools/ExtractAttachments";
import RenameAttachment from "@app/tools/RenameAttachment";
import DeleteAttachment from "@app/tools/DeleteAttachment";
import ScannerEffect from "@app/tools/ScannerEffect";

vi.mock("@app/hooks/tools/shared/useBaseTool", () => ({
  useBaseTool: () => ({
    selectedFiles: [],
    hasResults: false,
    settingsCollapsed: false,
    endpointLoading: false,
    endpointEnabled: true,
    operation: { errorMessage: "Unable to process the file" },
    params: {
      parameters: {
        attachmentName: "",
        newName: "",
        quality: "high",
        rotation: "none",
        colorspace: "color",
      },
      updateParameter: vi.fn(),
      validateParameters: () => true,
    },
    handleExecute: vi.fn(),
    handleThumbnailClick: vi.fn(),
    handleUndo: vi.fn(),
  }),
}));
vi.mock("@app/components/tools/shared/createToolFlow", () => ({
  createToolFlow: (config: {
    review: { isVisible: boolean; operation: { errorMessage: string } };
  }) =>
    config.review.isVisible ? (
      <div role="alert">{config.review.operation.errorMessage}</div>
    ) : null,
}));

describe("tool failures", () => {
  it.each([
    ["extract", ExtractAttachments],
    ["rename", RenameAttachment],
    ["delete", DeleteAttachment],
    ["scanner", ScannerEffect],
  ] as const)(
    "shows an error from %s when no result was created",
    (_name, Component) => {
      render(<Component />);
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Unable to process the file",
      );
    },
  );
});
