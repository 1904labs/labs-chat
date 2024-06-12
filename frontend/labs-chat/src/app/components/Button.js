"use client";
import React from "react";

const Button = ({ text, onClick, disable = false, appColor = "robotBlue" }) => {
  const buttonClassName = `py-2 px-8 bg-${appColor}-500 text-white text-xl rounded-full border-2 border-${appColor}-500 hover:bg-transparent hover:text-${appColor}-500 transition-colors duration-200`;

  return (
    <div className="text-center">
      <button onClick={onClick} disabled={disable} className={buttonClassName}>
        {text}
      </button>
    </div>
  );
};

export default Button;
