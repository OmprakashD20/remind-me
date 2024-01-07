import { UserButton } from "@clerk/nextjs";

import Logo from "./Logo";
import ThemeSwitcher from "../Theme/ThemeSwitcher";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between p-4 px-8 h-[60px]">
      <Logo />
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
