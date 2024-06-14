"use client";
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ChatHistoryListItem from "@components/ChatHistoryListItem";

const ChatHistory = ({ forceDisable }) => {
  return (
    <div
      className={`flex flex-grow flex-col p-4 ${forceDisable && "pointer-events-none opacity-30"}`}
    >
      <div className="mb-4 flex items-center border-b pb-2">
        <ChevronDownIcon className="mr-2 h-5 w-5 stroke-white stroke-2 text-white" />
        <h2 className="text-xs text-white">Date Modified</h2>
      </div>
      <ul className="space-y-4">
        <ChatHistoryListItem
          date="01/01/2021"
          title="Super cool chat history that has a long title"
          onDeletePressed={() => console.log("Delete pressed")}
          onEditPressed={() => console.log("Edit pressed")}
        />
        <ChatHistoryListItem date="12/25/1983" title="HTML Coding" />
        <ChatHistoryListItem date="09/06/1988" title="🤣 funny jokes" />
      </ul>
    </div>
  );
};

export default ChatHistory;
