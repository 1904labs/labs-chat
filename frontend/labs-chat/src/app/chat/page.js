"use client";
import React, { useState, useEffect } from "react";

import PromptBox from "../components/promptbox";

export default function Chat() {
    const [prompt, setPrompt] = useState("");
    const [message, setMessage] = useState("DEFAULT");
    let firstMsg = true

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
          } catch (error) {
            console.error(error);
          }
        }

    return (
        <div>
            <PromptBox handleSubmit={setPrompt}></PromptBox>
            <div>{message}</div>
        </div>
    )
}