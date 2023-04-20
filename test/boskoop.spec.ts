import { add, format } from 'date-fns';
import { test, expect, Page } from '../fixtures/test';
import sendGrid from '@sendgrid/mail';

sendGrid.setApiKey(process.env.SENDGRID_APIKEY!);

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

const desiredStartTimes = ['19:30', '20:00', '20:30'];

test(authenticateAccount)('test', async ({ page }) => {
  await page.goto(
    'https://middenboskoop.baanreserveren.nl/reservations/2023-04-28/sport/1272'
  );

  await page
    .locator('tr[data-time]', {
      has: page.locator('[type="free"]'),
      hasText: new RegExp(desiredStartTimes.join('|')),
    })
    .locator('[type="free"]')
    .first()
    .click({ timeout: 1000 });

  await page.locator('select[name="players\\[2\\]"]').selectOption('-1');
  await page.locator('select[name="players\\[3\\]"]').selectOption('-1');
  await page.locator('select[name="players\\[4\\]"]').selectOption('-1');
  await page.getByRole('button', { name: 'Verder' }).click();
  await page.getByRole('button', { name: 'Bevestigen' }).click();
  await page.getByRole('button', { name: 'Betalen' }).click();

  await expect(page).toHaveURL(/https:\/\/www.mollie.com\/checkout\//);

  const linkExpiryDate = format(
    add(new Date(), { minutes: 10 }),
    'dd-MM-yyyy HH:mm'
  );
  await sendGrid.send({
    from: 'twan.kruiswijk@xebia.com',
    to: 'bdenhollander@xebia.com',
    subject: 'Padelbaan gereserveerd!',
    html: `<div>Er is een baan voor je gereserveerd. Betaal via <a href="${page.url()}">deze link</a>. Je hebt tot ${linkExpiryDate} om te betalen</div>`,
  });
});
