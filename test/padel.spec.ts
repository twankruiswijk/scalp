import { test } from '@playwright/test';

const bookUrl = 'https://meetandplay.nl/club/62745';

test('test', async ({ page }) => {
  await page.goto(bookUrl);
  await page
    .getByRole('button', { name: 'Alle cookies accepteren' })
    .click({ timeout: 5000 });

  await page.getByText('15:30').click();
  await page
    .locator('a')
    .filter({
      hasText:
        '20 apr. 15:30 - 16:30 60 minuten JPB Padelbaan 60 minuten · 15:30 - 16:30 € 20,0',
    })
    .getByRole('button', { name: 'Boeken' })
    .click();
});
