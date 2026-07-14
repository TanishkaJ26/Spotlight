import { onAuthenticateUser } from "@/actions/auth";
import StarIcon from "@/icons/StarIcon";
import { getStripeOAuthLink } from "@/lib/stripe/utils";
import {
  LucideAlertCircle,
  LucideArrowRight,
  LucideCheckCircle2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { SignOutButton } from "@clerk/nextjs";

type Props = {};

const page = async (props: Props) => {
  const userExist = await onAuthenticateUser();
  if (!userExist.user) {
    redirect("/sign-in");
  }

  const isConnected = !!userExist?.user?.stripeConnectId;

  const stripeLink = getStripeOAuthLink(
    "api/stripe-connect",
    userExist.user.id,
  );

  return (
    <div className="w-full mx-auto py-2 sm:py-8 px-0 sm:px-4">
      <h1 className="text-2xl font-bold mb-6">Payment Integration</h1>
      <div className="w-full p-6 border border-input rounded-lg bg-background shadow-sm">
        <div className="flex flex-col sm:flex-row items-center mb-4 text-center sm:text-left">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mr-0 sm:mr-4 mb-2 sm:mb-0 shrink-0">
            <StarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary">
              Stripe Connect
            </h2>
            <p className="text-muted-foreground text-sm">
              Connect your Stripe account to start accepting payments
            </p>
          </div>
        </div>
        <div className="my-6 p-4 bg-muted rounded-md border border-border/50">
          <div className="flex items-start">
            {isConnected ? (
              <LucideCheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            ) : (
              <LucideAlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">
                {isConnected
                  ? "Your Stripe account is connected"
                  : "Your Stripe account is not connected yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isConnected
                  ? "You can now accept payments through your application"
                  : "Connect your Stripe account to start processing payments and managing subscriptions"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            {isConnected
              ? "You reconnect anytime if needed"
              : "You'll be redirected to Stripe to complete the connection"}
          </div>

          <Link
            href={stripeLink}
            className={`w-full sm:w-auto justify-center px-5 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
              isConnected
                ? "bg-muted hover:bg-muted/80 text-foreground border border-border"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20"
            }`}
          >
            {isConnected ? "Reconnect" : "Connect with Stripe"}
            <LucideArrowRight size={16} />
          </Link>
        </div>

        {!isConnected && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium mb-2">
              Why connect with Stripe?
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
                Process payments securely from customers worldwide
              </li>
              <li className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
                Manage subscriptions and recurring billing
              </li>
              <li className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
                Access detailed financial reporting and analytics
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="w-full p-6 border border-red-500/20 rounded-lg bg-background shadow-sm relative overflow-hidden mt-6">
        {/* Subtle red glow in the background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center mb-6 relative z-10 text-center sm:text-left">
          <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mr-0 sm:mr-4 mb-2 sm:mb-0 border border-red-500/20 shrink-0">
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary">
              Account Session
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage your active session on this device
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border relative z-10">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Sign out of your account securely. You will need to log in again to
            access the dashboard.
          </div>

          <SignOutButton>
            <button className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 transition-all bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 shadow-sm cursor-pointer">
              <LogOut size={16} />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default page;
