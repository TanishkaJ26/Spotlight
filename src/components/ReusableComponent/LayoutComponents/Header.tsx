"use client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PurpleIcon from "./PurpleIcon";
import LightningIcon from "@/icons/LightningIcon";
import CreateWebinarButton from "../CreateWebinarButton";

type Props = { user: User };

//TODO: Stripe Subscription, Assistant

const Header = ({ user }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full px-4 pt-10 pb-4 mb-8 sticky top-0 z-10 flex justify-between items-center flex-wrap gap-4 bg-background">
      {pathname.includes("pipeline") ? (
        <Button
          className="bg-primary/10 border border-border rounded-xl"
          variant={"outline"}
          onClick={() => router.push("/webinar")}
        >
          <ArrowLeft />
        </Button>
      ) : (
        <div className="px-4 py-2 flex justify-center text-bold items-center rounded-xl bg-background border border-border capitalize">
          {pathname.split("/")[1]}
        </div>
      )}
      {/* TODO build stripe subscription and create webinar button */}
      <div className="flex gap-6 items-center flex-wrap">
        <PurpleIcon>
          <LightningIcon />
        </PurpleIcon>
        <CreateWebinarButton/>
      </div>
    </div>
  );
};

export default Header;
