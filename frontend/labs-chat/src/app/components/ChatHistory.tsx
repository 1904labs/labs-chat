"use client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ChatHistoryListItem from "./ChatHistoryListItem";
import { getFormattedDateForUI } from "@/helpers/dates";
import { Session } from "../types";


interface Props {
  forceDisable: boolean,
}

const ChatHistory: FunctionComponent<Props> = ({ forceDisable }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  // TODO: implementation tbd
  function fetchSessions(): Session[] {
    return [{
      session_id: '12345',
      user_id: 'fake_user',
      timestamp: 1686567923456,
      conversation_s3_link: '',
      conversation_history: [],
      conversation_context: {token_size: 1, context: []},
      system_prompt: '',
      system_prompt_s3_ptr: '',
      session_name: 'some sesh',
      is_hidden: false,
      ai_stream: '',
    },
    {
      session_id: '54321',
      user_id: 'fake_user',
      timestamp: 1681117923456,
      conversation_s3_link: '',
      conversation_history: [],
      conversation_context: {token_size: 1, context: []},
      system_prompt: '',
      system_prompt_s3_ptr: '',
      session_name: 'an earlier one',
      is_hidden: false,
      ai_stream: '',
    }]
  }

  useEffect(() => {
    setSessions(fetchSessions());
  }, [])

  return (
    <div className={`flex flex-col flex-grow p-4 ${forceDisable && "opacity-30 pointer-events-none"}`} >
      <div className="flex items-center border-b pb-2 mb-4">
        <ChevronDownIcon className="h-5 w-5 mr-2 text-white stroke-white stroke-2" />
        <h2 className="text-xs text-white">Date Modified</h2>
      </div>
      <ul className="space-y-4">
        {sessions.map((s) => (
          <ChatHistoryListItem 
            key={`${s.timestamp}-${s.session_name}`}
            date={getFormattedDateForUI(new Date(s.timestamp))}
            title={s.session_name}
            onDeletePressed={() => console.log(`Delete pressed on ${s.session_name}`)}
            onEditPressed={() => console.log(`Edit pressed on ${s.session_name}`)}
          />
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;
