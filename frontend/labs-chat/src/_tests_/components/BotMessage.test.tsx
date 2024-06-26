import React from "react";
import { render } from "@testing-library/react";
import BotMessage from "@components/BotMessage";

describe("BotMessage tests", () => {
  it("renders the message and date correctly", () => {
    const message = "Hello, world!";
    const date = "2022-01-01";

    const { getByText } = render(<BotMessage message={message} date={date} />);

    expect(getByText("1904Chat")).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  it("renders with the correct CSS classes", () => {
    const { container } = render(<BotMessage />);

    expect(container.firstChild).toHaveClass("items");
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("flex-col");
  });
});
