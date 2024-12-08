import { IUser } from "@/types";
import { useState } from "react";

function useCurrentChat() {
  const [currentContact, setCurrentContact] = useState<IUser | null>(null);
  return { currentContact, setCurrentContact };
}

export default useCurrentChat;
