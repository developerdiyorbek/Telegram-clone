"use client";

import { IUser } from "@/types";
import React, { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, sliceText } from "@/lib/utils";
import { useCurrentChat } from "@/hooks/useCurrentChat";
import Settings from "./Settings";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { CONST } from "@/constants";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface Props {
  contacts: IUser[];
}
const ContactList: FC<Props> = ({ contacts }) => {
  const [query, setQuery] = useState("");
  const { onlineUsers } = useAuth();
  const { data: session } = useSession();

  const { setCurrentChat, currentChat } = useCurrentChat();

  const filteredContacts = contacts
    .filter((contact) =>
      contact.email.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = a.lastMessage?.updatedAt
        ? new Date(a.lastMessage.updatedAt).getTime()
        : 0;
      const dateB = b.lastMessage?.updatedAt
        ? new Date(b.lastMessage.updatedAt).getTime()
        : 0;
      return dateB - dateA;
    });

  const renderContact = (contact: IUser) => {
    const onChat = () => {
      if (currentChat?._id === contact._id) return;
      setCurrentChat(contact);
    };

    return (
      <div
        className={cn(
          "flex justify-between items-center cursor-pointer hover:bg-secondary/50 p-2",
          currentChat?._id === contact._id && "bg-secondary/50"
        )}
        onClick={onChat}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Avatar className="z-40">
              <AvatarImage
                src={contact.avatar}
                alt={contact.email}
                className="object-cover"
              />
              <AvatarFallback className="uppercase">
                {contact.email[0]}
              </AvatarFallback>
            </Avatar>
            {onlineUsers.some((item) => item._id === contact._id) && (
              <div className="size-3 bg-green-500 absolute rounded-full bottom-0 right-0 !z-40" />
            )}
          </div>

          <div className="max-md:hidden">
            <h2 className="capitalize line-clamp-1 text-sm">
              {contact.email.split("@")[0]}
            </h2>
            {contact.lastMessage?.image && (
              <div className="flex items-center gap-1">
                <div className="size-4 relative">
                  <Image
                    src={contact.lastMessage.image}
                    alt={contact.email}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <p
                  className={cn(
                    "text-xs line-clamp-1",
                    contact.lastMessage
                      ? contact.lastMessage?.sender._id ===
                        session?.currentUser?._id
                        ? "text-muted-foreground"
                        : contact.lastMessage.status !== CONST.READ
                        ? "text-foreground"
                        : "text-muted-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Photo
                </p>
              </div>
            )}
            {!contact.lastMessage?.image && (
              <p
                className={cn(
                  "text-xs line-clamp-1",
                  contact.lastMessage
                    ? contact.lastMessage?.sender._id ===
                      session?.currentUser?._id
                      ? "text-muted-foreground"
                      : contact.lastMessage.status !== CONST.READ
                      ? "text-foreground"
                      : "text-muted-foreground"
                    : "text-muted-foreground"
                )}
              >
                {contact.lastMessage
                  ? sliceText(contact.lastMessage.text, 25)
                  : "No messages yet"}
              </p>
            )}
          </div>
        </div>

        {contact.lastMessage && (
          <div className="self-end max-md:hidden">
            <p className="text-xs text-muted-foreground">
              {format(new Date(contact.lastMessage.createdAt), "hh:mm a")}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center bg-background pl-2 sticky top-0 z-50">
        <Settings />
        <div className="m-2 w-full">
          <Input
            className="bg-secondary max-md:hidden"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="max-md:mt-2">
        {filteredContacts.length === 0 ? (
          <div className="w-full h-[95vh] flex justify-center items-center text-center text-muted-foreground">
            <p>Contact list is empty</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div key={contact._id}>{renderContact(contact)}</div>
          ))
        )}
      </div>
    </>
  );
};

export default ContactList;
