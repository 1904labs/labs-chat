import UserMessage from "@components/UserMessage.tsx";
import BotMessage from "@components/BotMessage";

const Chatmessage = ({ messageData }) => {
  if (messageData.speaker === "user") {
    return (
      <UserMessage
        speaker={messageData.speaker}
        message={messageData.message}
        date={messageData.date}
      />
    );
  } else {
    return (
      <BotMessage
        speaker={messageData.speaker}
        message={messageData.message}
        date={messageData.date}
      />
    );
  }
};

export default Chatmessage;
