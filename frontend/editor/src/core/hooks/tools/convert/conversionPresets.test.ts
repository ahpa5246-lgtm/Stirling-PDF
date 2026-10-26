import { describe, expect, it } from "vitest";
import {
  CONVERSION_PRESETS,
  getConversionPreset,
} from "@app/hooks/tools/convert/conversionPresets";
import { CONVERSION_MATRIX } from "@app/constants/convertConstants";
import { URL_TO_TOOL_MAP } from "@app/utils/urlMapping";
import { toolRoute } from "@app/utils/urlRouting";
import type { ToolRegistry } from "@app/data/toolsTaxonomy";

describe("conversion shortcuts", () => {
  it.each([
    ["/pdf-to-word", "pdf", "docx"],
    ["/excel-to-pdf", "xlsx", "pdf"],
    ["/pdf-to-markdown", "pdf", "md"],
    ["/jpg-to-pdf", "jpg", "pdf"],
  ])("selects formats for %s", (path, fromExtension, toExtension) => {
    expect(getConversionPreset(path)).toEqual({ fromExtension, toExtension });
    expect(URL_TO_TOOL_MAP[path]).toBe("convert");
  });
  it("all presets reference supported conversions", () => {
    for (const [path, preset] of Object.entries(CONVERSION_PRESETS)) {
      expect(CONVERSION_MATRIX[preset.fromExtension]).toContain(
        preset.toExtension,
      );
      expect(URL_TO_TOOL_MAP[path]).toBe("convert");
    }
  });
  it("keeps a shortcut URL when the converter opens", () =>
    expect(
      toolRoute("convert", { convert: {} } as ToolRegistry, {
        pathname: "/pdf-to-word",
        search: "",
      }),
    ).toBeNull());
  it("does not assign a preset to the generic converter", () =>
    expect(getConversionPreset("/convert")).toBeNull());
});
