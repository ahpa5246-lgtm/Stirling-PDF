import { Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { createToolFlow } from "@app/components/tools/shared/createToolFlow";
import { useBaseTool } from "@app/hooks/tools/shared/useBaseTool";
import {
  useRenameAttachmentParameters,
  useRenameAttachmentOperation,
} from "@app/hooks/tools/attachments/useRenameAttachment";
import { BaseToolProps } from "@app/types/tool";
export default function RenameAttachment(props: BaseToolProps) {
  const { t } = useTranslation();
  const base = useBaseTool(
    "renameAttachment",
    useRenameAttachmentParameters,
    useRenameAttachmentOperation,
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
            <TextInput
              label={t("attachments.newName", "New attachment name")}
              value={base.params.parameters.newName}
              onChange={(e) =>
                base.params.updateParameter("newName", e.currentTarget.value)
              }
              disabled={base.endpointLoading}
            />
          </Stack>
        ),
      },
    ],
    executeButton: {
      text: t("renameAttachment.submit", "Rename Attachment"),
      isVisible: !base.hasResults,
      loadingText: t("loading"),
      onClick: base.handleExecute,
      endpointEnabled: base.endpointEnabled,
      paramsValid: base.params.validateParameters(),
    },
    review: {
      isVisible: base.hasResults,
      operation: base.operation,
      title: t("renameAttachment.results", "Results"),
      onFileClick: base.handleThumbnailClick,
      onUndo: base.handleUndo,
    },
  });
}
