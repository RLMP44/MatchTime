import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ButtonBar from "./ButtonBar";

// mock popup to inspect props without actually rendering it
jest.mock("./popup/Popup", () => (props) => (
  <div data-testid="popup">
    Popup - crud:{props.crud} - fields:{JSON.stringify(props.popUpFields)}
  </div>
));

function setup(overrides = {}) {
  const props = {
    tab: "racer",
    fieldsObj: {
      racer: ["name", "age"],
      add: ["name", "age"],
      import: ["file"],
      export: ["format"]
    },
    add: jest.fn(),
    categories: [],
    ...overrides
  };

  const user = userEvent.setup();
  render(<ButtonBar {...props} />);
  return { user, props };
}

describe("ButtonBar", () => {

  test("renders all three buttons", () => {
    setup();
    expect(screen.getByRole("button", { name: /import racers/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add racer/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export racers/i })).toBeInTheDocument();
  });

  test("clicking Add opens popup with correct fields", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /add racer/i }));

    const popup = screen.getByTestId("popup");
    expect(popup).toHaveTextContent("crud:add");
    expect(popup).toHaveTextContent('"name","age"');
  });

  test("clicking Import opens popup with import fields", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /import racers/i }));

    const popup = screen.getByTestId("popup");
    expect(popup).toHaveTextContent("crud:import");
    expect(popup).toHaveTextContent('"file"');
  });

  test("clicking Export opens popup with export fields", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /export racers/i }));

    const popup = screen.getByTestId("popup");
    expect(popup).toHaveTextContent("crud:export");
    expect(popup).toHaveTextContent('"format"');
  });

  test("popup toggles visibility on repeated clicks", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /add racer/i }));
    expect(screen.getByTestId("popup")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add racer/i }));
    expect(screen.queryByTestId("popup")).not.toBeVisible();
  });

  test("on 'result' tab, only export button works", async () => {
    const { user } = setup({ tab: "result" });

    // Add should do nothing
    await user.click(screen.getByRole("button", { name: /add result/i }));
    expect(screen.queryByTestId("popup")).not.toBeVisible()

    // Import should do nothing
    await user.click(screen.getByRole("button", { name: /import results/i }));
    expect(screen.queryByTestId("popup")).not.toBeVisible();

    // Export should work
    await user.click(screen.getByRole("button", { name: /export results/i }));
    expect(screen.getByTestId("popup")).toBeInTheDocument();
  });

});
