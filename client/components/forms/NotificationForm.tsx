"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDown, Ghost, PlayCircle } from "lucide-react";
import { cn, getSoundLabel } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { SOUNDS } from "@/constants";
import useAudio from "@/hooks/useAudio";
import { Separator } from "../ui/separator";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { axiosClient } from "@/http/axios";
import { generateToken } from "@/lib/generateToken";
import toast from "react-hot-toast";

interface IPayload {
  notificationSound?: string;
  sendingSound?: string;
  muted?: boolean;
}

const NotificationForm = () => {
  const [isNotification, setIsNotification] = useState(false);
  const [isSounding, setIsSounding] = useState(false);
  const [selectedSound, setSelectedSound] = useState("");
  const { playSound } = useAudio();
  const { data: session, update } = useSession();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: IPayload) => {
      const token = await generateToken(session?.currentUser?._id);
      const { data } = await axiosClient.put("/api/user/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      update();
      setIsNotification(false);
      setIsSounding(false);
    },
  });

  const onPlaySound = (value: string) => {
    setSelectedSound(value);
    playSound(value);
  };

  return (
    <>
      <div className="flex items-center justify-between relative">
        <div className="flex flex-col">
          <p className="font-spaceGrotesk">Notification Sound</p>
          <p className="font-spaceGrotesk text-muted-foreground text-xs">
            {getSoundLabel(session?.currentUser?.notificationSound)}
          </p>
        </div>

        <Popover open={isNotification} onOpenChange={setIsNotification}>
          <PopoverTrigger asChild>
            <Button size={"sm"}>
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
                  onClick={() => onPlaySound(sound.value)}
                >
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="justify-start"
                  >
                    {sound.label}
                  </Button>
                  {session?.currentUser?.notificationSound === sound.value ? (
                    <Button size={"icon"}>
                      <Ghost />
                    </Button>
                  ) : (
                    <Button size={"icon"} variant={"ghost"}>
                      <PlayCircle />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              className="w-full mt-2 font-bold"
              disabled={isPending}
              onClick={() => mutate({ notificationSound: selectedSound })}
            >
              Submit
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <Separator className="my-3" />
      <div className="flex items-center justify-between relative">
        <div className="flex flex-col">
          <p className="font-spaceGrotesk">Sending Sound</p>
          <p className="font-spaceGrotesk text-muted-foreground text-xs">
            {getSoundLabel(session?.currentUser?.sendingSound)}
          </p>
        </div>

        <Popover open={isSounding} onOpenChange={setIsSounding}>
          <PopoverTrigger asChild>
            <Button size={"sm"}>
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
                  onClick={() => onPlaySound(sound.value)}
                >
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="justify-start"
                  >
                    {sound.label}
                  </Button>
                  {session?.currentUser?.sendingSound === sound.value ? (
                    <Button size={"icon"}>
                      <Ghost />
                    </Button>
                  ) : (
                    <Button size={"icon"} variant={"ghost"}>
                      <PlayCircle />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              className="w-full mt-2 font-bold"
              disabled={isPending}
              onClick={() => mutate({ sendingSound: selectedSound })}
            >
              Submit
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <Separator className="my-3" />
      <div className="flex items-center justify-between relative">
        <div className="flex flex-col">
          <p>Mode Mute</p>
          <p className="text-muted-foreground text-xs">
            {!session?.currentUser?.muted ? "Muted" : "Unmuted"}
          </p>
        </div>
        <Switch
          checked={!session?.currentUser?.muted}
          onCheckedChange={() =>
            mutate({ muted: !session?.currentUser?.muted })
          }
          disabled={isPending}
        />
      </div>
    </>
  );
};

export default NotificationForm;
