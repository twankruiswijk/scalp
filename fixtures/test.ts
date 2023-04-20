import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { Page } from 'playwright';

export * from '@playwright/test';

export const test = (loginFn: (page: Page) => Promise<void>) =>
  baseTest.extend<{}, { workerStorageState: string }>({
    // Use the same storage state for all tests in this worker.
    storageState: ({ workerStorageState }, use) => use(workerStorageState),

    // Authenticate once per worker with a worker-scoped fixture.
    workerStorageState: [
      async ({ browser }, use) => {
        // Use parallelIndex as a unique identifier for each worker.
        const id = baseTest.info().parallelIndex;
        const fileName = path.resolve(
          baseTest.info().project.outputDir,
          `.auth/${id}.json`
        );

        if (fs.existsSync(fileName)) {
          // Reuse existing authentication state if any.
          await use(fileName);
          return;
        }

        // Important: make sure we authenticate in a clean environment by unsetting storage state.
        const page = await browser.newPage({ storageState: undefined });
        await loginFn(page);

        await page.context().storageState({ path: fileName });
        await page.close();
        await use(fileName);
      },
      { scope: 'worker' },
    ],
  });
