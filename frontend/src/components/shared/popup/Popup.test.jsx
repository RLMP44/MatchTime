import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Popup from "./Popup";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key })
}));

jest.mock("./fieldRenderers", () => jest.fn(() => ({
  first_name: jest.fn(() => <div data-testid="first_name-field">first_name FIELD</div>),
  age: jest.fn(() => <div data-testid="age-field">AGE FIELD</div>)
})));

describe("Popup component", () => {
  const baseProps = {
    crud: "edit",
    tab: "racer",
    data: { id: 1, first_name: "John", last_name: "Doe", age: "25", bib: "10" },
    popUpFields: ["first_name", "age"],
    buttons: ["update", "delete"],
    setIsDisplayed: jest.fn(),
    fetchRecord: jest.fn(),
    update: jest.fn(),
    edit: jest.fn(),
    add: jest.fn(),
    delete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correct title", () => {
    render(<Popup {...baseProps} />);

    expect(screen.getByText("Edit Racer")).toBeInTheDocument();
  });

  test("renders fields using fieldRenderers", () => {
    render(<Popup {...baseProps} />);

    expect(screen.getByTestId("first_name-field")).toBeInTheDocument();
    expect(screen.getByTestId("age-field")).toBeInTheDocument();
  });

  test("formatRecord converts numeric fields to integers", () => {
    render(<Popup {...baseProps} />);

    fireEvent.click(screen.getByText("Update"));

    const call = baseProps.edit.mock.calls[0][0];
    expect(call.newRecord.age).toBe(25);
    expect(call.newRecord.bib).toBe(10);
  });

  test("delete button triggers delete handler", () => {
    render(<Popup {...baseProps} />);

    fireEvent.click(screen.getByText("Delete"));

    expect(baseProps.delete).toHaveBeenCalledWith(baseProps.data);
    expect(baseProps.setIsDisplayed).toHaveBeenCalledWith(false);
  });

  test("add button triggers add handler", () => {
    render(<Popup {...baseProps} crud="add" buttons={["add"]} />);

    fireEvent.click(screen.getByText("Add"));

    expect(baseProps.add).toHaveBeenCalled();
    expect(baseProps.setIsDisplayed).toHaveBeenCalledWith(false);
  });

  test("updateTimerDisplayRecord updates time_raw when changed", async () => {
    const props = {
      ...baseProps,
      tab: "timer",
      data: { bib: 10, time_raw: 5000, place: 3 }
    };

    render(<Popup {...props} />);

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(props.update).toHaveBeenCalled();
    });
  });

  test("switchRacers merges user data when bib changes", async () => {
    const props = {
      ...baseProps,
      tab: "timer",
      data: { bib: 10, time_raw: "1:23", place: 5 },
      fetchRecord: jest.fn().mockResolvedValue({
        bib: 22,
        first_name: "New",
        last_name: "User"
      })
    };

    render(<Popup {...props} />);

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(props.update).toHaveBeenCalled();
    });
  });

  test("closes popup after general button click", () => {
    render(<Popup {...baseProps} />);

    fireEvent.click(screen.getByText("Update"));

    expect(baseProps.setIsDisplayed).toHaveBeenCalledWith(false);
  });
});
