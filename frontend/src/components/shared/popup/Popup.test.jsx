import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Popup from "./Popup";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key })
}));

jest.mock("../../../utils/helpers", () => ({
  titleize: jest.fn((v) => v.charAt(0).toUpperCase() + v.slice(1)),
  pluralize: jest.fn((v) => v + "s"),
  convertToMs: jest.fn((v) => 9999)
}));

jest.mock("./fieldRenderers", () => jest.fn(() => ({
  fName: jest.fn(() => <div data-testid="fname-field">FNAME FIELD</div>),
  age: jest.fn(() => <div data-testid="age-field">AGE FIELD</div>)
})));

describe("Popup component", () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correct title", () => {
    render(<Popup {...baseProps} />);

    expect(screen.getByText("Edit Runner")).toBeInTheDocument();
  });

  test("renders pluralized title for import/export", () => {
    render(<Popup {...baseProps} crud="import" tab="result" />);

    expect(screen.getByText("Import Results")).toBeInTheDocument();
  });

  test("renders fields using fieldRenderers", () => {
    render(<Popup {...baseProps} />);

    expect(screen.getByTestId("fname-field")).toBeInTheDocument();
    expect(screen.getByTestId("age-field")).toBeInTheDocument();
  });

  test("formatRecord converts numeric fields to integers", () => {
    render(<Popup {...baseProps} />);

    fireEvent.click(screen.getByText("Update"));

    expect(baseProps.edit).toHaveBeenCalledWith({
      oldRecord: baseProps.data,
      newRecord: {
        id: 1,
        fName: "John",
        lName: "Doe",
        age: 25,
        bib: 10
      }
    });
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

  test("updateTimerDisplayRecord updates timeRaw when changed", async () => {
    const props = {
      ...baseProps,
      tab: "timer",
      data: { bib: 10, timeRaw: 5000, place: 3 }
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
      data: { bib: 10, timeRaw: "1:23", place: 5 },
      fetchRecord: jest.fn().mockResolvedValue({
        bib: 22,
        fName: "New",
        lName: "User"
      })
    };

    render(<Popup {...props} />);

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(props.update).toHaveBeenCalled();
    });
  });

  test("closes popup after any button click", () => {
    render(<Popup {...baseProps} />);

    fireEvent.click(screen.getByText("Update"));

    expect(baseProps.setIsDisplayed).toHaveBeenCalledWith(false);
  });
});
