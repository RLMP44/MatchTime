import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Timer from "./Timer";

// disable flags for intentional console.warns
beforeEach(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

// create default props and user to be used in testing
// use jest.fn() to create a fake function to allow inspection of arguments
// and to simply see if the function is called or not
function setup(overrides = {}) {
  const props = {
    timer: { timeInMs: 90500, startTimer: jest.fn() },
    place: 1,
    setPlace: jest.fn(),
    update: jest.fn(),
    fetchRecord: jest.fn(),
    buttonText: "start",
    setButtonText: jest.fn(),
    records: [],
    ...overrides
  };

  // create an instance of user by using userEvent.setup()
  // to create asynchronous simulation of real browser behavior
  const user = userEvent.setup();
  render(<Timer {...props} />);
  return { user, props };
}


describe("Timer Component", () => {
  test("displays formatted time", () => {
    setup();
    expect(screen.getByText("Time: 00:01:30:50")).toBeInTheDocument();
  });

  test("displays place and empty bib initially", () => {
    setup();
    expect(screen.getByText("Place: 1")).toBeInTheDocument();
    expect(screen.getByText("Bib #:")).toBeInTheDocument();
  });

  test("clicking # buttons builds bib # and fetches racer record", async () => {
    const { user, props } = setup();

    // creates a mock retrieved value (racer record)
    props.fetchRecord.mockResolvedValue({
      id: 10,
      bib: 12,
      fName: "John",
      lName: "Doe",
      place: 1,
      timeRaw: 90500
    });

    await user.click(screen.getByText("1"));
    await user.click(screen.getByText("2"));

    expect(screen.getByText("Bib #: 12")).toBeInTheDocument();
    expect(props.fetchRecord).toHaveBeenCalledWith(12);
  });

  test("shows 'Not Found' when fetchRecord returns null", async () => {
    const { user, props } = setup();

    props.fetchRecord.mockResolvedValue(null);

    await user.click(screen.getByText("5"));

    expect(screen.getByText("Name: Not Found")).toBeInTheDocument();
  });

  test("clicking Start triggers startTimer and updates button text", async () => {
    const { user, props } = setup({ buttonText: "start" });

    await user.click(screen.getByText("Start"));

    expect(props.timer.startTimer).toHaveBeenCalled();
    expect(props.setButtonText).toHaveBeenCalledWith("record");
  });

  test("clicking Record updates record and increments place", async () => {
    const { user, props } = setup({
      buttonText: "record",
      records: [],
      place: 1
    });

    // enter bib and retrieve mock record
    props.fetchRecord.mockResolvedValue({
      id: 1,
      bib: 7,
      fName: "Amy",
      lName: "Smith",
      place: 1,
      timeRaw: 90500
    });

    await user.click(screen.getByText("7"));

    await user.click(screen.getByText("Record"));

    expect(props.update).toHaveBeenCalled();
    expect(props.setPlace).toHaveBeenCalledWith(expect.any(Function));
  });

  test("clicking Clear resets bib and name", async () => {
    const { user, props } = setup();

    props.fetchRecord.mockResolvedValue({
      id: 1,
      bib: 3,
      fName: "Sam",
      lName: "Lee",
      place: 1,
      timeRaw: 90500
    });

    await user.click(screen.getByText("3"));
    expect(screen.getByText("Bib #: 3")).toBeInTheDocument();

    await user.click(screen.getByText("Clear"));

    expect(screen.getByText("Bib #:")).toBeInTheDocument();
    expect(screen.getByText("Name:")).toBeInTheDocument();
  });

  test("Same Time uses last record's time/place", async () => {
    const lastRecord = { place: 5, timeRaw: 5000 };

    const { user, props } = setup({
      buttonText: "record",
      records: [lastRecord]
    });

    props.fetchRecord.mockResolvedValue({
      id: 2,
      bib: 9,
      fName: "Zoe",
      lName: "Kim",
      place: 1,
      timeRaw: 90500
    });

    await user.click(screen.getByText("9"));
    await user.click(screen.getByText(/same\s*time/i));

    expect(props.update).toHaveBeenCalledWith({
      oldRecord: expect.any(Object),
      newRecord: expect.objectContaining({
        timeRaw: 5000,
        place: 5,
        bib: 9
      })
    });

    expect(props.setPlace).toHaveBeenCalled();
  });

  test("prevents recording if racer already exists", async () => {
    const { user, props } = setup({
      buttonText: "record",
      records: [{ bib: 4 }]
    });

    props.fetchRecord.mockResolvedValue({
      id: 1,
      bib: 4,
      fName: "Test",
      lName: "User",
      place: 1,
      timeRaw: 90500
    });

    await user.click(screen.getByText("4"));
    await user.click(screen.getByText("Record"));

    expect(props.update).not.toHaveBeenCalled();
  });
});
