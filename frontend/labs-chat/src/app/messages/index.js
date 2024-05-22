import React from "react";

const Message = ({message}) => {
    const style = message.type == "assistant" ? "bg-green-200 text-green-800  p-2 m-2 rounded-lg shadow-md w-1/2" : "bg-blue-200 text-green-800  p-2 m-2 rounded-lg shadow-md w-1/2";

    return (
        <div
            className={style}
        >
            {message.text}
        </div>
    );

}
const Messages = ({ messages }) => {
    return (
        <div>
            {messages.map((message, index) => (
                <Message message={message} />
            ))}
        </div>
    );
}

export default Messages;