"use client";
import React from "react";
import { PlusCircleIcon, ClockIcon } from "@heroicons/react/20/solid";
import ChatHistory from "@components/ChatHistory";

const Sidebar = () => {
  return (
    <div className="hidden w-1/5 max-w-80 flex-col bg-1904labs-grey-400 md:visible md:flex md:w-1/3 md:flex-grow lg:w-1/4 xl:w-1/4 2xl:w-1/5">
      <button className="flex items-center justify-start bg-1904labs-green-500 p-4 hover:bg-1904labs-green-600">
        <PlusCircleIcon className="mr-2 h-6 w-6 text-white drop-shadow-lg" />
        <span className="text-white drop-shadow-lg">New Chat</span>
      </button>
      <div className="flex items-center justify-start bg-gradient-to-b from-1904labs-grey-400 to-1904labs-grey-500 p-4 text-white shadow-lg">
        <ClockIcon className="mr-2 h-6 w-6" />
        <span>Chat History</span>
      </div>
      <div className="flex flex-grow pl-5">
        <ChatHistory forceDisable />
      </div>
    </div>
  );
};

export default Sidebar;
