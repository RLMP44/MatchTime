import { test, expect } from '@playwright/test';

test.describe('Timer flow', () => {
  test('records a racer', async ({ page }) => {
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

  test('swaps a racer', async ({ page }) => {
    await page.goto('/');

    // start and advance timer
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForTimeout(500);

    // record bib # 4
    await page.getByRole('button', { name: '4' }).click();
    await page.getByRole('button', { name: /record/i }).click();

    // click on displayed record with bib # 4
    page.getByTestId('timer-row').filter({ hasText: '4' }).click();
    await page.getByLabel(/bib #:/i).fill('2');
    await page.getByRole('button', { name: /update/i }).click();

    // verify displayed record has been swapped for racer with bib # 2
    const updated = page.getByTestId('timer-row').filter({ hasText: 'Pierre, Maelle' });
    await expect(updated.getByText(/^2$/)).toBeVisible();
    await expect(updated.getByText('Pierre, Maelle')).toBeVisible();

    // navigate to result tab and verify racer bib is listed
    const resultsTab = page.getByRole('button', { name: /result tab/i });
    if (await resultsTab.isVisible()) { await resultsTab.click() };
    await expect(page.getByText(/^2$/)).toBeVisible();
    await expect(page.getByText(/^4$/)).not.toBeVisible();
  });
});
