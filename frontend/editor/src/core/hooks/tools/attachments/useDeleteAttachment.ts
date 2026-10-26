import { validateAttachmentName } from "@app/hooks/tools/attachments/attachmentTools";
import { useTranslation } from "react-i18next";
import { useBaseParameters } from "@app/hooks/tools/shared/useBaseParameters";
import {
  useToolOperation,
  defineSingleFileTool,
} from "@app/hooks/tools/shared/useToolOperation";
import { objectToFormData } from "@app/hooks/tools/shared/toolApiMapping";
import { createStandardErrorHandler } from "@app/utils/toolErrorHandler";
export type DeleteAttachmentParameters = { attachmentName: string };
const defaultParameters: DeleteAttachmentParameters = { attachmentName: "" };
const validate = (params: DeleteAttachmentParameters) =>
  validateAttachmentName(params.attachmentName);
export const useDeleteAttachmentParameters = () =>
  useBaseParameters({
    defaultParameters,
    endpointName: "delete-attachment",
    validateFn: validate,
  });
export const deleteAttachmentOperationConfig = defineSingleFileTool({
  operationType: "deleteAttachment",
  endpoint: "/api/v1/misc/delete-attachment",
  defaultParameters,
  validateParams: validate,
  toApiParams: (params: DeleteAttachmentParameters) => ({
    attachmentName: params.attachmentName,
  }),
  fromApiParams: (params) => ({ ...params }),
  buildFormData: (params: DeleteAttachmentParameters, file: File) =>
    objectToFormData(
      { attachmentName: params.attachmentName },
      { fileInput: file },
    ),
});
export const useDeleteAttachmentOperation = () => {
  const { t } = useTranslation();
  return useToolOperation<DeleteAttachmentParameters>({
    ...deleteAttachmentOperationConfig,
    getErrorMessage: createStandardErrorHandler(
      t("deleteAttachment.error", "Unable to process PDF attachments."),
    ),
  });
};
