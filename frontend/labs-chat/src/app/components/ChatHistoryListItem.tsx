"use client";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { FunctionComponent } from "react";

interface Props {
  title: string;
  date: string;
  onClick: () => void;
  onEditPressed: () => void;
  onDeletePressed: () => void;
}

const ChatHistoryListItem: FunctionComponent<Props> = ({
  title,
  date,
  onClick = () => {},
  onEditPressed = () => {},
  onDeletePressed = () => {},
}) => {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center space-x-2" onClick={onClick}>
        <div className="flex max-w-32 flex-col text-white lg:max-w-40">
          <p className="text-md overflow-hidden truncate font-light">{title}</p>
          <p className="text-xs font-light">{date}</p>
        </div>
      </div>
      <div className="flex flex-row space-x-1 text-1904labs-green-500">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
          <PencilSquareIcon onClick={onEditPressed} className="h-5 w-5" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
          <TrashIcon onClick={onDeletePressed} className="h-5 w-5" />
        </div>
      </div>
    </li>
  );
};

export default ChatHistoryListItem;
