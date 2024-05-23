"use client";

import ChatMessage from "./ChatMessage";
const botlogo = "/assets/1904labs_diamonds.png";

const ChatWindow = () => {
  return (
    <div className="w-full lg:w-full h-full  2xl:w-2/3 overflow-y-auto bg-white bg-opacity-90">
      <div className="flex flex-grow h-full flex-col justify-between">
        <div className="flex flex-col flex-grow gap-6 p-4">
          {/* Bot chat section */}
          <ChatMessage speaker="bot" message="Hello! How can I help you today?" date="[2024-02-20] 4:30pm" />
          {/* User chat section */}
          <ChatMessage speaker="user" message="I have a question about the product" date="[2024-02-20] 4:31pm" />
        </div>
        <div className="p-4 w-10/12 2xl:w-8/12 m-auto">
          <div className="flex justify-between items-center">
            {/* chat input button that is at bottom of screen*/}
            <input
              type="text"
              placeholder="Message 1904labsChat..."
              className="w-full p-2 border h-10 border-1904labs-blue-300 rounded-tl-lg rounded-bl-lg"
            />
            <button className="bg-1904labs-green-500 h-10 rounded-tr-lg rounded-br-lg py-2 px-10 text-white">
              enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
