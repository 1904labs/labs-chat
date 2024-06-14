const BotMessage = ({ message = "", date = "" }) => {
  return (
    <div className={`items flex flex-col items-start justify-start`}>
      <div
        className={`flex w-8/12 rounded-lg bg-1904labs-blue-300 p-4 shadow-lg drop-shadow-md xl:w-1/3 2xl:w-5/12`}
      >
        <div className="w-1/12">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-white p-1 font-light text-white`}
          >
            <div
              className={`h-full w-full bg-[url('/assets/1904labs_diamonds.png')] bg-cover`}
            ></div>
          </div>
        </div>
        <div className="ml-5">
          <p className="text-lg font-bold">1904Chat</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
      <p className="pt-2 text-sm text-1904labs-grey-300">{date}</p>
    </div>
  );
};

export default BotMessage;
