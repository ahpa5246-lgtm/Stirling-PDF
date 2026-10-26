import { useCallback } from "react";
import { useToolResources } from "@app/hooks/tools/shared/useToolResources";
import { generateId } from "@app/utils/generateId";
import {
  buildArchiveName,
  uniqueExtractedNames,
} from "@app/hooks/tools/attachments/attachmentTools";
import { useTranslation } from "react-i18next";
import { useBaseParameters } from "@app/hooks/tools/shared/useBaseParameters";
import {
  useToolOperation,
  defineSingleFileTool,
} from "@app/hooks/tools/shared/useToolOperation";
import { objectToFormData } from "@app/hooks/tools/shared/toolApiMapping";
import { createStandardErrorHandler } from "@app/utils/toolErrorHandler";
export type ExtractAttachmentsParameters = Record<string, never>;
const defaultParameters: ExtractAttachmentsParameters = {};
const validate = (_params: ExtractAttachmentsParameters) => true;
export const useExtractAttachmentsParameters = () =>
  useBaseParameters({
    defaultParameters,
    endpointName: "extract-attachments",
    validateFn: validate,
  });
export const extractAttachmentsOperationConfig = defineSingleFileTool({
  operationType: "extractAttachments",
  endpoint: "/api/v1/misc/extract-attachments",
  defaultParameters,
  validateParams: validate,
  toApiParams: (_params: ExtractAttachmentsParameters) => ({}),
  fromApiParams: (params) => ({ ...params }),
  buildFormData: (_params: ExtractAttachmentsParameters, file: File) =>
    objectToFormData({}, { fileInput: file }),
});
export const useExtractAttachmentsOperation = () => {
  const { t } = useTranslation();
  const { extractZipFiles } = useToolResources();
  const responseHandler = useCallback(
    async (blob: Blob, inputs: File[]) => {
      const archive = new File(
        [blob],
        buildArchiveName(inputs[0]?.name ?? "document.pdf", generateId()),
        { type: "application/zip" },
      );
      const results = await extractZipFiles(archive);
      if (results.length === 1 && results[0] === archive) return results;
      const names = uniqueExtractedNames(
        archive.name,
        results.map((file) => file.name),
      );
      return results.map(
        (file, index) =>
          new File([file], names[index], {
            type: file.type,
            lastModified: file.lastModified,
          }),
      );
    },
    [extractZipFiles],
  );
  return useToolOperation<ExtractAttachmentsParameters>({
    ...extractAttachmentsOperationConfig,
    responseHandler,
    getErrorMessage: createStandardErrorHandler(
      t("extractAttachments.error", "Unable to process PDF attachments."),
    ),
  });
};
