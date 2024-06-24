"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "@components/ChatMessage";
import BotMessage from "@components/BotMessage";
import sessionId from "@helpers/sessionId";
import { getFormattedDateForUI } from "@helpers/dates";
import { log } from "@actions/log";
import {
  makeDefaultMessage,
  useChatHistory,
} from "@components/ClientChatHistoryProvider";

const ChatStreamingWindow = () => {
  const scrollRef = useRef(null);
  const [input, setInput] = useState("");
  const { chatHistory, addMessageToHistory } = useChatHistory();
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [botResponse, setBotResponse] = useState("");

  useEffect(() => {
    // scroll to the bottom of the chat window
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, botResponse]);

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
          setBotResponse((prevResp) => [
            ...prevResp,
            chatTransaction.model_response,
          ]);
        } catch (e) {
          console.log(`error parsing chunk: ${e.message}`);
          console.log(JSON.stringify(e));
        }
      }

      const finalChatTransaction = {
        ...chatTransactions[0], // Initialize using the first entry
        input_tokens: 0,
        output_tokens: 0,
        user_input: userMessage, // populate values from settings and input
        temperature: process.env.MODEL_TEMPERATURE,
        model_response: "",
        conversation_id: sessionId,
      };

      for (let chatTransaction of chatTransactions) {
        // add input and output tokens
        finalChatTransaction.input_tokens += chatTransaction.input_tokens ?? 0;
        finalChatTransaction.output_tokens +=
          chatTransaction.output_tokens ?? 0;

        // concat text from the model_response
        if (chatTransaction.model_response) {
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
        date: getFormattedDateForUI(new Date()),
      };

      await log(finalChatTransaction);
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
      ...makeDefaultMessage(),
      id: sessionId,
      speaker: "user",
      message: input,
    };
    addMessageToHistory(newMessage);
    asyncBotResponse(input);
    setInput("");
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white bg-opacity-90 lg:w-full 2xl:w-2/3">
      <div className="flex h-full flex-grow flex-col justify-between">
        <div className="flex flex-grow flex-col gap-6 overflow-y-scroll p-4">
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
        <div className="m-auto w-10/12 p-4 2xl:w-8/12">
          <form autoFocus className="flex items-center justify-between">
            {/* chat input button that is at bottom of screen*/}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                loadingResponse ? "Loading..." : "Message 1904labsChat..."
              }
              className="h-10 w-full rounded-bl-lg rounded-tl-lg border border-1904labs-blue-300 p-2"
            />
            <button
              disabled={loadingResponse || input === ""}
              onClick={onMessageSubmitted}
              className={`bg-1904labs-green-500${
                loadingResponse || input === "" ? "bg-gray-200" : " "
              }h-10 rounded-br-lg rounded-tr-lg px-10 py-2 text-white`}
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
