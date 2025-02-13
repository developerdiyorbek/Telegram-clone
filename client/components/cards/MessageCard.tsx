import { CONST } from "@/constants";
import { useCurrentChat } from "@/hooks/useCurrentChat";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

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
        <div className="right-1 bottom-0 absolute opacity-60 text-[9px] flex gap-[3px]">
          <p>{format(message.updatedAt, "hh:mm")}</p>
          <div className="self-end">
            {message.receiver._id === currentChat?._id &&
              (message.status === CONST.READ ? (
                <CheckCheck size={12} />
              ) : (
                <Check size={12} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
