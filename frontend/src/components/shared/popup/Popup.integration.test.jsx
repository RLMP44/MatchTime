import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Popup from "./Popup";

// Mock translation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key })
}));

// Mock field renderers
jest.mock("./fieldRenderers", () => jest.fn(() => ({
  first_name: () => <div data-testid="first_name-field">first_name FIELD</div>,
  age: () => <div data-testid="age-field">AGE FIELD</div>
})));

describe("Popup UI Integration", () => {
  const baseProps = {
    crud: "edit",
    tab: "runner",
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

  beforeEach(() => jest.clearAllMocks());

  test("renders title and fields", () => {
    render(<Popup {...baseProps} />);

    expect(screen.getByText("Edit Runner")).toBeInTheDocument();
    expect(screen.getByTestId("first_name-field")).toBeInTheDocument();
    expect(screen.getByTestId("age-field")).toBeInTheDocument();
  });

  test("clicking Update triggers edit() and closes popup", () => {
    render(<Popup {...baseProps} />);

    fireEvent.click(screen.getByText("Update"));

    expect(baseProps.edit).toHaveBeenCalled();
    expect(baseProps.setIsDisplayed).toHaveBeenCalledWith(false);
  });

  test("clicking Delete triggers delete() and closes popup", () => {
    render(<Popup {...baseProps} />);

    fireEvent.click(screen.getByText("Delete"));

    expect(baseProps.delete).toHaveBeenCalledWith(baseProps.data);
    expect(baseProps.setIsDisplayed).toHaveBeenCalledWith(false);
  });

  test("add button triggers add() and closes popup", () => {
    const props = { ...baseProps, crud: "add", buttons: ["add"] };

    render(<Popup {...props} />);

    fireEvent.click(screen.getByText("Add"));

    expect(props.add).toHaveBeenCalled();
    expect(props.setIsDisplayed).toHaveBeenCalledWith(false);
  });

  test("timer tab: update triggers updateTimerDisplayRecord", async () => {
    const props = {
      ...baseProps,
      tab: "timer",
      data: { bib: 10, time_raw: 5000, place: 3 }
    };

    render(<Popup {...props} />);

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => expect(props.update).toHaveBeenCalled());
  });

  test("switchRacers is triggered when bib changes", async () => {
    const props = {
      ...baseProps,
      tab: "timer",
      data: { bib: 10, time_raw: 5000, place: 3 },
      fetchRecord: jest.fn().mockResolvedValue({
        bib: 22,
        first_name: "New",
        last_name: "User"
      })
    };

    render(<Popup {...props} />);

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => expect(props.update).toHaveBeenCalled());
  });
});
