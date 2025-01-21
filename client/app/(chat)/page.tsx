"use client";

import ContactList from "./_components/ContactList";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AddContact from "./_components/AddContact";
import { useCurrentChat } from "@/hooks/useCurrentChat";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { emailSchema, messageSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import TopChat from "./_components/TopChat";
import ChatMessages from "./_components/ChatMessages";
import { IUser } from "@/types";
import { useLoading } from "@/hooks/useLoading";
import { useSession } from "next-auth/react";
import { axiosClient } from "@/http/axios";
import { generateToken } from "@/lib/generateToken";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";

function Page() {
  const [contacts, setContacts] = useState<IUser[]>([]);
  const { currentChat } = useCurrentChat();
  const { setCreating, setLoading, isLoading } = useLoading();
  const { data: session } = useSession();
  const { setOnlineUsers } = useAuth();
  const router = useRouter();
  const socket = useRef<ReturnType<typeof io> | null>(null);

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { image: "", text: "" },
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
    socket.current?.on("getCreatedUser", (user) => {
      setContacts((prev) => {
        const isExist = prev.some((item) => item._id === user._id);
        return isExist ? prev : [...prev, user];
      });
    });
  }, [session?.currentUser, socket]);

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
  const onSendMessage = (values: z.infer<typeof messageSchema>) => {
    console.log(values);
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
            <TopChat />
            <ChatMessages
              messageForm={messageForm}
              onSendMessage={onSendMessage}
              messages={[]}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
