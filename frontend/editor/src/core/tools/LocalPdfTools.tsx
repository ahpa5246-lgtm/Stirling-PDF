import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { createToolFlow } from "@app/components/tools/shared/createToolFlow";
import { useBaseTool } from "@app/hooks/tools/shared/useBaseTool";
import { useBaseParameters } from "@app/hooks/tools/shared/useBaseParameters";
import {
  defineCustomTool,
  useToolOperation,
} from "@app/hooks/tools/shared/useToolOperation";
import {
  LOCAL_PDF_TOOLS,
  transformPdf,
  type LocalPdfToolId,
} from "@app/hooks/tools/localPdf/localPdf";
import type { BaseToolProps } from "@app/types/tool";

const defaultParameters = {};
export function createLocalPdfTool(id: LocalPdfToolId) {
  const config = defineCustomTool({
    operationType: id,
    defaultParameters,
    customProcessor: async (
      _params: typeof defaultParameters,
      files: File[],
    ) => {
      const outputs: File[] = [];
      for (const file of files) {
        const bytes = await transformPdf(
          id,
          new Uint8Array(await file.arrayBuffer()),
        );
        outputs.push(
          new File(
            [new Uint8Array(bytes)],
            `${file.name.replace(/\.pdf$/i, "")}_${id}.pdf`,
            { type: "application/pdf" },
          ),
        );
      }
      return { files: outputs, consumedAllInputs: true };
    },
  });
  function useParameters() {
    return useBaseParameters({ defaultParameters, endpointName: "" });
  }
  function useOperation() {
    return useToolOperation(config);
  }
  function LocalTool(props: BaseToolProps) {
    const { t } = useTranslation();
    const base = useBaseTool(id, useParameters, useOperation, props);
    return createToolFlow({
      files: {
        selectedFiles: base.selectedFiles,
        isCollapsed: base.hasResults,
      },
      steps: [
        {
          title: t("localPdf.noticeTitle", "Before processing"),
          content: (
            <Text size="sm">
              {t(
                "localPdf.notice",
                "Processed in this browser. Save a copy of your original. Rewriting a PDF invalidates digital signatures; page extraction and reordering may discard forms, bookmarks and document metadata.",
              )}
            </Text>
          ),
        },
      ],
      executeButton: {
        text: t(`home.${id}.title`, LOCAL_PDF_TOOLS[id].title),
        isVisible: !base.hasResults,
        onClick: base.handleExecute,
        loadingText: t("loading"),
        endpointEnabled: true,
        paramsValid: true,
      },
      review: {
        isVisible: base.hasResults || !!base.operation.errorMessage,
        operation: base.operation,
        title: t("flattenPortfolio.results", "Results"),
        onFileClick: base.handleThumbnailClick,
        onUndo: base.handleUndo,
      },
    });
  }
  return LocalTool;
}
