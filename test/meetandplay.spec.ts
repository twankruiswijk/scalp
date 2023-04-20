import { Page, expect, test } from '../fixtures/test';

const bookUrl = 'https://meetandplay.nl/club/62745';

async function authenticateAccount(page: Page) {
  await page.goto('https://meetandplay.nl/inloggen');
  await page.waitForSelector('.bcpGDPRLightbox');
  await page.getByRole('button', { name: 'Alle cookies accepteren' }).click();
  await page.getByLabel('E-mail *').click();
  await page.getByLabel('E-mail *').fill(process.env.KNLTB_EMAIL!);
  await page.getByLabel('Wachtwoord *').click();
  await page.getByLabel('Wachtwoord *').fill(process.env.KNLTB_PASSWORD!);
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(
    page.getByRole('link', { name: 'Mijn boekingen' })
  ).toBeVisible();
}

test(authenticateAccount)('test', async ({ page }) => {
  await page.goto(bookUrl);

  await page.getByText('15:30').click();
  await page
    .locator('a')
    .filter({
      hasText:
        '20 apr. 15:30 - 16:30 60 minuten JPB Padelbaan 60 minuten · 15:30 - 16:30 € 20,0',
    })
    .getByRole('button', { name: 'Boeken' })
    .click();

  await page.getByRole('checkbox', { name: /Ik ga akkoord met de/ }).check();

  await page.getByRole('button', { name: /Betaling starten/ }).click();
});
