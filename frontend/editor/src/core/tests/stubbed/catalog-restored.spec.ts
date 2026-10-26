import { test, expect } from "@app/tests/helpers/stub-test-base";

test.describe("restored PDF tools", () => {
  for (const [path, name] of [
    ["/extract-attachments", "Extract Attachments"],
    ["/rename-attachment", "Rename Attachment"],
    ["/delete-attachment", "Delete Attachment"],
    ["/scanner-effect", "Apply Scanner Effect"],
  ]) {
    test(`${path} opens its tool and cannot run without a file`, async ({
      page,
    }) => {
      await page.goto(path);
      const run = page
        .getByRole("button", { name: new RegExp(name, "i") })
        .last();
      await expect(run).toBeVisible();
      await expect(run).toBeDisabled();
    });
  }
  test("PDF-to-Word shortcut opens its conversion settings", async ({
    page,
  }) => {
    await page.goto("/pdf-to-word");
    await expect(
      page.getByRole("button", { name: /convert files/i }).last(),
    ).toBeDisabled();
    await expect(page.getByTestId("convert-from-dropdown")).toBeVisible();
  });
});
