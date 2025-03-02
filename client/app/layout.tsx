import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import { ChildProps } from "@/types";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import MainProvider from "@/components/providers/MainProvider";

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Telegram web",
  description: "Telegram web application clone",
  icons: {
    icon: "/telegramIcon.svg",
  },
};

export default function RootLayout({ children }: ChildProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} antialiased sidebar-custom-scrollbar`}
        suppressHydrationWarning
      >
        <MainProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </MainProvider>
      </body>
    </html>
  );
}
