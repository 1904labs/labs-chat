"use client";
import { Context, createContext, useContext, useState } from "react";
import { getFormattedDateForUI } from "@helpers/dates";
import { ConversationContentText, ConversationElement } from "@/app/types";

interface ChatMessage {
  id: number;
  speaker: string;
  message: string;
  date: string;
}

interface ChatHistoryHandler {
  chatHistory: ChatMessage[];
  clearMessageHistory: () => void;
  addMessageToHistory: (message: ChatMessage) => void;
  loadHistory: (conversation: ConversationElement[]) => void;
}

// @ts-ignore
const ChatContext: Context<ChatHistoryHandler> = createContext();
export const useChatHistory = () => useContext(ChatContext);

export function makeDefaultMessage() {
  return {
    id: 0,
    speaker: "bot",
    message: "Hello! How can I help you today?",
    date: getFormattedDateForUI(new Date()),
  };
}

export const ClientChatHistoryProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    makeDefaultMessage(),
  ]);

  const clearMessageHistory = (): void => {
    setChatHistory([makeDefaultMessage()]);
  };

  const addMessageToHistory = (message: ChatMessage): void => {
    setChatHistory((prevMessages) => [...prevMessages, message]);
  };

  const loadHistory = (conversation: ConversationElement[]): void => {
    let id = -1;
    setChatHistory(
      conversation.map((e) => {
        id++;
        return {
          id,
          speaker: e.role === "assistant" ? "bot" : "user",
          message: (
            e.content.find((m) => m.type === "text") as ConversationContentText
          ).text,
          date: getFormattedDateForUI(new Date(Number(e.timestamp))),
        };
      }),
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        loadHistory,
        clearMessageHistory,
        addMessageToHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
