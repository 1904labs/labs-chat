"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import BotMessage from "./BotMessage";
import sessionId from "@/helpers/sessionId";
import { getFormattedDateForUI } from "@/helpers/dates";

const MESSAGE_FORMAT = {
  id: 0,
  speaker: "bot",
  message: "Hello! How can I help you today?",
  date: getFormattedDateForUI(),
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

  async function logResponse(data) {
    const response = await fetch("/api/auditLogsToS3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  }

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
    let metadata = {};
    try {
      const it = streamingFetch("/api/streaming-llm", userMessage);
      const chatTransactions = [];
      for await (let value of it) {
        try {
          const chatTransaction = JSON.parse(value);

          chatTransactions.push(chatTransaction);
          setBotResponse((prevResp) => [...prevResp, chatTransaction.model_response]);
        } catch (e) {
          console.log(`error parsing chunk: ${e.message}`);
          console.log(JSON.stringify(e));
        }
      }

      const finalChatTransaction = {
        ...chatTransactions[0],// Initialize using the first entry
        input_tokens: 0,
        output_tokens:0,
        user_input: userMessage, // populate values from settings and input
        temperature: process.env.MODEL_TEMPERATURE,
        model_response: "",
        conversation_id: sessionId,
      }

      for (let chatTransaction of chatTransactions){
        
        // add input and output tokens
        finalChatTransaction.input_tokens += chatTransaction.input_tokens ?? 0;
        finalChatTransaction.output_tokens += chatTransaction.output_tokens ?? 0;

        // concat text from the model_response
        if (chatTransaction.model_response){
          finalChatTransaction.model_response += chatTransaction.model_response;
        }

        // use the last values for stop_reason and error_text
        if (chatTransaction.stop_reason) {
          finalChatTransaction.stop_reason = chatTransaction.stop_reason;
        }
        if (chatTransaction.error_text) {
          finalChatTransaction.error_text = chatTransaction.error_text;
        }
      }
      
      // this section simulates once the streaming
      // response is done and we want to add the final response to the
      // chat history
      const fullMessageStructure = {
        id: sessionId,
        speaker: "bot",
        message: finalChatTransaction.model_response,
        date: getFormattedDateForUI(),
      };

      await logResponse(finalChatTransaction);
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
      date: getFormattedDateForUI(),
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
