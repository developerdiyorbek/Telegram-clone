"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCurrentChat } from "@/hooks/useCurrentChat";
import { Settings2 } from "lucide-react";
import Image from "next/image";
import { IMessage } from "@/types";

interface IProps {
  messages: IMessage[];
}

function SettingsSheet({ messages }: IProps) {
  const { currentChat } = useCurrentChat();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"secondary"}>
          <Settings2 />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 p-2 overflow-y-scroll sidebar-custom-scrollbar">
        <SheetHeader>
          <SheetTitle />
        </SheetHeader>
        <div className="mx-auto w-1/2 h-36 relative">
          <Avatar className="w-full h-36">
            <AvatarImage
              src={currentChat?.avatar}
              alt={currentChat?.email}
              className="object-cover"
            />
            <AvatarFallback className="text-6xl uppercase font-spaceGrotesk">
              {currentChat?.email[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        <Separator className="my-2" />

        <h1 className="text-center capitalize font-spaceGrotesk text-xl">
          {currentChat?.email}
        </h1>

        <div className="flex flex-col space-y-1">
          {currentChat?.firstName && (
            <div className="flex items-center gap-1 mt-4">
              <p className="font-spaceGrotesk">First Name: </p>
              <p className="font-spaceGrotesk text-muted-foreground">
                {currentChat?.firstName}
              </p>
            </div>
          )}
          {currentChat?.lastName && (
            <div className="flex items-center gap-1 mt-4">
              <p className="font-spaceGrotesk">Last Name: </p>
              <p className="font-spaceGrotesk text-muted-foreground">
                {currentChat?.lastName}
              </p>
            </div>
          )}
          {currentChat?.bio && (
            <div className="flex items-center gap-1 mt-4">
              <p className="font-spaceGrotesk">
                About:{" "}
                <span className="font-spaceGrotesk text-muted-foreground">
                  {currentChat?.bio}
                </span>
              </p>
            </div>
          )}

          <Separator className="my-2" />

          <h2 className="text-xl">Image</h2>
          <div className="flex flex-col space-y-2">
            {messages
              .filter((msg) => msg.image)
              .map((msg) => (
                <div className="w-full h-36 relative" key={msg._id}>
                  <Image
                    src={msg.image}
                    alt={msg._id}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SettingsSheet;
