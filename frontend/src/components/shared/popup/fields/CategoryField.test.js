import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryField from "./CategoryField";

test("updates form data when a category is selected", async () => {
  const user = userEvent.setup();

  const categories = [
    { id: 1, category: "M40-49", sex: "M" },
    { id: 2, category: "F30-39", sex: "F" }
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
    "2"
  );

  expect(setFormData).toHaveBeenCalledWith({
    category: "2",
    sex: "F"
  });
});
