"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { IUser } from "@/types";
import { useLoading } from "@/hooks/use-loading";
import { useSession } from "next-auth/react";
import { axiosClient } from "@/http/axios";
import { generateToken } from "@/lib/generate-token";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { io } from "socket.io-client";

const HomePage = () => {
  const [contacts, setContacts] = useState<IUser[]>([]);

  const { setIsLoading, isLoading, setIsCreating } = useLoading();

  const { currentContact } = useCurrentContact();
  const { data: session } = useSession();
  const { setOnlineUsers } = useAuth();

  const router = useRouter();
  const socket = useRef<ReturnType<typeof io>>(null);

  const getContacts = async () => {
    setIsLoading(true);
    try {
      const token = await generateToken(session?.currentUser?._id);
      const { data } = await axiosClient.get<{ contacts: IUser[] }>(
        "/api/user/contacts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContacts(data.contacts);
    } catch (error) {
      toast.error("Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    router.push("/");
    socket.current = io("ws://localhost:5000");
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

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "", image: "" },
  });

  const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
    setIsCreating(true);

    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.post<{ contacts: IUser }>(
        "/api/user/contact",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContacts((prev) => [...prev, data.contacts]);
      toast.success("Contact created successfully");
      contactForm.reset();
    } catch (error: any) {
      if (error.response?.data?.message) {
        return toast.error(error.response.data.message);
      }
      return toast.error("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const onSendMessage = (values: z.infer<typeof messageSchema>) => {
    console.log(values);
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-80 h-screen border-r fixed inset-0 z-50">
        {/* Loading */}
        {isLoading && (
          <div className="w-full h-[95vh] flex justify-center items-center">
            <Loader2 size={50} className="animate-spin" />
          </div>
        )}

        {/* Contact list */}
        {!isLoading && <ContactList contacts={contacts} />}
      </div>
      {/* Chat area */}
      <div className="pl-80 w-full">
        {/* Add contact */}
        {!currentContact?._id && (
          <AddContact
            contactForm={contactForm}
            onCreateContact={onCreateContact}
          />
        )}

        {/* Chat */}
        {currentContact?._id && (
          <div className="w-full relative">
            {/*Top Chat  */}
            <TopChat />
            {/* Chat messages */}
            <Chat messageForm={messageForm} onSendMessage={onSendMessage} />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
