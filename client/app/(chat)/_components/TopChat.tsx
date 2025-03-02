import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentChat } from "@/hooks/useCurrentChat";
import SettingsSheet from "./SettingsSheet";
import { useAuth } from "@/hooks/useAuth";
import { useLoading } from "@/hooks/useLoading";
import { sliceText } from "@/lib/utils";
import { IMessage } from "@/types";

interface IProps {
  messages: IMessage[];
}

const TopChat = ({ messages }: IProps) => {
  const { currentChat } = useCurrentChat();
  const { onlineUsers } = useAuth();
  const { typing } = useLoading();

  return (
    <div className="w-full flex items-center justify-between sticky top-0 z-50 h-[8vh] p-2 border-b bg-background">
      <div className="flex items-center">
        <Avatar className="z-40">
          <AvatarImage
            src={currentChat?.avatar}
            alt={currentChat?.email}
            className="object-cover"
          />
          <AvatarFallback className="uppercase">
            {currentChat?.email[0]}
          </AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <h2 className="font-medium text-sm">{currentChat?.email}</h2>
          {typing.length > 0 ? (
            <div className="text-xs flex items-center gap-1 text-muted-foreground">
              <p className="text-secondary-foreground animate-pulse line-clamp-1">
                {sliceText(typing, 20)}
              </p>
              <div className="self-end mb-1">
                <div className="flex justify-center items-center gap-1">
                  <div className="w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:-0.10s]"></div>
                  <div className="w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs">
              {onlineUsers.some((item) => item._id === currentChat?._id) ? (
                <span className="text-green-500">● online</span>
              ) : (
                <span className="text-muted-foreground">
                  ● Last seen recently
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <SettingsSheet messages={messages} />
    </div>
  );
};

export default TopChat;
