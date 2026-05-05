import { test, expect } from '../fixtures/testdata';

// run in serial mode bc firefox is slower
// and db is deleted by time it reaches that point
test.describe.configure({ mode: 'serial' });

test.describe('Category tab flow', () => {
  test.beforeEach(async ({ testData }) => {
    await testData.deleteAllCategories();
  });

  test('add a category', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /category tab/i }).click();
    await page.getByRole('button', { name: /add category/i }).click();

    // add and submit category info
    await page.getByTestId(/popup-category/i).fill('F60-69');
    await page.getByRole('button', { name: /^add$/i }).click();

    // verify values have been updated properly
    const displayed = page.getByTestId(/category-row-/).filter({ has: page.getByText(/^F60-69$/) });
    await expect(displayed.getByText('F60-69')).toBeVisible();
    await expect(displayed.getByText(/^60$/)).toBeVisible();
    await expect(displayed.getByText(/^69$/)).toBeVisible();
  });

  test('delete a category', async ({ page, testData }) => {
    const cat1 = await testData.createCategory({ category: "F30-39" });

    await page.goto('/');
    await page.getByRole('button', { name: /category tab/i }).click();
    await expect(page.getByTestId(`category-row-${cat1.id}`)).toHaveCount(1);

    // click on cat1 and delete
    const row = await page.getByTestId(`category-row-${cat1.id}`).first();
    row.click();
    await page.getByRole('button', { name: /delete/i }).click();

    // verify values have been deleted
    await expect(page.getByTestId(`category-row-${cat1.id}`)).toHaveCount(0);
  });
});
