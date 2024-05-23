"use client";

const ChatMessage = ({ speaker = "user", message = "", date = "" }) => {
  const alignment = speaker == "user" ? "end" : "start";
  const name = speaker == "user" ? "Chat User" : "1904Chat";
  const iconColor = speaker == "user" ? "bg-1904labs-blue-500" : "bg-white";
  const bgColor =
    speaker == "user" ? "bg-1904labs-white" : "bg-1904labs-blue-300";

  return (
    <div className={`flex flex-col items-${alignment} justify-${alignment}`}>
      <div
        className={`flex ${bgColor} rounded-lg p-4 drop-shadow-md shadow-lg w-8/12`}
      >
        <div className="w-1/12">
          <div
            className={`w-12 h-12 ${iconColor} rounded-full flex items-center justify-center text-white font-light p-1`}
          >
            {speaker == "bot" && (
              <div
                className={`bg-[url('/assets/1904labs_diamonds.png')] bg-cover w-full h-full`}
              ></div>
            )}

            {speaker == "user" && "CU"}
          </div>
        </div>
        <div className="ml-5">
          <p className="text-lg font-bold">{name}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
      <p className="text-sm pt-2 text-1904labs-grey-300">{date}</p>
    </div>
  );
};

export default ChatMessage;
