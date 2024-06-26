"use client";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ChatHistoryListItem from "@components/ChatHistoryListItem";
import { getFormattedDateForUI } from "@helpers/dates";
import { Session } from "@/app/types";
import { useChatHistory } from "@components/ClientChatHistoryProvider";
import { MEMORY } from "@helpers/memory";

interface Props {
  forceDisable: boolean;
}

const ChatHistory: FunctionComponent<Props> = ({ forceDisable }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { loadHistory } = useChatHistory();

  const fetchSessions = useCallback(async (): Promise<Session[]> => {
    return await fetch("/api/chatSessions", { method: "GET" })
      .then((r) => r.json())
      .then((rj) => rj as Session[])
      .catch((e) => {
        console.error(e);
        return [];
      });
  }, []);

  async function handleSessionClick(session_id: string) {
    try {
      const response = await fetch("/api/chatSession?sessionId=" + session_id);
      const session: Session = await response.json();
      MEMORY.loadSession(session);
      loadHistory(session.conversation_history);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchSessions().then((data) => setSessions(data));
  }, [fetchSessions]);

  return (
    <div
      className={`flex flex-grow flex-col p-4 ${forceDisable && "pointer-events-none opacity-30"}`}
    >
      <div className="mb-4 flex items-center border-b pb-2">
        <ChevronDownIcon className="mr-2 h-5 w-5 stroke-white stroke-2 text-white" />
        <h2 className="text-xs text-white">Date Modified</h2>
      </div>
      <ul className="space-y-4">
        {sessions.map((s) => (
          <ChatHistoryListItem
            key={`${s.timestamp}-${s.session_name}`}
            date={getFormattedDateForUI(new Date(s.timestamp))}
            title={s.session_name}
            onClick={() => {
              handleSessionClick(s.session_id);
            }}
            onDeletePressed={() =>
              console.log(`Delete pressed on ${s.session_name}`)
            }
            onEditPressed={() =>
              console.log(`Edit pressed on ${s.session_name}`)
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;
