import { useEffect, type Dispatch, type SetStateAction } from "react";
import { getConversionPreset } from "@app/hooks/tools/convert/conversionPresets";
import type { ConvertParameters } from "@app/hooks/tools/convert/useConvertParameters";

/** A route preset changes formats when navigating, without discarding other settings. */
export function useConversionRoutePreset(
  pathname: string,
  setParameters: Dispatch<SetStateAction<ConvertParameters>>,
) {
  useEffect(() => {
    const preset = getConversionPreset(pathname);
    if (preset)
      setParameters((previous) => ({
        ...previous,
        ...preset,
        isSmartDetection: false,
        smartDetectionType: "none",
      }));
  }, [pathname, setParameters]);
}
