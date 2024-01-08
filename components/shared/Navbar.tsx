"use client";

import { UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Logo from "@/components/shared/Logo";
import { Theme } from "@/components/shared/Icons";
import ThemeSwitcher from "@/components/Theme/ThemeSwitcher";

const Navbar = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 420px)" });
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI. We can avoid the hydration mismatch error.
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <nav className="w-full flex items-center justify-between p-4 sm:px-8 h-[60px]">
      <Logo />
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/sign-in" />
        {isMobile ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                <Theme />
              </Button>
            </PopoverTrigger>
            <PopoverContent asChild>
              <ThemeSwitcher />
            </PopoverContent>
          </Popover>
        ) : (
          <ThemeSwitcher />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
