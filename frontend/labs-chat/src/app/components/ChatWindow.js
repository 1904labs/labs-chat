"use client";

import Image from 'next/image';

const botlogo = '/assets/1904labs_diamonds.png'

const ChatWindow = () => {
  return (
    <div className="w-full lg:w-full 2xl:w-2/3 overflow-y-auto bg-white bg-opacity-90">
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col items-start justify-start">
          <div className="flex bg-1904labs-blue-300 rounded-lg p-4 drop-shadow-md shadow-lg w-8/12">
            <div className="w-1/12">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-white font-light p-1">
                <div className={`bg-[url('/assets/1904labs_diamonds.png')] bg-cover w-full h-full`}></div>
              </div>
            </div>
            <div className="ml-5">
              <p className="text-lg font-bold">1904Chat</p>
              <p className="text-sm">Hello! How can I assist you today?</p>
            </div>
          </div>
          <p className="text-sm pt-2 text-1904labs-grey-300">
            [2024-02-20] 4:30pm
          </p>
        </div>
        <div className="flex flex-col items-end justify-end ">
          <div className="flex bg-1904labs-white p-5 rounded-lg drop-shadow-md shadow-lg w-8/12">
            <div className="w-1/12">
              <div className="w-12 h-12 bg-1904labs-blue-500 rounded-full flex items-center justify-center text-white font-light">
                MR
              </div>
            </div>
            <div className="ml-5">
              <p className="text-lg font-bold">Max Ryan</p>
              <p className="text-gray-500 text-sm">
                I have a question about the product.
              </p>
            </div>
          </div>
          <p className="text-sm pt-2 text-1904labs-grey-300">
            [2024-02-20] 4:30pm
          </p>
        </div>
        {/* Add more messages here */}
      </div>
    </div>
  );
};

export default ChatWindow;
