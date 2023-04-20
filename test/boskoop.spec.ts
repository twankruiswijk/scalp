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
  await page
    .getByRole('row', { name: '17:30 17:30 17:30 17:30', exact: true })
    .getByTitle('Padel indoor 3')
    .click();
  await page.locator('select[name="players\\[2\\]"]').selectOption('-1');
  await page.locator('select[name="players\\[3\\]"]').selectOption('-1');
  await page.locator('select[name="players\\[4\\]"]').selectOption('-1');
  await page.getByRole('button', { name: 'Verder' }).click();
  await page.getByRole('button', { name: 'Bevestigen' }).click();
  await page.getByRole('button', { name: 'Betalen' }).click();

  await expect(page).toHaveURL(/https:\/\/www.mollie.com\/checkout\//);
  // TODO notify Bart
  console.log('Now at', page.url());
});
