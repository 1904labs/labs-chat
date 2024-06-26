import React from "react";
import { render } from "@testing-library/react";
import UserMessage from "@components/UserMessage";
import { User } from "@types";

describe("UserMessage tests", () => {
  test("renders UserMessage component with correct username, message, and date", () => {
    const message = "Hello, world!";
    const date = "2022-01-01";
    const user: User = {
      userAttributes: {
        name: "John Smith",
        email: "john@example.com",
        sub: "1234567890",
      },
    };

    const { getByText } = render(
      <UserMessage message={message} date={date} user={user} />,
    );

    expect(getByText("John Smith")).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  test("renders UserMessage component with default username when user is null", () => {
    const message = "Hello, world!";
    const date = "2022-01-01";
    const user = null;

    const { getByText } = render(
      <UserMessage message={message} date={date} user={user} />,
    );

    expect(getByText("Chat User")).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  test("renders UserMessage component with default username when userAttributes is null", () => {
    const message = "Hello, world!";
    const date = "2022-01-01";
    const user: User = {
      userAttributes: null,
    };

    const { getByText } = render(
      <UserMessage message={message} date={date} user={user} />,
    );

    expect(getByText("Chat User")).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  test("renders UserMessage component with default username when userAttributes is empty", () => {
    const message = "Hello, world!";
    const date = "2022-01-01";
    const user: User = {
      userAttributes: {},
    };

    const { getByText } = render(
      <UserMessage message={message} date={date} user={user} />,
    );

    expect(getByText("Chat User")).toBeInTheDocument();
    expect(getByText("CU")).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  test("renders UserMessage component with correct initials when user has a name", () => {
    const message = "Hello, world!";
    const date = "2022-01-01";
    const user: User = {
      userAttributes: {
        name: "John Smith",
        email: "john@example.com",
      },
    };

    const { getByText } = render(
      <UserMessage message={message} date={date} user={user} />,
    );

    expect(getByText("JS")).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  test("renders UserMessage component with correct initials when user has only one name", () => {
    const message = "Hello, world!";
    const date = "2022-01-01";
    const user: User = {
      userAttributes: {
        name: "John",
        email: "john@example.com",
      },
    };

    const { getByText } = render(
      <UserMessage message={message} date={date} user={user} />,
    );

    expect(getByText("Jo")).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  test("renders UserMessage component with email when user has no name", () => {
    const message = "Hello, world!";
    const date = "2022-01-01";
    const user: User = {
      userAttributes: {
        email: "john@example.com",
      },
    };

    const { getByText } = render(
      <UserMessage message={message} date={date} user={user} />,
    );

    expect(getByText("john@example.com")).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });
});
