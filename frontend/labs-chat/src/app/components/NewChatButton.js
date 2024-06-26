"use client";

import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useChatHistory } from "@components/ClientChatHistoryProvider";

const NewChatButton = () => {
  const { clearMessageHistory } = useChatHistory();
  const handleOnClick = async () => {
    // clear the memory on the server side
    const response = await fetch("/api/newChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{}",
    });

    // clear the client chat history
    clearMessageHistory();
  };
  return (
    <button
      onClick={handleOnClick}
      className="flex items-center justify-start bg-1904labs-green-500 p-4 hover:bg-1904labs-green-600"
    >
      <PlusCircleIcon className="mr-2 h-6 w-6 text-white drop-shadow-lg" />
      <span className="text-white drop-shadow-lg">New Chat</span>
    </button>
  );
};

export default NewChatButton;
