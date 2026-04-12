import { render, fireEvent } from "@testing-library/react";
import Timer from "./Timer";

describe("Timer UI Integration", () => {
  test("clicking start-record button calls startTimer and updates label", () => {
    const startTimer = jest.fn();
    const setButtonText = jest.fn();
    const props = {
      timer: { timeInMs: 0, startTimer },
      update: jest.fn(),
      place: 1,
      setPlace: jest.fn(),
      fetchRecord: jest.fn(),
      buttonText: "start",
      setButtonText,
      records: []
    };

    render(<Timer {...props} />);

    const startButton = document.getElementById("start-record-button");
    expect(startButton.textContent.toLowerCase()).toContain("start");

    fireEvent.click(startButton);

    expect(startTimer).toHaveBeenCalled();
    expect(setButtonText).toHaveBeenCalledWith("record");
  });
});
