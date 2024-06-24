import UserMessage from "@components/UserMessage.tsx";
import BotMessage from "@components/BotMessage";

const Chatmessage = ({ messageData, user = null }) => {
  if (messageData.speaker === "user") {
    return (
      <UserMessage
        speaker={messageData.speaker}
        message={messageData.message}
        date={messageData.date}
        user={user}
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
