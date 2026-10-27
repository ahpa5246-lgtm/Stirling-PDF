import { describe, expect, it } from "vitest";
import { URL_TO_TOOL_MAP } from "@app/utils/urlMapping";
import { flattenPortfolioOperationConfig } from "@app/hooks/tools/attachments/useFlattenPortfolio";

describe("flatten portfolio tool", () => {
  it("opens the portfolio flattening tool from its direct URL", () => {
    expect(URL_TO_TOOL_MAP["/flatten-portfolio"]).toBe("flattenPortfolio");
  });
  it("sends the selected PDF to the portfolio flattening endpoint", () => {
    const file = new File(["pdf"], "portfolio.pdf");
    expect(flattenPortfolioOperationConfig.endpoint).toBe(
      "/api/v1/misc/flatten-portfolio",
    );
    const form = flattenPortfolioOperationConfig.buildFormData({}, file);
    expect([...form.keys()]).toEqual(["fileInput"]);
    expect(form.get("fileInput")).toBe(file);
  });
});
