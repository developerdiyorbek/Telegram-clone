import { IMessage, IUser } from "@/types";
import { create } from "zustand";

type ICurrentChat = {
  currentChat: IUser | null;
  setCurrentChat: (user: IUser | null) => void;
  editedMessage: IMessage | null;
  setEditedMessage: (message: IMessage | null) => void;
};

export const useCurrentChat = create<ICurrentChat>()((set) => ({
  currentChat: null,
  setCurrentChat: (user) => set({ currentChat: user }),
  editedMessage: null,
  setEditedMessage: (message) => set({ editedMessage: message }),
}));
