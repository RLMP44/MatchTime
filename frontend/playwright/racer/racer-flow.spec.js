import { test, expect } from '@playwright/test';

test.describe('Racer tab flow', () => {
  test('edit a racer', async ({ page }) => {
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

  test('add a racer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /racer tab/i }).click();
    await page.getByRole('button', { name: /add racer/i }).click();

    // add and submit racer info
    await page.getByTestId(/popup-bib/i).fill('6');
    await page.getByTestId(/popup-division/i).fill('15k');
    await page.getByTestId(/popup-city/i).fill('Rome');
    await page.getByTestId(/popup-age/i).fill('20');
    await page.getByTestId(/popup-fName/i).fill('Alicia');
    await page.getByTestId(/popup-lName/i).fill('Dessendre');
    await page.getByRole('combobox', { name: /category/i }).selectOption('F20-29');
    await page.getByRole('button', { name: /^add$/i }).click();

    // verify values have been updated properly
    const displayed = page.getByTestId('record-row').filter({ hasText: 'Dessendre, Alicia' });
    await expect(displayed.getByText(/^6$/)).toBeVisible();
    await expect(displayed.getByText('F20-29')).toBeVisible();
    await expect(displayed.getByText('15k')).toBeVisible();
    // handicap for a 20 y/o female should be 1
    await expect(displayed.getByText(/^1$/)).toBeVisible();
    await expect(displayed.getByText('Dessendre, Alicia')).toBeVisible();
  });

  test('delete a racer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /racer tab/i }).click();

    // click on racer with bib number 3 and delete
    await page.getByText(/^3$/, { exact: true }).locator('xpath=..').click();
    await page.getByRole('button', { name: /delete/i }).click();

    // verify values have been deleted
    await expect(page.getByText('Jeanne, Sciel')).not.toBeVisible();
    await expect(page.getByText(/^3$/)).not.toBeVisible();
  });
});
