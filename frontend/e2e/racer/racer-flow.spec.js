import { test, expect } from '../fixtures/testdata';

// run in serial mode bc firefox is slower
// and db is deleted by time it reaches that point
test.describe.configure({ mode: 'serial' });

test.describe('Racer tab flow', () => {
  let racer1;
  let cat1;
  let cat2;
  let div1;
  let div2;

  test.beforeEach(async ({ testData }) => {
    await testData.deleteAllRacers();
    await testData.deleteAllCategories();
    await testData.deleteAllDivisions();

    cat1 = await testData.createCategory({ category: "M20-29" });
    cat2 = await testData.createCategory({ category: "F20-29" });

    div1 = await testData.createDivision({ race_no: 2, division: "15k" });
    div2 = await testData.createDivision({ race_no: 3, division: "10k" });

    racer1 = await testData.createRacer({
      first_name: "Verso",
      last_name: "Jermang",
      city: "Laos",
      age: 29,
      sex: "M",
      category_id: cat1.id,
      division_id: div2.id
    });
  });

  // test('edit a racer', async ({ page }) => {
  //   await page.goto('/');
  //   await page.getByRole('button', { name: /racer tab/i }).click();

  //   // click on racer1
  //   const row = page.getByTestId(/racer-row/i).filter({ hasText: `${racer1.last_name}, ${racer1.first_name}` });
  //   await expect(row).toBeVisible();
  //   await row.click();
  //   // await page.getByText(/^1$/, { exact: true }).locator('xpath=..').click();

  //   // update and submit last name and category (combobox for dropdown)
  //   await page.getByLabel(/last name/i).fill('Dessendre');
  //   await page.getByRole('combobox', { name: /category/i }).selectOption('M40-49');
  //   await page.getByRole('button', { name: /update/i }).click();

  //   // verify values have been updated properly
  //   await expect(page.getByText('Dessendre, Verso')).toBeVisible();
  //   await expect(page.getByText('M40-49')).toBeVisible();
  // });

  test('add a racer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /racer tab/i }).click();
    await page.getByRole('button', { name: /add racer/i }).click();
    await page.getByRole('heading', { name: 'Add Racer' }).waitFor();

    // add and submit racer info
    await page.getByTestId(/popup-city/i).fill('Rome');
    await page.getByTestId(/popup-age/i).fill('20');
    await page.getByTestId(/popup-email/i).fill('123@123.com');
    await page.getByTestId(/popup-first_name/i).fill('Alicia');
    await page.getByTestId(/popup-last_name/i).fill('Dessendre');
    await page.getByRole('combobox', { name: /division/i }).selectOption({ label: div1.division });
    await page.getByRole('combobox', { name: /category/i }).selectOption({ label: cat2.category });
    await page.getByRole('button', { name: /^add$/i }).click();

    // verify values have been updated properly
    const displayed = page.getByTestId(/racer-row-/).filter({ hasText: 'Dessendre, Alicia' });
    await expect(displayed.getByText(cat2.category)).toBeVisible();
    await expect(displayed.getByText(div1.division)).toBeVisible();

    // handicap for a 20 y/o female should be 1
    await expect(displayed.getByText(/^1$/)).toBeVisible();
    await expect(displayed.getByText('Dessendre, Alicia')).toBeVisible();
  });

  test('delete a racer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /racer tab/i }).click();

    // click on racer1 and delete
    await page.getByTestId(/^racer-row-\d+$/).first().waitFor();
    const row = page.getByTestId(`racer-row-${racer1.id}`);
    await expect(row).toBeVisible();
    await row.click();
    await page.getByRole('button', { name: /delete/i }).click();

    // verify values have been deleted
    await expect(row).not.toBeVisible();
  });
});
