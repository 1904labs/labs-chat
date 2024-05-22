"use client";
import React, { useState, useEffect } from "react";

import PromptBox from "../components/PromptBox.js";
import Messages from "../messages/index.js";

export default function Chat() {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([{text: "Hello! How can I help you today?", type: "assistant"}]);
    const [firstMsg, setFirstMsg] = useState(true);


    useEffect(() => {
        if (prompt && prompt !== "") {
            handleSubmitPrompt();
        }
        }, [prompt]);

    const handleSubmitPrompt = async () => {
        try {
          // Add the user's prompt to the messages
          setMessages(
              prevMessages => [
                ...prevMessages,
                { text: prompt, type: "user"},
          ]);
          // Send the prompt to the API
          const response = await fetch("/api/home", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: prompt, firstMsg }),
          });
          const responseJson = await response.json();
          // console.log(responseJson.output.response);
          setMessages(
            prevMessages => [
              ...prevMessages,
              { text: responseJson.output.response, type: "assistant" },
            ]);
          setPrompt("");
          setFirstMsg(false);
      } catch (error) {
        console.error(error);
      }
    }

    return (
        <div>
          <Messages messages={messages} />
            <PromptBox handleSubmit={setPrompt}></PromptBox>
        </div>
    )
}