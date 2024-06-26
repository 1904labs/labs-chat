"use client";
import { createContext, useContext, useState } from "react";
import { getFormattedDateForUI } from "@helpers/dates";

const ChatContext = createContext();

export const useChatHistory = () => useContext(ChatContext);

function makeDefaultMessage() {
  return {
    id: 0,
    speaker: "bot",
    message: "Hello! How can I help you today?",
    date: getFormattedDateForUI(new Date()),
  };
}

export const ClientChatHistoryProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([makeDefaultMessage()]);

  const clearMessageHistory = () => {
    setChatHistory([makeDefaultMessage()]);
  };

  const addMessageToHistory = (message) => {
    setChatHistory((prevMessages) => [...prevMessages, message]);
  };

  return (
    <ChatContext.Provider
      value={{ chatHistory, clearMessageHistory, addMessageToHistory }}
    >
      {children}
    </ChatContext.Provider>
  );
};
