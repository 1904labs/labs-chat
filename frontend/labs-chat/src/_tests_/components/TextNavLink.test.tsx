import React from "react";
import { render } from "@testing-library/react";
import TextNavLink from "@components/TextNavLink";

describe("TextNavLink tests", () => {
  test("renders TextNavLink component with correct children", () => {
    const { getByText } = render(<TextNavLink to="/home">Home</TextNavLink>);
    expect(getByText("Home")).toBeInTheDocument();
  });

  test("renders TextNavLink component with LeadingIcon when provided", () => {
    const LeadingIcon = () => <svg />;
    const { container } = render(
      <TextNavLink to="/about" LeadingIcon={LeadingIcon}>
        About
      </TextNavLink>,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("renders TextNavLink component without LeadingIcon when not provided", () => {
    const { queryByTestId } = render(
      <TextNavLink to="/contact">Contact</TextNavLink>,
    );
    expect(queryByTestId("leading-icon")).toBeNull();
  });

  test("renders TextNavLink component with border when border prop is true", () => {
    const { getByText } = render(
      <TextNavLink to="/projects" border={true}>
        Projects
      </TextNavLink>,
    );
    expect(getByText("Projects")).toHaveClass("border");
  });

  test("renders TextNavLink component without border when border prop is false", () => {
    const { getByText } = render(
      <TextNavLink to="/blog" border={false}>
        Blog
      </TextNavLink>,
    );
    expect(getByText("Blog")).not.toHaveClass("border");
  });
});
