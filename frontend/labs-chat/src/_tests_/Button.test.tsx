import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "@components/Button";

describe("Button tests", () => {
  it("renders the button with the correct text", () => {
    const buttonText = "Click me";
    const { getByText } = render(
      <Button onClick={() => {}} text={buttonText} />,
    );
    expect(getByText(buttonText)).toBeInTheDocument();
  });

  it("calls the onClick function when clicked", () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <Button text="Click me" onClick={onClickMock} />,
    );
    fireEvent.click(getByText("Click me"));
    expect(onClickMock).toHaveBeenCalled();
  });

  it("disables the button when disable prop is true", () => {
    const { getByText } = render(
      <Button onClick={() => {}} text="Click me" disable={true} />,
    );
    expect(getByText("Click me")).toBeDisabled();
  });

  it("applies the correct CSS classes based on appColor prop", () => {
    const { container } = render(
      <Button onClick={() => {}} text="Click me" appColor="robotBlue" />,
    );
    expect(container.querySelector(".bg-robotBlue-500")).toBeInTheDocument();
    expect(
      container.querySelector(".border-robotBlue-500"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".hover\\:text-robotBlue-500"),
    ).toBeInTheDocument();
  });
});
