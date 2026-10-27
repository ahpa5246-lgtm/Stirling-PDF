import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useConvertParameters } from "@app/hooks/tools/convert/useConvertParameters";
import { useConversionRoutePreset } from "@app/hooks/tools/convert/useConversionRoutePreset";

function useRoute(path: string) {
  const params = useConvertParameters();
  useConversionRoutePreset(path, params.setParameters);
  return params;
}
describe("conversion route presets", () => {
  it("updates formats on navigation", () => {
    const { result, rerender } = renderHook(({ path }) => useRoute(path), {
      initialProps: { path: "/pdf-to-word" },
    });
    expect(result.current.parameters).toMatchObject({
      fromExtension: "pdf",
      toExtension: "docx",
    });
    rerender({ path: "/excel-to-pdf" });
    expect(result.current.parameters).toMatchObject({
      fromExtension: "xlsx",
      toExtension: "pdf",
    });
  });
  it("keeps later manual changes until navigation", () => {
    const { result, rerender } = renderHook(({ path }) => useRoute(path), {
      initialProps: { path: "/pdf-to-jpg" },
    });
    act(() => result.current.updateParameter("toExtension", "png"));
    rerender({ path: "/pdf-to-jpg" });
    expect(result.current.parameters.toExtension).toBe("png");
  });
  it("leaves generic conversion unconfigured", () => {
    const { result } = renderHook(() => useRoute("/convert"));
    expect(result.current.parameters.fromExtension).toBe("");
    expect(result.current.parameters.toExtension).toBe("");
  });
});
