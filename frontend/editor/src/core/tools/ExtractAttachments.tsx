import { useTranslation } from "react-i18next";
import { createToolFlow } from "@app/components/tools/shared/createToolFlow";
import { useBaseTool } from "@app/hooks/tools/shared/useBaseTool";
import {
  useExtractAttachmentsParameters,
  useExtractAttachmentsOperation,
} from "@app/hooks/tools/attachments/useExtractAttachments";
import { BaseToolProps } from "@app/types/tool";
export default function ExtractAttachments(props: BaseToolProps) {
  const { t } = useTranslation();
  const base = useBaseTool(
    "extractAttachments",
    useExtractAttachmentsParameters,
    useExtractAttachmentsOperation,
    props,
  );
  return createToolFlow({
    files: { selectedFiles: base.selectedFiles, isCollapsed: base.hasResults },
    steps: [],
    executeButton: {
      text: t("extractAttachments.submit", "Extract Attachments"),
      isVisible: !base.hasResults,
      loadingText: t("loading"),
      onClick: base.handleExecute,
      endpointEnabled: base.endpointEnabled,
      paramsValid: base.params.validateParameters(),
    },
    review: {
      isVisible: base.hasResults,
      operation: base.operation,
      title: t("extractAttachments.results", "Results"),
      onFileClick: base.handleThumbnailClick,
      onUndo: base.handleUndo,
    },
  });
}
