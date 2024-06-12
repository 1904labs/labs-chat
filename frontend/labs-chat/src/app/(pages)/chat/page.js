"use client";

import React, { useEffect, useState } from "react";
import PromptBox from "../../components/PromptBox";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("DEFAULT");
  const [firstMsg, setFirstMsg] = useState(true);

  useEffect(() => {
    if (prompt && prompt !== "") {
      handleSubmitPrompt();
    }
  }, [prompt]);

  const handleSubmitPrompt = async () => {
    try {
      // Send the prompt to the API
      const response = await fetch("/api/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt, firstMsg }),
      });
      const responseJson = await response.json();
      console.log(responseJson.output.response);
      setMessage(responseJson.output.response);
      setFirstMsg(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <PromptBox handleSubmit={setPrompt}></PromptBox>
      <div>{message}</div>
    </div>
  );
}
