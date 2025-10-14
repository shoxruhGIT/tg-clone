import useAudio from "@/hooks/use-audio";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDown, PlayCircle } from "lucide-react";
import { SOUNDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

const NotificationForm = () => {
  const [selectedSound, setSelectedSound] = useState("");

  const { playSound } = useAudio();

  const onPlayedSound = (value: string) => {
    setSelectedSound(value);
    playSound(value);
  };

  return (
    <>
      <div className="flex items-center justify-between relative px-2">
        <div className="flex flex-col">
          <p className="font-spaceGrotesk">Notification Sound</p>
          <p className="font-spaceGrotesk text-muted-foreground text-xs">
            Apple
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button size={"sm"} className="cursor-pointer">
              Select <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 absolute -right-12">
            <div className="flex flex-col space-y-1">
              {SOUNDS.map((sound) => (
                <div
                  className={cn(
                    "flex justify-between items-center bg-secondary cursor-pointer hover:bg-primary-foreground",
                    selectedSound === sound.value && "bg-primary-foreground"
                  )}
                  key={sound.label}
                  onClick={() => onPlayedSound(sound.value)}
                >
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="justify-start cursor-pointer"
                  >
                    {sound.label}
                  </Button>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="cursor-pointer"
                  >
                    <PlayCircle />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-2 font-bold cursor-pointer">
              Submit
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center justify-between relative px-2">
        <div className="flex flex-col">
          <p className="font-spaceGrotesk">Sending Sound</p>
          <p className="font-spaceGrotesk text-muted-foreground text-xs">
            Apple
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button size={"sm"} className="cursor-pointer">
              Select <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 absolute -right-12">
            <div className="flex flex-col space-y-1">
              {SOUNDS.map((sound) => (
                <div
                  className={cn(
                    "flex justify-between items-center bg-secondary cursor-pointer hover:bg-primary-foreground",
                    selectedSound === sound.value && "bg-primary-foreground"
                  )}
                  key={sound.label}
                  onClick={() => onPlayedSound(sound.value)}
                >
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="justify-start"
                  >
                    {sound.label}
                  </Button>
                  <Button size={"icon"} variant={"ghost"}>
                    <PlayCircle />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-2 font-bold cursor-pointer">
              Submit
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center justify-between relative px-2">
        <div className="flex flex-col">
          <p>Mode Mute</p>
          <p className="text-muted-foreground text-xs">Muted</p>
        </div>
        <Switch className="cursor-pointer" />
      </div>
    </>
  );
};

export default NotificationForm;
