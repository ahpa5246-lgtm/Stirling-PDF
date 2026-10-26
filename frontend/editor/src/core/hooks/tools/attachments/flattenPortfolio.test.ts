import { describe, expect, it } from "vitest";
import { URL_TO_TOOL_MAP } from "@app/utils/urlMapping";

describe("flatten portfolio tool", () => {
  it("opens the portfolio flattening tool from its direct URL", () => {
    expect(URL_TO_TOOL_MAP["/flatten-portfolio"]).toBe("flattenPortfolio");
  });
});
