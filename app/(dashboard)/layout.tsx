import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="w-full flex flex-grow justify-center dark:bg-neutral-950">
        <div className="max-w-[920px] flex flex-grow flex-col px-4 py-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
