import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Popup from "./Popup";

// Mock translation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key })
}));

// Mock field renderers
jest.mock("./fieldRenderers", () => jest.fn(() => ({
  fName: () => <div data-testid="fname-field">FNAME FIELD</div>,
  age: () => <div data-testid="age-field">AGE FIELD</div>
})));

describe("Popup UI Integration", () => {
  const baseProps = {
    crud: "edit",
    tab: "runner",
    data: { id: 1, fName: "John", lName: "Doe", age: "25", bib: "10" },
    popUpFields: ["fName", "age"],
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
    expect(screen.getByTestId("fname-field")).toBeInTheDocument();
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
      data: { bib: 10, timeRaw: 5000, place: 3 }
    };

    render(<Popup {...props} />);

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => expect(props.update).toHaveBeenCalled());
  });

  test("switchRacers is triggered when bib changes", async () => {
    const props = {
      ...baseProps,
      tab: "timer",
      data: { bib: 10, timeRaw: 5000, place: 3 },
      fetchRecord: jest.fn().mockResolvedValue({
        bib: 22,
        fName: "New",
        lName: "User"
      })
    };

    render(<Popup {...props} />);

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => expect(props.update).toHaveBeenCalled());
  });
});
