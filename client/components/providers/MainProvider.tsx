"use client";

import { ChildProps } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import SessionProvider from "./SessionProvider";

const queryClient = new QueryClient();

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
