import playwright from "playwright";

async function main() {
  const browser = await playwright.chromium.launch({
    headless: false, // setting this to true will not run the UI
  });

  const page = await browser.newPage();
  await page.goto("https://nu.nl");
  await page.waitForTimeout(5000); // wait for 5 seconds
  await browser.close();
}

main();
