import MessageCard from "@/components/cards/MessageCard";
import ChatLoading from "./ChatLoading";

function ChatMessages() {
  return (
    <div className="flex flex-col justify-end z-40 min-h-[92vh]">
      {/* Loading */}
      {/* <ChatLoading /> */}
      {/* Messages */}
      <MessageCard isReceived />

      {/* Message input */}
    </div>
  );
}

export default ChatMessages;
