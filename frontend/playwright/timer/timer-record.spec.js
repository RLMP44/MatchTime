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

  test('deletes a recorded racer and reduces place by 1', async ({ page }) => {
    await page.goto('/');

    // start and advance timer
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForTimeout(500);

    // record bibs # 4 & # 3
    await page.getByRole('button', { name: '4' }).click();
    await page.getByRole('button', { name: /record/i }).click();
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: /record/i }).click();

    // navigate to result tab and verify place 1 and 2 are filled
    const resultsTab = page.getByRole('button', { name: /result tab/i });
    if (await resultsTab.isVisible()) { await resultsTab.click() };
    const bib4 = page.getByTestId('result-row').filter({ hasText: 'Acuse, Lune' });
    const bib3 = page.getByTestId('result-row').filter({ hasText: 'Jeanne, Sciel' });
    await expect(bib4.getByText(/^1$/)).toBeVisible();
    await expect(bib3.getByText(/^2$/)).toBeVisible();

    // switch to timer tab and delete record of bib # 4
    const timerTab = page.getByRole('button', { name: /timer tab/i });
    if (await timerTab.isVisible()) { await timerTab.click() };
    const racer = page.getByTestId('timer-row').filter({ hasText: 'Acuse, Lune' });
    await racer.click();
    await page.getByRole('button', { name: /delete/i }).click();
    await expect(racer).not.toBeVisible();

    // verify racer with bib 3 now has 1st place in both tabs
    const updatedTimer = page.getByTestId('timer-row').filter({ hasText: 'Jeanne, Sciel' });
    await expect(updatedTimer.getByText(/^1$/)).toBeVisible();
    await expect(page.getByText('Acuse, Lune')).not.toBeVisible();
    if (await resultsTab.isVisible()) { await resultsTab.click() };
    const updatedResults = page.getByTestId('result-row').filter({ hasText: 'Jeanne, Sciel' });
    await expect(updatedResults.getByText(/^1$/)).toBeVisible();
    await expect(page.getByText('Acuse, Lune')).not.toBeVisible();
  });
});
