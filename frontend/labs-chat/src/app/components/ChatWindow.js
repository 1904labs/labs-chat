"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";

const MESSAGE_FORMAT = {
  id: 0,
  speaker: "bot",
  message: "Hello! How can I help you today?",
  date: "[2024-02-20] 4:30pm",
};

const ChatWindow = () => {
  const scrollRef = useRef(null);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [chatMessages, setChatMessages] = useState([MESSAGE_FORMAT]);

  useEffect(() => {
    // scroll to the bottom of the chat window
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const addMessage = (message, callback) => {
    if (callback) {
      setChatMessages((prevMessages) => [...prevMessages, message], callback);
    } else {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  const asyncBotResponse = (message) => {
    setLoadingResponse(true);
    // make the api query here
    new Promise((resolve) => {
      setTimeout(() => {
        const botResponse = {
          id: chatMessages.length,
          speaker: "bot",
          message: "This is the bot response message",
          date: "[2024-02-20] 4:30pm",
        };

        addMessage(botResponse);
        setLoadingResponse(false);
        resolve();
      }, 1000);
    });
  };

  const onMessageSubmitted = (e) => {
    e.preventDefault();
    const newMessage = {
      ...MESSAGE_FORMAT,
      id: chatMessages.length,
      speaker: "user",
      message: input,
      date: "[2024-02-20] 4:30pm",
    };
    console.log("adding new message");
    addMessage(newMessage, asyncBotResponse(input));
    setInput("");
  };

  return (
    <div className="w-full lg:w-full h-full  2xl:w-2/3 overflow-y-auto bg-white bg-opacity-90">
      <div className="flex flex-grow h-full flex-col justify-between">
        <div className="flex flex-col flex-grow gap-6 p-4 overflow-y-scroll">
          {/* Loop over messages */}
          {chatMessages.map((message, index) => (
            <div key={`chat-messages-${message.speaker}-${index}`}>
              <ChatMessage
                speaker={message.speaker}
                message={message.message}
                date={message.date}
              />
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>
        <div className="p-4 w-10/12 2xl:w-8/12 m-auto">
          <form autoFocus className="flex justify-between items-center">
            {/* chat input button that is at bottom of screen*/}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                loadingResponse ? "Loading..." : "Message 1904labsChat..."
              }
              className="w-full p-2 border h-10 border-1904labs-blue-300 rounded-tl-lg rounded-bl-lg"
            />
            <button
              disabled={loadingResponse || input === ""}
              onClick={onMessageSubmitted}
              className={`bg-1904labs-green-500${
                loadingResponse || input == "" ? " bg-gray-200 " : " "
              }h-10 rounded-tr-lg rounded-br-lg py-2 px-10 text-white`}
            >
              enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
