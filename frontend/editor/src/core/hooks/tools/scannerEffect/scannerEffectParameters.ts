import type { ToolApiParams } from "@app/hooks/tools/shared/toolApiMapping";
export interface ScannerEffectParameters {
  quality: "low" | "medium" | "high";
  rotation: "none" | "slight" | "moderate" | "severe";
  colorspace: "grayscale" | "color";
}
export const defaultParameters: ScannerEffectParameters = {
  quality: "high",
  rotation: "slight",
  colorspace: "grayscale",
};
export const validateScannerEffect = (params: {
  quality: string;
  rotation: string;
  colorspace: string;
}) =>
  ["low", "medium", "high"].includes(params.quality) &&
  ["none", "slight", "moderate", "severe"].includes(params.rotation) &&
  ["grayscale", "color"].includes(params.colorspace);
export const scannerEffectToApiParams = (
  params: ScannerEffectParameters,
): ToolApiParams["/api/v1/misc/scanner-effect"] => ({
  ...params,
  advancedEnabled: false,
  ...(params.rotation === "none" ? { rotateVariance: 0 } : {}),
});
