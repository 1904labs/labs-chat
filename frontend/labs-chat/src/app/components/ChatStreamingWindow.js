"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import BotMessage from "./BotMessage";

const sessionId = crypto.randomUUID();

const fakeSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getFormattedDate = () => {
  const dt = new Date();
  const formatedDate = `[${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}] ${dt.getHours()}:${dt.getMinutes()}`; //todo
  return formatedDate;
}

const MESSAGE_FORMAT = {
  id: 0,
  speaker: "bot",
  message: "Hello! How can I help you today?",
  date: getFormattedDate(),
};

const ChatStreamingWindow = () => {
  const scrollRef = useRef(null);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([MESSAGE_FORMAT]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [botResponse, setBotResponse] = useState("");

  useEffect(() => {
    // scroll to the bottom of the chat window
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, botResponse]);

  const addMessageToHistory = (message, callback) => {
    if (callback) {
      setChatHistory((prevMessages) => [...prevMessages, message], callback);
    } else {
      setChatHistory((prevMessages) => [...prevMessages, message]);
    }
  };

  /**
   * Generator function that streams the response body from a fetch request.
   */
  async function* streamingFetch(url, input) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      try {
        yield decoder.decode(value);
      } catch (e) {
        console.log(`error decoding value: ${e.message}`);
        console.log(JSON.stringify(e));
      }
    }
  }

  const asyncBotResponse = async (message) => {
    setLoadingResponse(true);

    // This section simulates the streaming response
    const userMessage = message;
    try {
      const it = streamingFetch("/api/streaming-llm", userMessage);
      const totalResponse = [];
      for await (let value of it) {
        try {
          const chunk = JSON.parse(value);
          // this is specific response 
          // to the model.stream call for 
          // langchain. If we were to use a chain the 
          // response structure would probably be different
          // or we could at least manipulate it ourselves 
          // on the API side
          const { kwargs } = chunk;
          const { content } = kwargs;
          totalResponse.push(content);
          setBotResponse((prevResp) => [...prevResp, content]);
        } catch (e) {
          console.log(`error parsing chunk: ${e.message}`);
          console.log(JSON.stringify(e));
        }
      }

      // this section simulates once the streaming
      // response is done and we want to add the final response to the
      // chat history
      const fullMessageStructure = {
        id: sessionId,
        speaker: "bot",
        message: totalResponse.join(""),
        date: getFormattedDate(),
      };

      addMessageToHistory(fullMessageStructure);
      setBotResponse("");
    } catch (e) {
      console.log(`error: ${e.message}`);
      console.log(JSON.stringify(e));
    } finally {
      setLoadingResponse(false);
    }
  };

  const onMessageSubmitted = (e) => {
    e.preventDefault();
    const newMessage = {
      ...MESSAGE_FORMAT,
      id: sessionId,
      speaker: "user",
      message: input,
      date: getFormattedDate(),
    };
    addMessageToHistory(newMessage, asyncBotResponse(input));
    setInput("");
  };

  return (
    <div className="w-full lg:w-full h-full  2xl:w-2/3 overflow-y-auto bg-white bg-opacity-90">
      <div className="flex flex-grow h-full flex-col justify-between">
        <div className="flex flex-col flex-grow gap-6 p-4 overflow-y-scroll">
          {/* Loop over messages */}
          {chatHistory.map((messageData, index) => (
            <ChatMessage
              key={`chat-messages-${messageData.speaker}-${index}`}
              messageData={messageData}
            />
          ))}
          {loadingResponse && <BotMessage message={botResponse} date={""} />}
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

export default ChatStreamingWindow;
