import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DivisionField from "./DivisionField";

test("updates form data when a division is selected", async () => {
  const user = userEvent.setup();

  const divisions = [
    { id: 1, division: "15k", race_no: 3 },
    { id: 2, division: "10k", race_no: 4 }
  ];

  const setFormData = jest.fn();
  const formData = { division: "" };

  render(
    <DivisionField
      field="division"
      title="Division"
      divisions={divisions}
      formData={formData}
      setFormData={setFormData}
    />
  );

  await user.selectOptions(
    screen.getByRole("combobox"),
    "1"
  );

  expect(setFormData).toHaveBeenCalledWith({
    division: "1",
    race_no: 3
  });
});
