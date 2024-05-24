'use client'
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";

const ChatHistoryListItem = ({title, date, onEditPressed = () => {}, onDeletePressed = () => {}}) => {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex flex-col text-white max-w-32 lg:max-w-40">
          <p className="text-md font-light truncate overflow-hidden">{title}</p>
          <p className="text-xs font-light">{date}</p>
        </div>
      </div>
      <div className="flex flex-row space-x-1 text-1904labs-green-500">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <PencilSquareIcon onClick={onEditPressed} className="h-5 w-5" />
        </div>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <TrashIcon onClick={onDeletePressed} className="h-5 w-5" />
        </div>
      </div>
    </li>
  );
};

export default ChatHistoryListItem;
