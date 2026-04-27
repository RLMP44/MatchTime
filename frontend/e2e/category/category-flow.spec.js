import { test, expect } from '@playwright/test';

test.describe('Category tab flow', () => {
  test('add a category', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /category tab/i }).click();
    await page.getByRole('button', { name: /add category/i }).click();

    // add and submit category info
    await page.getByTestId(/popup-category/i).fill('F60-69');
    await page.getByRole('combobox', { name: /race #:/i }).selectOption('2');
    await page.getByRole('radio', { name: 'F' }).check();
    await page.getByRole('button', { name: /^add$/i }).click();

    // verify values have been updated properly
    const displayed = page.getByTestId('category-row').filter({ hasText: 'F60-69' });
    await expect(displayed.getByText(/^2$/)).toBeVisible();
    await expect(displayed.getByText('F60-69')).toBeVisible();
  });

  test('delete a category', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /category tab/i }).click();

    // click on category M20-29 and delete
    await page.getByText('M30-39', { exact: true }).locator('xpath=..').click();
    await page.getByRole('button', { name: /delete/i }).click();

    // verify values have been deleted
    await expect(page.getByText('M30-39')).not.toBeVisible();
  });
});
