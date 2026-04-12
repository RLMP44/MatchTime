import { render, screen, fireEvent } from "@testing-library/react";
import Display from "./Display";
import { timeForDisplay } from "../../utils/helpers";

// Mock translation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key })
}));

// Mock popup to avoid rendering entire thing
jest.mock("./popup/Popup", () => (props) => (
  <div data-testid="popup">Popup: {props.crud}</div>
));

// Mock timeForDisplay
jest.mock("../../utils/helpers", () => ({
  timeForDisplay: jest.fn((v) => `formatted(${v})`)
}));

describe("Display component", () => {
  const baseProps = {
    tab: "runner",
    headers: ["fName", "lName", "timeRaw"],
    fields: [],
    categories: [],
    setDisplayRecords: jest.fn(),
    fetchRecord: jest.fn(),
    update: jest.fn(),
    edit: jest.fn(),
    delete: jest.fn()
  };

  const sampleData = {
    id: 1,
    fName: "John",
    lName: "Doe",
    timeRaw: 100,
    handicap: 2
  };

  test("combines fName + lName into name and formats time", () => {
    render(<Display {...baseProps} data={sampleData} />);

    expect(screen.getByText("Doe, John")).toBeInTheDocument();
    expect(timeForDisplay).toHaveBeenCalledWith(100);
    expect(screen.getByText("formatted(100)")).toBeInTheDocument();
  });

  test("result tab applies handicap", () => {
    const props = {
      ...baseProps,
      tab: "result",
      headers: ["fName", "lName", "timeRaw"],
      data: sampleData
    };

    render(<Display {...props} />);

    // timeRaw * handicap = 100 * 2 = 200
    expect(timeForDisplay).toHaveBeenCalledWith(200);
    expect(screen.getByText("formatted(200)")).toBeInTheDocument();
  });

  test("result tab uses timeAdjusted header", () => {
    const props = {
      ...baseProps,
      tab: "result",
      headers: ["fName", "lName", "timeRaw"],
      data: null
    };

    render(<Display {...props} />);

    expect(screen.getByText("timeAdjusted")).toBeInTheDocument();
  });

  test("replaces fName + lName headers with name", () => {
    render(<Display {...baseProps} data={sampleData} />);

    // use getByText when element is present, otherwise it throws an error
    expect(screen.getByText("Doe, John")).toBeInTheDocument();
    // use queryByText to check for absence of element
    expect(screen.queryByText("fName")).not.toBeInTheDocument();
    expect(screen.queryByText("lName")).not.toBeInTheDocument();
  });

  test("opens popup when clicked (non-result tab)", () => {
    render(<Display {...baseProps} data={sampleData} />);

    // must use .closest to get the div that is clicked (bc not a button)
    fireEvent.click(screen.getByText("Doe, John").closest(".display-container"));

    expect(screen.getByTestId("popup")).toBeInTheDocument();
    expect(screen.getByText("Popup: edit")).toBeInTheDocument();
  });

  test("does NOT open popup when tab === 'result'", () => {
    render(<Display {...baseProps} tab="result" data={sampleData} />);

    fireEvent.click(screen.getByText("formatted(200)") || screen.getByText("Doe, John"));

    expect(screen.queryByTestId("popup")).not.toBeInTheDocument();
  });

  test("renders headers when isHeader is truthy", () => {
    render(<Display {...baseProps} isHeader={true} />);

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("timeRaw")).toBeInTheDocument();
  });
});
