import { act } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import TimeKeeper from "./TimeKeeper";

let now = 1000;
jest.spyOn(global.performance, "now").mockImplementation(() => now);

function setup() {
  let latestTimer;

  render(
    <TimeKeeper>
      {(timer) => {
        latestTimer = timer;
        return <div data-testid="child" />;
      }}
    </TimeKeeper>,
    { wrapper: ({ children }) => <>{children}</> } // no StrictMode
  );

  return () => latestTimer;
}

describe("TimeKeeper", () => {
  test("renders children and provides timer object", () => {
    const timer = setup();

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(timer()).toHaveProperty("startTimer");
    expect(timer()).toHaveProperty("stopTimer");
    expect(timer()).toHaveProperty("timeInMs");
    expect(timer()).toHaveProperty("timerOn");
  });

  test("startTimer sets timerOn to true and initializes time", () => {
    const timer = setup();

    expect(timer().timerOn).toBe(false);

    act(() => {
      timer().startTimer();
    });

    expect(timer().timerOn).toBe(true);
  });

  test("stopTimer sets timerOn to false", () => {
    const timer = setup();

    act(() => {
      timer().startTimer();
      timer().stopTimer();
    });

    expect(timer().timerOn).toBe(false);
  });

  test("timeInMs updates when interval callback runs", () => {
    const timer = setup();

    act(() => {
      timer().startTimer();
    });

    now = 1600;
    act(() => {
      timer().manualUpdate();
    });

    expect(timer().timeInMs).toBe(600);
  });
});
