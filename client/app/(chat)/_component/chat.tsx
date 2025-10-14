import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { messageSchema } from "@/lib/validation";
import { Paperclip, Send, Smile } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface ChatProps {
  onSendMessage: (values: z.infer<typeof messageSchema>) => void;
  messageForm: UseFormReturn<z.infer<typeof messageSchema>>;
}

const Chat = ({ onSendMessage, messageForm }: ChatProps) => {
  const { resolvedTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;

    if (!input) return;

    const text = messageForm.getValues("text");
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const newText = text.slice(0, start) + emoji + text.slice(end);
    messageForm.setValue("text", newText);

    setTimeout(() => {
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  return (
    <div className="flex flex-col justify-end z-40 min-h-[92vh]">
      <Form {...messageForm}>
        <form
          onSubmit={messageForm.handleSubmit(onSendMessage)}
          className="w-full flex relative"
        >
          <Button
            size={"icon"}
            variant="secondary"
            className="cursor-pointer rounded-none"
          >
            <Paperclip />
          </Button>
          <FormField
            control={messageForm.control}
            name="text"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="bg-secondary border-l border-l-muted-foreground border-r border-r-muted-foreground h-9 rounded-none"
                    placeholder="Type a message"
                    value={field.value}
                    onBlur={() => field.onBlur()}
                    onChange={(e) => field.onChange(e.target.value)}
                    ref={inputRef}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size={"icon"}
                variant="secondary"
                className="cursor-pointer rounded-none"
              >
                <Smile />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none rounded-md absolute right-6 bottom-0">
              <Picker
                data={data}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
                onEmojiSelect={(emoji: { native: string }) =>
                  handleEmojiSelect(emoji.native)
                }
              />
            </PopoverContent>
          </Popover>

          <Button
            type="submit"
            size={"icon"}
            className="cursor-pointer rounded-none bg-blue-500 hover:bg-blue-600"
          >
            <Send />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Chat;
