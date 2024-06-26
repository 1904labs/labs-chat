import React from "react";
import { render } from "@testing-library/react";
import ChatMessage from "@components/ChatMessage";

describe("ChatMessage", () => {
  const messageData = {
    speaker: "user",
    message: "Hello, world!",
    date: "2022-01-01",
  };

  test("renders UserMessage when speaker is 'user'", () => {
    const { getByText } = render(
      <ChatMessage messageData={messageData} user={null} />,
    );
    const userMessageElement = getByText(messageData.message);
    expect(userMessageElement).toBeInTheDocument();
  });

  test("renders BotMessage when speaker is not 'user'", () => {
    const { getByText } = render(
      <ChatMessage
        messageData={{ ...messageData, speaker: "bot" }}
        user={null}
      />,
    );
    const botMessageElement = getByText(messageData.message);
    expect(botMessageElement).toBeInTheDocument();
  });
});
