import { create } from "zustand";

type Store = {
  isCreating: boolean;
  setCreating: (isCreating: boolean) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  loadMessages: boolean;
  setLoadMessages: (loadMessages: boolean) => void;
  typing: string;
  setTyping: (typing: string) => void;
};

export const useLoading = create<Store>()((set) => ({
  isCreating: false,
  typing: "",
  setCreating: (isCreating) => set({ isCreating }),
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  loadMessages: false,
  setLoadMessages: (loadMessages) => set({ loadMessages }),
  setTyping: (typing) => set({ typing }),
}));
