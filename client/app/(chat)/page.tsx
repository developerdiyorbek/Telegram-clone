"use client";

import ContactList from "./_components/ContactList";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AddContact from "./_components/AddContact";
import { useCurrentChat } from "@/hooks/useCurrentChat";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { emailSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import TopChat from "./_components/TopChat";
import ChatMessages from "./_components/ChatMessages";

const contacts = [
  {
    email: "diyorbeksulaymonov70@gmail.com",
    _id: "1",
  },
  {
    email: "sardor@gmail.com",
    _id: "2",
  },
  {
    email: "alibek@gmail.com",
    _id: "3",
  },
  {
    email: "kamron@gmail.com",
    _id: "4",
  },
];

function Page() {
  const { currentChat } = useCurrentChat();
  const router = useRouter();
  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    router.replace("/");
  }, []);

  const onCreateContact = (values: z.infer<typeof emailSchema>) => {
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
            <ChatMessages />
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
