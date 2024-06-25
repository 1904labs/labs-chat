import React from "react";
import { describe, it, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import BotMessage from "../app/components/BotMessage";

describe("BotMessage", () => {
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
    // ... add more assertions for other CSS classes
  });
});
