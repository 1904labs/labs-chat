import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";

const Chatmessage = ({ messageData }) => {
  if (messageData.speaker == "user") {
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
