import { useCurrentContact } from "@/hooks/use-current";
import { CONST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
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
        <div className="right-1 bottom-0 absolute opacity-60 text-[9px] flex gap-[3px]">
          <p>{format(message.updatedAt, "HH:mm")}</p>
          <div className="self-end">
            {message.receiver._id === currentContact?._id &&
              (message.status === CONST.READ ? (
                <CheckCheck size={12} />
              ) : (
                <Check size={12} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
