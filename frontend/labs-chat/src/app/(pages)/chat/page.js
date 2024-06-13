"use client";

import React from "react";
import PromptBox from "../../components/PromptBox";
import useChat from "../../hooks/useChat";

export default function Chat() {
  const { message, setPrompt } = useChat();

  return (
    <div>
      <PromptBox handleSubmit={setPrompt}></PromptBox>
      <div>{message}</div>
    </div>
  );
}
