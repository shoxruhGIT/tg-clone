import { useCurrentContact } from "@/hooks/use-current";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import React from "react";

interface MessageCardProps {
  message: IMessage;
}

const MessageCard = ({ message }: MessageCardProps) => {
  const { currentContact } = useCurrentContact();

  return (
    <div
      className={cn(
        "m-2.5 font-medium text-xs flex",
        message.receiver._id === currentContact?._id
          ? "justify-end"
          : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative inline p-2 pl-2.5 pr-12 max-w-full",
          message.receiver._id === currentContact?._id
            ? "bg-blue-500"
            : "bg-secondary"
        )}
      >
        <p className="text-sm text-white">{message.text}</p>
        <span className="text-xs right-1 bottom-0 absolute opacity-60">✓</span>
      </div>
    </div>
  );
};

export default MessageCard;
