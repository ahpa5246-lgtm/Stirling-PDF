import { useTranslation } from "react-i18next";
import { useBaseParameters } from "@app/hooks/tools/shared/useBaseParameters";
import {
  useToolOperation,
  defineSingleFileTool,
} from "@app/hooks/tools/shared/useToolOperation";
import { objectToFormData } from "@app/hooks/tools/shared/toolApiMapping";
import { createStandardErrorHandler } from "@app/utils/toolErrorHandler";
export type FlattenPortfolioParameters = Record<string, never>;
const defaultParameters: FlattenPortfolioParameters = {};
const validate = (_params: FlattenPortfolioParameters) => true;
export const useFlattenPortfolioParameters = () =>
  useBaseParameters({
    defaultParameters,
    endpointName: "flatten-portfolio",
    validateFn: validate,
  });
export const flattenPortfolioOperationConfig = defineSingleFileTool({
  operationType: "flattenPortfolio",
  endpoint: "/api/v1/misc/flatten-portfolio",
  defaultParameters,
  validateParams: validate,
  toApiParams: (_params: FlattenPortfolioParameters) => ({}),
  fromApiParams: (params) => ({ ...params }),
  buildFormData: (_params: FlattenPortfolioParameters, file: File) =>
    objectToFormData({}, { fileInput: file }),
});
export const useFlattenPortfolioOperation = () => {
  const { t } = useTranslation();
  return useToolOperation<FlattenPortfolioParameters>({
    ...flattenPortfolioOperationConfig,
    getErrorMessage: createStandardErrorHandler(
      t("flattenPortfolio.error", "Unable to flatten the PDF portfolio."),
    ),
  });
};
