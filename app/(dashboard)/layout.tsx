"use client";

import { ReactNode, useState, useEffect } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI. We can avoid the hydration mismatch error.
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="w-full h-[85dvh] flex flex-col items-center mb-6">
      <div className="w-full flex flex-grow justify-center dark:bg-neutral-950">
        <div className="max-w-[920px] flex flex-grow flex-col px-4 pt-4 min-[420px]:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
