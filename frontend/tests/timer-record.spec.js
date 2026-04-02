import { test, expect } from '@playwright/test';

test('Timer flow: start timer, enter bib #, record time, check result', async ({ page }) => {
  await page.goto('/');

  // start and advance timer
  await page.getByRole('button', { name: /start/i }).click();
  await page.waitForTimeout(500);

  // record bib # 10
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: /record/i }).click();

  // navigate to result tab and verify racer bib is listed
  const resultsTab = page.getByRole('button', { name: /result tab/i });
  if (await resultsTab.isVisible()) { await resultsTab.click() };
  await expect(page.getByText('10')).toBeVisible();
});
