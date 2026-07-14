// Force HMR reload
"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import Spotlight from "@/icons/Spotlight";
import { sidebarData } from "@/lib/data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

type Props = {
  className?: string;
};

const Sidebar = ({ className }: Props) => {
  const pathName = usePathname();
  return (
    <div className={cn("w-fit min-w-[64px] h-screen sticky top-0 py-10 pl-6 pr-4 sm:px-4 border bg-background border-border flex-col items-start sm:items-center justify-start gap-10", className)}>
      <div>
        <Spotlight />
      </div>
      <div className="w-full h-full justify-between items-start sm:items-center flex flex-col">
        <div className="w-full h-fit flex flex-col gap-4 items-start sm:items-center justify-center">
          {sidebarData.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.link}
                    className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 w-full ${pathName.includes(item.link) ? "iconBackground" : " "}`}
                  >
                    <item.icon
                      className={`w-4 h-4 shrink-0 ${pathName.includes(item.link) ? " " : "opacity-80"}`}
                    />
                    <span className="sm:hidden font-medium text-sm whitespace-nowrap pr-2">
                      {item.title}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span className="text-sm">{item.title}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Sidebar;
