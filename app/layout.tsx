import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Nova_Square } from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";

import ThemeProvider from "@/providers/ThemeProvider";

import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";

import Navbar from "@/components/shared/Navbar";

const nova_square = Nova_Square({
  weight: "400",
  style: "normal",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remind Me",
  description: "Remind Me built with Next.js",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(nova_square.className, "dark")}
        style={{
          colorScheme: "dark",
        }}
      >
        <body>
          <ThemeProvider>
            <div className="min-h-screen w-full flex flex-col items-center justify-center dark:bg-neutral-950">
              <Navbar />
              <Separator />
              <main className="w-full h-full dark:bg-neutral-950 flex flex-grow items-center justify-center">
                {children}
                <Toaster />
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
