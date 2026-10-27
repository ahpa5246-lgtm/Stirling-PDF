import { useTranslation } from "react-i18next";
import { createToolFlow } from "@app/components/tools/shared/createToolFlow";
import { useBaseTool } from "@app/hooks/tools/shared/useBaseTool";
import {
  useFlattenPortfolioParameters,
  useFlattenPortfolioOperation,
} from "@app/hooks/tools/attachments/useFlattenPortfolio";
import { BaseToolProps } from "@app/types/tool";
export default function FlattenPortfolio(props: BaseToolProps) {
  const { t } = useTranslation();
  const base = useBaseTool(
    "flattenPortfolio",
    useFlattenPortfolioParameters,
    useFlattenPortfolioOperation,
    props,
  );
  return createToolFlow({
    files: { selectedFiles: base.selectedFiles, isCollapsed: base.hasResults },
    steps: [],
    executeButton: {
      text: t("flattenPortfolio.submit", "Flatten Portfolio"),
      isVisible: !base.hasResults,
      loadingText: t("loading"),
      onClick: base.handleExecute,
      endpointEnabled: base.endpointEnabled,
      paramsValid: base.params.validateParameters(),
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
