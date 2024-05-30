"use client";
import React from "react";
import { PlusCircleIcon, ClockIcon } from "@heroicons/react/20/solid";
import ChatHistory from "./ChatHistory";

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:flex-grow flex-col md:visible w-1/5 md:w-1/3 lg:w-1/4 xl:w-1/4 2xl:w-1/5 max-w-80 bg-1904labs-grey-400">
      <button className="flex items-center justify-start p-4 bg-1904labs-green-500 hover:bg-1904labs-green-600">
        <PlusCircleIcon className="h-6 w-6 mr-2 text-white drop-shadow-lg" />
        <span className="text-white drop-shadow-lg">New Chat</span>
      </button>
      <div className="flex items-center justify-start p-4 shadow-lg bg-gradient-to-b from-1904labs-grey-400 to-1904labs-grey-500 text-white">
        <ClockIcon className="h-6 w-6 mr-2" />
        <span>Chat History</span>
      </div>
      <div className="pl-5 flex flex-grow">
        <ChatHistory forceDisable />
      </div>
    </div>
  );
};

export default Sidebar;
