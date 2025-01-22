import { useCurrentChat } from "@/hooks/useCurrentChat";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";

interface Props {
  message: IMessage;
}

const MessageCard = ({ message }: Props) => {
  const { currentChat } = useCurrentChat();

  return (
    <div
      className={cn(
        "m-2.5 font-medium text-xs flex",
        message.receiver._id === currentChat?._id
          ? "justify-start"
          : "justify-end"
      )}
    >
      <div
        className={cn(
          "relative inline p-2 pl-2.5 pr-12 max-w-full",
          message.receiver._id === currentChat?._id
            ? "bg-primary"
            : "bg-secondary"
        )}
      >
        <p className="text-sm text-white">{message.text}</p>
        <span className="text-xs right-1 bottom-0 absolute opacity-60">✓</span>
      </div>
    </div>
  );
};

export default MessageCard;
