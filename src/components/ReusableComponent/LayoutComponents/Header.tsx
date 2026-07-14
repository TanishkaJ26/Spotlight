"use client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import PurpleIcon from "./PurpleIcon";
import LightningIcon from "@/icons/LightningIcon";
import CreateWebinarButton from "../CreateWebinarButton";
import Stripe from "stripe";
import { StripeElements } from "../Stripe/Element";
import SubscriptionModal from "../SubscriptionModal";
import { Assistant } from "@vapi-ai/server-sdk/api";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

type Props = {
  user: User;
  stripeProducts: Stripe.Product[] | [];
  assistants: Assistant[] | [];
};

//TODO: Stripe Subscription, Assistant

const Header = ({ user, stripeProducts, assistants }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full px-0 sm:px-4 pt-10 sm:pt-10 pb-8 mb-0 sm:mb-8 sticky top-0 z-10 flex justify-between items-center flex-wrap gap-4 bg-background">
      <div className="flex items-center gap-4">
        <div className="sm:hidden block">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-primary/10 border-border"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-fit bg-transparent border-none shadow-none [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Sidebar className="flex h-full w-full" />
            </SheetContent>
          </Sheet>
        </div>

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
      </div>
      {/* TODO build stripe subscription and create webinar button */}
      <div className="flex gap-4 sm:gap-6 items-center">
        <div className="hidden sm:block">
          <PurpleIcon>
            <LightningIcon />
          </PurpleIcon>
        </div>
        {user.subscription ? (
          <CreateWebinarButton
            stripeProducts={stripeProducts}
            assistants={assistants}
          />
        ) : (
          <StripeElements>
            <SubscriptionModal user={user} />
          </StripeElements>
        )}
      </div>
    </div>
  );
};

export default Header;
