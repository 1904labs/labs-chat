"use client"
import React, { useState } from "react";
import Button from "./Button";

const PromptBox = ({
  handleSubmit,
  placeHolderText,
  error,
  labelText,
  disable,
  appColor = "robotBlue",
}) => {
  const [inputValue, setInputValue] = useState("");
  const handleKeyDown = e => {
    if (e.key === "Enter") {
      handleSubmit(inputValue);
      setInputValue("");
    }
  };
  const onSubmit = () => {
    handleSubmit(inputValue);
    setInputValue("");
  };
  return (
    <>
      <div className="text-center">
        {labelText && (
          <label htmlFor="" className="mr-4">
            {labelText}
          </label>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e?.target?.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeHolderText || "Enter your prompt"}
          className="w-full mb-4 py-4 px-6 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded shadow"
        />
        <Button text={"Enter"} disable={disable} onClick={onSubmit} appColor={appColor}/>
      </div>
      <p className={`text-red-500 ${error ? "block" : "hidden"}`}>
        {error?.message}
      </p>
    </>
  );
};

export default PromptBox;