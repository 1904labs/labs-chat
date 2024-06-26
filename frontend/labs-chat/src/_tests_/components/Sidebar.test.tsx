import React from "react";
import { render } from "@testing-library/react";
import Sidebar from "@components/Sidebar";

jest.mock("@components/NewChatButton", () => {
  const MockChatButton = () => <div data-testid="new-chat-button" />;
  return MockChatButton;
});
jest.mock("@components/ChatHistory", () => {
  const MockChatHistory = () => <div data-testid="chat-history" />;
  return MockChatHistory;
});

describe("Sidebar", () => {
  test("renders without crashing", () => {
    render(<Sidebar />);
  });

  test("renders the NewChatButton component", () => {
    const { getByTestId } = render(<Sidebar />);
    expect(getByTestId("new-chat-button")).toBeInTheDocument();
  });

  test("renders the ChatHistory component", () => {
    const { getByTestId } = render(<Sidebar />);
    expect(getByTestId("chat-history")).toBeInTheDocument();
  });
});
