import { test, expect } from "@playwright/test";

const bookUrl = "https://meetandplay.nl/?sport=padel";

test("test", async ({ page }) => {
  await page.goto(bookUrl);
  await page
    .getByRole("button", { name: "Alle cookies accepteren" })
    .click({ timeout: 5000 });
  await page.getByPlaceholder("Waar (Postcode of Plaats)").click();
  await page.getByPlaceholder("Waar (Postcode of Plaats)").fill("Schagen");
  await page.getByRole("button", { name: "Zoek" }).click();
  await page
    .getByRole("link", {
      name: "9 KM T.P. Warmenhuizen Warmenhuizen 2 padelbanen Boeken",
    })
    .click();
  await page.getByText("15:30").click();
  await page
    .locator("a")
    .filter({
      hasText:
        "20 apr. 15:30 - 16:30 60 minuten JPB Padelbaan 60 minuten · 15:30 - 16:30 € 20,0",
    })
    .getByRole("button", { name: "Boeken" })
    .click();
});
