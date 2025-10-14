"use client";

import React, { useEffect } from "react";
import ContactList from "./_component/contact-list";
import { useCurrentContact } from "@/hooks/use-current";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, messageSchema } from "@/lib/validation";
import z from "zod";
import AddContact from "./_component/add-contact";
import TopChat from "./_component/top-chat";
import Chat from "./_component/chat";

const HomePage = () => {
  const { currentContact } = useCurrentContact();
  const router = useRouter();

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "", image: "" },
  });

  useEffect(() => {
    if (!currentContact) {
      router.push("/");
    }
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
        <ContactList contacts={contacts} />
      </div>
      <div className="pl-80 w-full">
        {!currentContact?._id && (
          <AddContact
            contactForm={contactForm}
            onCreateContact={onCreateContact}
          />
        )}

        {currentContact?._id && (
          <div className="w-full relative">
            <TopChat />

            <Chat onSendMessage={onSendMessage} messageForm={messageForm} />
          </div>
        )}
      </div>
    </>
  );
};

const contacts = [
  {
    email: "john@gmail.com",
    _id: "1",
    avatar: "https://github.com/shadcn.png",
    firstName: "John",
    lastName: "Doe",
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis repellat blanditiis hic reiciendis quibusdam voluptatem necessitatibus, minus sint maxime iste impedit cupiditate ab provident doloremque sed dicta, molestias nemo cum.",
  },
  { email: "amile@gmail.com", _id: "2" },
  { email: "faris@gmail.com", _id: "3" },
  { email: "abdo@gmail.com", _id: "4" },
  { email: "billi@gmail.com", _id: "5" },
];

export default HomePage;
