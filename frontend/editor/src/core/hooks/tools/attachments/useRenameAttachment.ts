import { validateAttachmentName } from "@app/hooks/tools/attachments/attachmentTools";
import { useTranslation } from "react-i18next";
import { useBaseParameters } from "@app/hooks/tools/shared/useBaseParameters";
import {
  useToolOperation,
  defineSingleFileTool,
} from "@app/hooks/tools/shared/useToolOperation";
import { objectToFormData } from "@app/hooks/tools/shared/toolApiMapping";
import { createStandardErrorHandler } from "@app/utils/toolErrorHandler";
export type RenameAttachmentParameters = {
  attachmentName: string;
  newName: string;
};
const defaultParameters: RenameAttachmentParameters = {
  attachmentName: "",
  newName: "",
};
const validate = (params: RenameAttachmentParameters) =>
  validateAttachmentName(params.attachmentName) &&
  validateAttachmentName(params.newName);
export const useRenameAttachmentParameters = () =>
  useBaseParameters({
    defaultParameters,
    endpointName: "rename-attachment",
    validateFn: validate,
  });
export const renameAttachmentOperationConfig = defineSingleFileTool({
  operationType: "renameAttachment",
  endpoint: "/api/v1/misc/rename-attachment",
  defaultParameters,
  validateParams: validate,
  toApiParams: (params: RenameAttachmentParameters) => ({
    attachmentName: params.attachmentName,
    newName: params.newName,
  }),
  fromApiParams: (params) => ({ ...params }),
  buildFormData: (params: RenameAttachmentParameters, file: File) =>
    objectToFormData(
      { attachmentName: params.attachmentName, newName: params.newName },
      { fileInput: file },
    ),
});
export const useRenameAttachmentOperation = () => {
  const { t } = useTranslation();
  return useToolOperation<RenameAttachmentParameters>({
    ...renameAttachmentOperationConfig,
    getErrorMessage: createStandardErrorHandler(
      t("renameAttachment.error", "Unable to process PDF attachments."),
    ),
  });
};
