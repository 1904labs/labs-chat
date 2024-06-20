import React from "react";
import { PlusCircleIcon, ClockIcon } from "@heroicons/react/20/solid";
import ChatHistory from "@components/ChatHistory";
import NewChatButton from "@components/NewChatButton";

const Sidebar = () => {
  return (
    <div className="hidden w-1/5 max-w-80 flex-col bg-1904labs-grey-400 md:visible md:flex md:w-1/3 md:flex-grow lg:w-1/4 xl:w-1/4 2xl:w-1/5">
      <NewChatButton/>
      <div className="flex items-center justify-start bg-gradient-to-b from-1904labs-grey-400 to-1904labs-grey-500 p-4 text-white shadow-lg">
        <ClockIcon className="mr-2 h-6 w-6" />
        <span>Chat History</span>
      </div>
      <div className="flex flex-grow pl-5">
        <ChatHistory />
      </div>
    </div>
  );
};

export default Sidebar;
