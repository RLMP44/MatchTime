import { test, expect } from '@playwright/test';

test('Edit racer: open popup, change name & category, verify update', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /racer tab/i }).click();

  // click on racer with bib number 5
  await page.getByText(/^5$/, { exact: true }).locator('xpath=..').click();

  // update and submit last name and category (combobox for dropdown)
  await page.getByLabel(/last name/i).fill('Dessendre');
  await page.getByRole('combobox', { name: /category/i }).selectOption('M40-49');
  await page.getByRole('button', { name: /update/i }).click();

  // verify values have been updated properly
  await expect(page.getByText('Dessendre, Verso')).toBeVisible();
  await expect(page.getByText('M40-49')).toBeVisible();
});
