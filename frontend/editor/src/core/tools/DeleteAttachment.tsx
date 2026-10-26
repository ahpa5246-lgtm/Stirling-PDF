import { Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { createToolFlow } from "@app/components/tools/shared/createToolFlow";
import { useBaseTool } from "@app/hooks/tools/shared/useBaseTool";
import {
  useDeleteAttachmentParameters,
  useDeleteAttachmentOperation,
} from "@app/hooks/tools/attachments/useDeleteAttachment";
import { BaseToolProps } from "@app/types/tool";
export default function DeleteAttachment(props: BaseToolProps) {
  const { t } = useTranslation();
  const base = useBaseTool(
    "deleteAttachment",
    useDeleteAttachmentParameters,
    useDeleteAttachmentOperation,
    props,
  );
  return createToolFlow({
    files: { selectedFiles: base.selectedFiles, isCollapsed: base.hasResults },
    steps: [
      {
        title: t("attachments.settings", "Settings"),
        isCollapsed: base.settingsCollapsed,
        onCollapsedClick: base.settingsCollapsed
          ? base.handleSettingsReset
          : undefined,
        content: (
          <Stack gap="md">
            <TextInput
              label={t("attachments.name", "Exact attachment name")}
              value={base.params.parameters.attachmentName}
              onChange={(e) =>
                base.params.updateParameter(
                  "attachmentName",
                  e.currentTarget.value,
                )
              }
              disabled={base.endpointLoading}
            />
          </Stack>
        ),
      },
    ],
    executeButton: {
      text: t("deleteAttachment.submit", "Delete Attachment"),
      isVisible: !base.hasResults,
      loadingText: t("loading"),
      onClick: base.handleExecute,
      endpointEnabled: base.endpointEnabled,
      paramsValid: base.params.validateParameters(),
    },
    review: {
      isVisible: base.hasResults,
      operation: base.operation,
      title: t("deleteAttachment.results", "Results"),
      onFileClick: base.handleThumbnailClick,
      onUndo: base.handleUndo,
    },
  });
}
