"use client";

import React, { useEffect, useRef, useState } from "react";
import ContactList from "./_component/contact-list";
import { useCurrentContact } from "@/hooks/use-current";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, messageSchema } from "@/lib/validation";
import z from "zod";
import AddContact from "./_component/add-contact";
import TopChat from "./_component/top-chat";
import Chat from "./_component/chat";
import { IMessage, IUser } from "@/types";
import { useLoading } from "@/hooks/use-loading";
import { useSession } from "next-auth/react";
import { axiosClient } from "@/http/axios";
import { generateToken } from "@/lib/generate-token";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { io } from "socket.io-client";
import useAudio from "@/hooks/use-audio";
import { CONST } from "@/lib/constants";

const HomePage = () => {
  const [contacts, setContacts] = useState<IUser[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { setIsLoading, isLoading, setIsCreating, setLoadMessages } =
    useLoading();

  const { currentContact, editedMessage, setEditedMessage } =
    useCurrentContact();
  const { data: session } = useSession();
  const { setOnlineUsers } = useAuth();
  const { playSound } = useAudio();

  const router = useRouter();
  const searchParams = useSearchParams();
  const socket = useRef<ReturnType<typeof io>>(null);

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
    setIsLoading(true);
    const token = await generateToken(session?.currentUser?._id);

    try {
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

  const getMessages = async () => {
    setLoadMessages(true);
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.get<{ messages: IMessage[] }>(
        `/api/user/messages/${currentContact?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(data.messages);
      setContacts((prev) =>
        prev.map((item) =>
          item._id === currentContact?._id
            ? {
                ...item,
                lastMessage: item.lastMessage
                  ? { ...item.lastMessage, status: CONST.READ }
                  : null,
              }
            : item
        )
      );
    } catch {
      toast.error("Failed to load message");
    } finally {
      setLoadMessages(false);
    }
  };

  // use effect for socket
  useEffect(() => {
    router.push("/");
    socket.current = io("ws://localhost:5000");
    return () => {
      socket.current?.disconnect();
    };
  }, []);

  // use effect for getMessage function
  useEffect(() => {
    if (currentContact?._id) {
      getMessages();
    }
  }, [currentContact?._id]);

  // use effect for getContacts function
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

  // use effect for write socket.current?.on
  useEffect(() => {
    if (session?.currentUser) {
      socket.current?.on("getCreatedUser", (user) => {
        setContacts((prev) => {
          const isExist = prev.some((item) => item._id === user._id);
          return isExist ? prev : [...prev, user];
        });
      });

      // socket getNewMessage
      socket.current?.on(
        "getNewMessage",
        ({ newMessage, sender, receiver }: GetSocketType) => {
          setMessages((prev) => {
            const isExist = prev.some((item) => item._id === newMessage._id);
            return isExist ? prev : [...prev, newMessage];
          });

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

          if (!receiver.muted) {
            playSound(receiver.notificationSound);
          }
        }
      );

      // socket getReadMessages
      socket.current?.on("getReadMessages", (messages: IMessage[]) => {
        setMessages((prev) => {
          return prev.map((item) => {
            const message = messages.find((msg) => msg._id === item._id);
            return message ? { ...item, status: CONST.READ } : item;
          });
        });
      });

      // socket getUpdateMessage
      socket.current?.on(
        "getUpdatedMessage",
        ({ updatedMessage, sender }: GetSocketType) => {
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
    }
  }, [session?.currentUser, CONTACT_ID]);

  const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
    setIsCreating(true);
    const token = await generateToken(session?.currentUser?._id);

    try {
      const { data } = await axiosClient.post<{ contact: IUser }>(
        "/api/user/contact",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContacts((prev) => [...prev, data.contact]);
      socket.current?.emit("createContact", {
        currentUser: session?.currentUser,
        receiver: data.contact,
      });
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

  const onSubmitMessage = async (values: z.infer<typeof messageSchema>) => {
    setIsCreating(true);
    if (editedMessage?._id) {
      onEditMessage(editedMessage._id, values.text);
    } else {
      onSendMessage(values);
    }
  };

  const onSendMessage = async (values: z.infer<typeof messageSchema>) => {
    setIsCreating(true);
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.post<GetSocketType>(
        "/api/user/message",
        {
          ...values,
          receiver: currentContact?._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, data.newMessage]);
      setContacts((prev) =>
        prev.map((msg) =>
          msg._id === currentContact?._id
            ? {
                ...msg,
                lastMessage: { ...data.newMessage, status: CONST.READ },
              }
            : msg
        )
      );
      messageForm.reset();
      socket.current?.emit("sendMessage", {
        newMessage: data.newMessage,
        receiver: data.receiver,
        sender: data.sender,
      });
    } catch (error) {
      toast.error("Connot send message");
    } finally {
      setIsCreating(false);
    }
  };

  const onReadMessage = async () => {
    const receivedMsg = messages
      .filter((msg) => msg.receiver._id === session?.currentUser?._id)
      .filter((msg) => msg.status !== CONST.READ);

    if (receivedMsg.length === 0) return;
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.post<{ messages: IMessage[] }>(
        "/api/user/message-read",
        { messages: receivedMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.current?.emit("readMessages", {
        messages: data.messages,
        receiver: currentContact,
      });
      setMessages((prev) => {
        return prev.map((item) => {
          const message = data.messages.find((msg) => msg._id === item._id);
          return message ? { ...item, status: CONST.READ } : item;
        });
      });
    } catch (error) {
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
        receiver: currentContact,
        sender: session?.currentUser,
      });
      messageForm.reset();
      setContacts((prev) =>
        prev.map((item) =>
          item._id === currentContact?._id
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
            <Chat
              messageForm={messageForm}
              onSubmitMessage={onSubmitMessage}
              messages={messages}
              onReadMessages={onReadMessage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;

interface GetSocketType {
  receiver: IUser;
  sender: IUser;
  newMessage: IMessage;
  updatedMessage: IMessage;
  deletedMessage: IMessage;
  filteredMessage: IMessage[];
}
