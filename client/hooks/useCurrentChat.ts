import { IUser } from "@/types";
import { create } from "zustand";

type ICurrentChat = {
  currentChat: IUser | null;
  setCurrentChat: (user: IUser | null) => void;
};

export const useCurrentChat = create<ICurrentChat>()((set) => ({
  currentChat: null,
  setCurrentChat: (user) => set({ currentChat: user }),
}));
