import React from "react";
import UserMessage from "@components/UserMessage";
import BotMessage from "@components/BotMessage";
import { User } from "../types";

interface ChatMessageProps {
  messageData: {
    speaker: string;
    message: string;
    date: string;
  };
  user?: User | null;
}

const Chatmessage = ({ messageData, user = null }: ChatMessageProps) => {
  if (messageData.speaker === "user") {
    return (
      <UserMessage
        message={messageData.message}
        date={messageData.date}
        user={user ?? null}
      />
    );
  } else {
    return <BotMessage message={messageData.message} date={messageData.date} />;
  }
};

export default Chatmessage;
