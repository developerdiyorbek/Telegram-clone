"use client";

import { Loader2 } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { emailSchema, messageSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { IMessage, IUser } from "@/types";
import { io } from "socket.io-client";
import { useCurrentChat } from "@/hooks/useCurrentChat";
import { useAuth } from "@/hooks/useAuth";
import useAudio from "@/hooks/useAudio";
import { generateToken } from "@/lib/generateToken";
import { axiosClient } from "@/http/axios";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useLoading } from "@/hooks/useLoading";
import ContactList from "./_components/ContactList";
import AddContact from "./_components/AddContact";
import TopChat from "./_components/TopChat";
import Chat from "./_components/ChatMessages";
import { CONST } from "@/constants";

interface GetSocketType {
  receiver: IUser;
  sender: IUser;
  newMessage: IMessage;
  updatedMessage: IMessage;
  deletedMessage: IMessage;
  filteredMessages: IMessage[];
  message: string;
}

const HomePage = () => {
  const [contacts, setContacts] = useState<IUser[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { setCreating, setLoading, isLoading, setLoadMessages, setTyping } =
    useLoading();
  const { currentChat, setEditedMessage, editedMessage } = useCurrentChat();
  const { data: session } = useSession();
  const { setOnlineUsers } = useAuth();
  const { playSound } = useAudio();

  const router = useRouter();
  const searchParams = useSearchParams();
  const socket = useRef<ReturnType<typeof io> | null>(null);
  const CONTACT_ID = searchParams.get("chat");

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "", image: "" },
  });

  const getContacts = async () => {
    setLoading(true);
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.get<{ contacts: IUser[] }>(
        "/api/user/contacts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContacts(data.contacts);
    } catch {
      toast.error("Cannot fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const getMessages = async () => {
    setLoadMessages(true);
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.get<{ messages: IMessage[] }>(
        `/api/user/messages/${currentChat?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(data.messages);
      setContacts((prev) => {
        return prev.map((item) =>
          item._id === currentChat?._id
            ? {
                ...item,
                lastMessage: item.lastMessage
                  ? { ...item.lastMessage, status: CONST.READ }
                  : null,
              }
            : item
        );
      });
    } catch {
      toast.error("Cannot fetch messages");
    } finally {
      setLoadMessages(false);
    }
  };

  useEffect(() => {
    router.replace("/");

    socket.current = io("ws://localhost:9000", {
      transports: ["websocket"],
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (session?.currentUser?._id) {
      socket.current?.emit("addOnlineUser", session.currentUser);
      socket.current?.on(
        "getOnlineUsers",
        (data: { socketId: string; user: IUser }[]) => {
          setOnlineUsers(data.map((item) => item.user));
        }
      );
      getContacts();
    }
  }, [session?.currentUser]);

  useEffect(() => {
    if (session?.currentUser) {
      socket.current?.on("getCreatedUser", (user) => {
        setContacts((prev) => {
          const isExist = prev.some((item) => item._id === user._id);
          return isExist ? prev : [...prev, user];
        });
      });

      socket.current?.on(
        "getNewMessage",
        ({ newMessage, sender, receiver }: GetSocketType) => {
          setTyping("");
          if (CONTACT_ID === sender._id) {
            setMessages((prev) => [...prev, newMessage]);
          }
          setContacts((prev) => {
            return prev.map((contact) => {
              if (contact._id === sender._id) {
                return {
                  ...contact,
                  lastMessage: {
                    ...newMessage,
                    status:
                      CONTACT_ID === sender._id
                        ? CONST.READ
                        : newMessage.status,
                  },
                };
              }
              return contact;
            });
          });
          // toast.success(`${sender?.email.split("@")[0]} sent you a message`);
          if (!receiver.muted) {
            playSound(receiver.notificationSound);
          }
        }
      );

      socket.current?.on("getReadMessages", (messages: IMessage[]) => {
        setMessages((prev) => {
          return prev.map((item) => {
            const message = messages.find((msg) => msg._id === item._id);
            return message ? { ...item, status: CONST.READ } : item;
          });
        });
      });

      socket.current?.on(
        "getUpdatedMessage",
        ({ updatedMessage, sender }: GetSocketType) => {
          setTyping("");
          setMessages((prev) =>
            prev.map((item) =>
              item._id === updatedMessage._id
                ? {
                    ...item,
                    reaction: updatedMessage.reaction,
                    text: updatedMessage.text,
                  }
                : item
            )
          );
          setContacts((prev) =>
            prev.map((item) =>
              item._id === sender._id
                ? {
                    ...item,
                    lastMessage:
                      item.lastMessage?._id === updatedMessage._id
                        ? updatedMessage
                        : item.lastMessage,
                  }
                : item
            )
          );
        }
      );

      socket.current?.on(
        "getDeletedMessage",
        ({ deletedMessage, sender, filteredMessages }: GetSocketType) => {
          setMessages((prev) =>
            prev.filter((item) => item._id !== deletedMessage._id)
          );
          const lastMessage = filteredMessages.length
            ? filteredMessages[filteredMessages.length - 1]
            : null;
          setContacts((prev) =>
            prev.map((item) =>
              item._id === sender._id
                ? {
                    ...item,
                    lastMessage:
                      item.lastMessage?._id === deletedMessage._id
                        ? lastMessage
                        : item.lastMessage,
                  }
                : item
            )
          );
        }
      );

      // typing
      socket.current?.on("getTyping", ({ message, sender }: GetSocketType) => {
        if (CONTACT_ID === sender._id) {
          setTyping(message);
        }
      });
    }
  }, [session?.currentUser, socket]);

  useEffect(() => {
    if (currentChat?._id) {
      getMessages();
    }
  }, [currentChat]);

  const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
    setCreating(true);
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.post<{ contact: IUser }>(
        "/api/user/contact",
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContacts((prev) => [...prev, data.contact]);
      socket.current?.emit("createContact", {
        currentUser: session?.currentUser,
        receiver: data.contact,
      });
      toast.success("Contact added successfully");
      contactForm.reset();
    } catch (error) {
      const message =
        (isAxiosError(error) && error.response?.data?.message) ||
        "An unknown error occurred";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const onSubmitMessage = async (values: z.infer<typeof messageSchema>) => {
    setCreating(true);
    if (editedMessage?._id) {
      onEditMessage(editedMessage._id, values.text);
    } else {
      onSendMessage(values);
    }
  };

  const onSendMessage = async (values: z.infer<typeof messageSchema>) => {
    setCreating(true);
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.post<GetSocketType>(
        "/api/user/message",
        { ...values, receiver: currentChat?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, data.newMessage]);

      setContacts((prev) =>
        prev.map((contact: IUser) =>
          contact._id === currentChat?._id
            ? {
                ...contact,
                lastMessage: { ...data.newMessage, status: CONST.READ },
              }
            : contact
        )
      );
      messageForm.reset();

      socket.current?.emit("sendMessage", {
        newMessage: data.newMessage,
        receiver: data.receiver,
        sender: data.sender,
      });
    } catch {
      toast.error("Cannot send message");
    } finally {
      setCreating(false);
    }
  };

  const onReadMessages = async () => {
    const receivedMessages = messages
      .filter((message) => message.receiver._id === session?.currentUser?._id)
      .filter((message) => message.status !== CONST.READ);

    if (receivedMessages.length === 0) return;

    const token = await generateToken(session?.currentUser?._id);

    try {
      const { data } = await axiosClient.post<{ messages: IMessage[] }>(
        "/api/user/message-read",
        { messages: receivedMessages },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.current?.emit("readMessages", {
        messages: data.messages,
        receiver: currentChat,
      });

      setMessages((prev) => {
        return prev.map((item) => {
          const message = data.messages.find((msg) => msg._id === item._id);
          return message ? { ...item, status: CONST.READ } : item;
        });
      });
    } catch {
      toast.error("Cannot read messages");
    }
  };

  const onEditMessage = async (messageId: string, text: string) => {
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.put<{ updatedMessage: IMessage }>(
        `/api/user/message/${messageId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((item) =>
          item._id === data.updatedMessage._id
            ? { ...item, text: data.updatedMessage.text }
            : item
        )
      );
      socket.current?.emit("updateMessage", {
        updatedMessage: data.updatedMessage,
        receiver: currentChat,
        sender: session?.currentUser,
      });
      messageForm.reset();
      setContacts((prev) =>
        prev.map((item) =>
          item._id === currentChat?._id
            ? {
                ...item,
                lastMessage:
                  item.lastMessage?._id === messageId
                    ? data.updatedMessage
                    : item.lastMessage,
              }
            : item
        )
      );
      setEditedMessage(null);
    } catch {
      toast.error("Cannot edit message");
    }
  };

  const onReaction = async (reaction: string, messageId: string) => {
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.post<{ updatedMessage: IMessage }>(
        "/api/user/reaction",
        { reaction, messageId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((item) =>
          item._id === data.updatedMessage._id
            ? { ...item, reaction: data.updatedMessage.reaction }
            : item
        )
      );
      socket.current?.emit("updateMessage", {
        updatedMessage: data.updatedMessage,
        receiver: currentChat,
        sender: session?.currentUser,
      });
    } catch {
      toast.error("Cannot react to message");
    }
  };

  const onDeleteMessage = async (messageId: string) => {
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.delete<{ deletedMessage: IMessage }>(
        `/api/user/message/${messageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const filteredMessages = messages.filter(
        (item) => item._id !== data.deletedMessage._id
      );
      const lastMessage = filteredMessages.length
        ? filteredMessages[filteredMessages.length - 1]
        : null;
      setMessages(filteredMessages);
      socket.current?.emit("deleteMessage", {
        deletedMessage: data.deletedMessage,
        sender: session?.currentUser,
        receiver: currentChat,
        filteredMessages,
      });
      setContacts((prev) =>
        prev.map((item) =>
          item._id === currentChat?._id
            ? {
                ...item,
                lastMessage:
                  item.lastMessage?._id === messageId
                    ? lastMessage
                    : item.lastMessage,
              }
            : item
        )
      );
    } catch {
      toast.error("Cannot delete message");
    }
  };

  const onTyping = (e: ChangeEvent<HTMLInputElement>) => {
    socket.current?.emit("typing", {
      receiver: currentChat,
      sender: session?.currentUser,
      message: e.target.value,
    });
  };

  return (
    <>
      <div className="w-80 h-screen border-r fixed inset-0 z-50">
        {isLoading && (
          <div className="w-full h-[95vh] flex justify-center items-center">
            <Loader2 size={50} className="animate-spin" />
          </div>
        )}

        {!isLoading && <ContactList contacts={contacts} />}
      </div>
      <div className="pl-80 w-full">
        {!currentChat?._id && (
          <AddContact
            contactForm={contactForm}
            onCreateContact={onCreateContact}
          />
        )}

        {currentChat?._id && (
          <div className="w-full relative">
            <TopChat messages={messages} />
            <Chat
              messageForm={messageForm}
              onSubmitMessage={onSubmitMessage}
              messages={messages}
              onReadMessages={onReadMessages}
              onReaction={onReaction}
              onDeleteMessage={onDeleteMessage}
              onTyping={onTyping}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
