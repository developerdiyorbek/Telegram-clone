"use client";

import { ChildProps } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import SessionProvider from "./SessionProvider";
import { isAxiosError } from "axios";

const handleCatchError = (error: Error) => {
  const message =
    (isAxiosError(error) && error.response?.data?.message) ||
    "An unknown error occurred";
  toast.error(message);
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: handleCatchError,
    },
  },
});

function MainProvider({ children }: ChildProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MainProvider;
