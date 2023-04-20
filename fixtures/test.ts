import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { Page } from 'playwright';

export * from '@playwright/test';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex;
      const fileName = path.resolve(
        test.info().project.outputDir,
        `.auth/${id}.json`
      );

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined });
      const account = await acquireAccount(id);
      await authenticateAccount(page, account);

      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
    },
    { scope: 'worker' },
  ],
});

async function authenticateAccount(
  page: Page,
  account: { username: string; password: string }
) {
  await page.goto('https://meetandplay.nl/inloggen');
  await page.waitForSelector('.bcpGDPRLightbox');
  await page.getByRole('button', { name: 'Alle cookies accepteren' }).click();
  await page.getByLabel('E-mail *').click();
  await page.getByLabel('E-mail *').fill(account.username);
  await page.getByLabel('Wachtwoord *').click();
  await page.getByLabel('Wachtwoord *').fill(account.password);
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(
    page.getByRole('link', { name: 'Mijn boekingen' })
  ).toBeVisible();
}

type Account = {
  username: string;
  password: string;
};

async function acquireAccount(id: number): Promise<Account> {
  // for now we simply use the asme account always
  return {
    username: process.env.KNLTB_EMAIL!,
    password: process.env.KNLTB_PASSWORD!,
  };
}
