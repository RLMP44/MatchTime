import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryField from "./CategoryField";

test("updates form data when a category is selected", async () => {
  const user = userEvent.setup();

  const categories = [
    { category: "M40-49", sex: "M", handicap: 1.1, raceNo: 3 },
    { category: "F30-39", sex: "F", handicap: 1.2, raceNo: 4 }
  ];

  const setFormData = jest.fn();
  const formData = { category: "" };

  render(
    <CategoryField
      field="category"
      title="Category"
      categories={categories}
      formData={formData}
      setFormData={setFormData}
    />
  );

  await user.selectOptions(
    screen.getByRole("combobox"),
    "M40-49"
  );

  expect(setFormData).toHaveBeenCalledWith({
    category: "M40-49",
    sex: "M",
    handicap: 1.1,
    raceNo: 3
  });
});
