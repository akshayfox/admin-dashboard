import { FC } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: FC<HeaderProps> = ({ children }) => {
  return (
    <header className={cn(
      "sticky top-0 z-30 w-full border-b",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="flex h-16 items-center px-6">
        <div className="flex flex-1 items-center justify-end gap-4">
          {children}
        </div>
      </div>
    </header>
  );
};
