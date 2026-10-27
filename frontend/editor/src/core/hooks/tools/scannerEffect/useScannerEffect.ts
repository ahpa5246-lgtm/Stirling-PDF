import { useTranslation } from "react-i18next";
import { useBaseParameters } from "@app/hooks/tools/shared/useBaseParameters";
import {
  useToolOperation,
  defineSingleFileTool,
} from "@app/hooks/tools/shared/useToolOperation";
import { objectToFormData } from "@app/hooks/tools/shared/toolApiMapping";
import { createStandardErrorHandler } from "@app/utils/toolErrorHandler";
import {
  defaultParameters,
  ScannerEffectParameters,
  validateScannerEffect,
  scannerEffectToApiParams,
} from "@app/hooks/tools/scannerEffect/scannerEffectParameters";
export const useScannerEffectParameters = () =>
  useBaseParameters({
    defaultParameters,
    endpointName: "scanner-effect",
    validateFn: validateScannerEffect,
  });
export const scannerEffectOperationConfig = defineSingleFileTool({
  operationType: "scannerEffect",
  endpoint: "/api/v1/misc/scanner-effect",
  defaultParameters,
  validateParams: validateScannerEffect,
  toApiParams: scannerEffectToApiParams,
  fromApiParams: (p) => ({
    quality: p.quality,
    rotation: p.rotation,
    colorspace: p.colorspace ?? defaultParameters.colorspace,
  }),
  buildFormData: (params: ScannerEffectParameters, file: File) =>
    objectToFormData(scannerEffectToApiParams(params), { fileInput: file }),
});
export const useScannerEffectOperation = () => {
  const { t } = useTranslation();
  return useToolOperation<ScannerEffectParameters>({
    ...scannerEffectOperationConfig,
    getErrorMessage: createStandardErrorHandler(
      t("scannerEffect.error", "Unable to apply the scanner effect."),
    ),
  });
};
