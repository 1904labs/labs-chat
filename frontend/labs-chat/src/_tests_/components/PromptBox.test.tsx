import React from "react";
import { render, fireEvent } from "@testing-library/react";
import PromptBox from "@components/PromptBox";

describe("PromptBox", () => {
  test("calls handleSubmit when Enter key is pressed", () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText } = render(
      <PromptBox handleSubmit={handleSubmit} />,
    );
    const input = getByPlaceholderText("Enter your prompt");

    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test("clears the input value after calling handleSubmit", () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText } = render(
      <PromptBox handleSubmit={handleSubmit} />,
    );
    const input = getByPlaceholderText("Enter your prompt");

    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.innerHTML).toBe("");
  });

  test("submit button click calls the subnit function", () => {
    const handleSubmit = jest.fn();
    const { getByText } = render(<PromptBox handleSubmit={handleSubmit} />);
    const submitButton = getByText("Enter");

    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test("when enter your prompt input is changed, it updates the input value", () => {
    const { getByPlaceholderText } = render(
      <PromptBox handleSubmit={() => {}} />,
    );
    const input = getByPlaceholderText("Enter your prompt") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "New prompt" } });

    expect(input.value).toBe("New prompt");
  });

  test("shows error message when error prop is passed", () => {
    const error = { message: "Error message" };
    const { getByText } = render(
      <PromptBox handleSubmit={() => {}} error={error} />,
    );

    expect(getByText("Error message")).toBeInTheDocument();
  });
});
