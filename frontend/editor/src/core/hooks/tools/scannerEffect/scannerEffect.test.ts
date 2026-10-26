import { describe, expect, it } from "vitest";
import {
  scannerEffectToApiParams,
  validateScannerEffect,
} from "@app/hooks/tools/scannerEffect/scannerEffectParameters";

describe("scanner effect", () => {
  it("turns off random rotation for the none setting", () => {
    expect(
      scannerEffectToApiParams({
        quality: "high",
        rotation: "none",
        colorspace: "grayscale",
      }).rotateVariance,
    ).toBe(0);
  });
  it("rejects unsupported presets", () =>
    expect(
      validateScannerEffect({
        quality: "bad",
        rotation: "none",
        colorspace: "color",
      }),
    ).toBe(false));
  it.each(["low", "medium", "high"])("accepts %s quality", (quality) =>
    expect(
      validateScannerEffect({ quality, rotation: "none", colorspace: "color" }),
    ).toBe(true),
  );
});
