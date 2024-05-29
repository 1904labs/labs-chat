"use client";

const BotMessage = ({message = "", date = "" }) => {
  return (
    <div className={`flex flex-col items-start justify-start items`}>
      <div
        className={`flex bg-1904labs-blue-300 rounded-lg p-4 drop-shadow-md shadow-lg w-8/12 xl:w-1/3 2xl:w-5/12`}
      >
        <div className="w-1/12">
          <div
            className={`w-12 h-12 bg-white rounded-full flex items-center justify-center text-white font-light p-1`}
          >
              <div
                className={`bg-[url('/assets/1904labs_diamonds.png')] bg-cover w-full h-full`}
              ></div>
          </div>
        </div>
        <div className="ml-5">
          <p className="text-lg font-bold">1904Chat</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
      <p className="text-sm pt-2 text-1904labs-grey-300">{date}</p>
    </div>
  );
};

export default BotMessage;
