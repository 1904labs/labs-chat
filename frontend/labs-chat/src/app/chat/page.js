"use client";
import React, { useState, useEffect } from "react";

import PromptBox from "../components/promptbox";

export default function Chat() {
    const [prompt, setPrompt] = useState("");
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
          } catch (error) {
            console.error(error);
          }
        }

    return (
        <PromptBox handleSubmit={setPrompt}></PromptBox>
    )
}