import { Select, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { createToolFlow } from "@app/components/tools/shared/createToolFlow";
import { useBaseTool } from "@app/hooks/tools/shared/useBaseTool";
import {
  useScannerEffectParameters,
  useScannerEffectOperation,
} from "@app/hooks/tools/scannerEffect/useScannerEffect";
import { ScannerEffectParameters } from "@app/hooks/tools/scannerEffect/scannerEffectParameters";
import { BaseToolProps } from "@app/types/tool";
export default function ScannerEffect(props: BaseToolProps) {
  const { t } = useTranslation();
  const base = useBaseTool(
    "scannerEffect",
    useScannerEffectParameters,
    useScannerEffectOperation,
    props,
  );
  const options = {
    quality: ["low", "medium", "high"],
    rotation: ["none", "slight", "moderate", "severe"],
    colorspace: ["grayscale", "color"],
  } as const;
  const labels = {
    quality: t("scannerEffect.quality", "Scan quality"),
    rotation: t("scannerEffect.rotation", "Rotation"),
    colorspace: t("scannerEffect.colorspace", "Color mode"),
  };
  const select = <K extends keyof ScannerEffectParameters>(key: K) => (
    <Select
      key={key}
      label={labels[key]}
      value={base.params.parameters[key]}
      data={options[key].map((value) => ({ value, label: value }))}
      disabled={base.endpointLoading}
      onChange={(value) => {
        if (value && (options[key] as readonly string[]).includes(value))
          base.params.updateParameter(key, value as ScannerEffectParameters[K]);
      }}
    />
  );
  return createToolFlow({
    files: { selectedFiles: base.selectedFiles, isCollapsed: base.hasResults },
    steps: [
      {
        title: t("scannerEffect.settings", "Settings"),
        isCollapsed: base.settingsCollapsed,
        onCollapsedClick: base.settingsCollapsed
          ? base.handleSettingsReset
          : undefined,
        content: (
          <Stack gap="md">
            <Text size="sm">
              {t(
                "scannerEffect.help",
                "Create a scanned appearance from an existing PDF. Pages are rasterized; searchable text and interactive content may be lost.",
              )}
            </Text>
            {select("quality")}
            {select("rotation")}
            {select("colorspace")}
          </Stack>
        ),
      },
    ],
    executeButton: {
      text: t("scannerEffect.submit", "Apply Scanner Effect"),
      isVisible: !base.hasResults,
      loadingText: t("loading"),
      onClick: base.handleExecute,
      endpointEnabled: base.endpointEnabled,
      paramsValid: base.params.validateParameters(),
    },
    review: {
      isVisible: base.hasResults,
      operation: base.operation,
      title: t("scannerEffect.results", "Results"),
      onFileClick: base.handleThumbnailClick,
      onUndo: base.handleUndo,
    },
  });
}
