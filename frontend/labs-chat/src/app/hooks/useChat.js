import { useCallback, useEffect, useState } from "react";

const useChat = () => {
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("DEFAULT");
  const [firstMsg, setFirstMsg] = useState(true);

  useEffect(() => {
    if (prompt) {
      handleSubmitPrompt();
    }
  }, [prompt, handleSubmitPrompt]);

  const handleSubmitPrompt = useCallback(async () => {
    try {
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
  }, [prompt, firstMsg]);

  return { message, setPrompt };
};

export default useChat;
