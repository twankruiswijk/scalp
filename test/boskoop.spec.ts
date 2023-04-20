import { test, expect, Page } from '../fixtures/test';

async function authenticateAccount(page: Page) {
  await page.goto('https://middenboskoop.baanreserveren.nl/');
  await page.locator('input[name="username"]').click();
  await page
    .locator('input[name="username"]')
    .fill(process.env.BOSKOOP_BAANRESERVEREN_ACCOUNT!);
  await page.locator('input[name="password"]').click();
  await page
    .locator('input[name="password"]')
    .fill(process.env.BOSKOOP_BAANRESERVEREN_PASSWORD!);
  await page.getByRole('button', { name: 'Inloggen' }).click();
}

test(authenticateAccount)('test', async ({ page }) => {
  await page.goto('https://middenboskoop.baanreserveren.nl/');
});
