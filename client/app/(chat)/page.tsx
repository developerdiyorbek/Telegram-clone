"use client";

import ContactList from "./_components/ContactList";
import { useEffect } from "react";
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

const contacts: IUser[] = [
  {
    email: "diyorbeksulaymonov70@gmail.com",
    _id: "1",
    firstName: "Diyorbek",
    lastName: "Sulaymonov",
    bio: "I am a software engineer",
  },
  {
    email: "sardor@gmail.com",
    _id: "2",
    firstName: "Diyorbek",
    lastName: "Sulaymonov",
  },
  {
    email: "alibek@gmail.com",
    _id: "3",
    firstName: "Diyorbek",
    lastName: "Sulaymonov",
  },
  {
    email: "kamron@gmail.com",
    _id: "4",
    firstName: "Diyorbek",
    lastName: "Sulaymonov",
  },
];

const messages = [
  {
    text: "Hello world",
    id: 1,
  },
  {
    text: "Java",
    id: 2,
  },
  {
    text: "Javascript",
    id: 3,
  },
];

function Page() {
  const { currentChat } = useCurrentChat();
  const router = useRouter();

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { image: "", text: "" },
  });

  useEffect(() => {
    router.replace("/");
  }, []);

  const onCreateContact = (values: z.infer<typeof emailSchema>) => {
    console.log(values);
  };

  const onSendMessage = (values: z.infer<typeof messageSchema>) => {
    console.log(values);
  };

  return (
    <>
      <div className="w-80 h-screen border-r fixed inset-0 z-50">
        {/* <div className="w-full h-[95vh] flex justify-center items-center">
          <Loader2 size={50} className="animate-spin" />
        </div> */}

        <ContactList contacts={contacts} />
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
              messages={messages}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
