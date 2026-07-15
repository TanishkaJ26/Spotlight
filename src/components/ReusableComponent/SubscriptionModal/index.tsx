import { onGetStripeClientSecret } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PlusIcon from "@/icons/PlusIcon";
import { User } from "@prisma/client";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  user: User;
};

const SubscriptionModal = ({ user }: Props) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (!stripe || !elements) {
        return toast.error("Stripe not initialized");
      }

      const intent = await onGetStripeClientSecret(user.email, user.id);

      if (!intent?.secret) {
        throw new Error("Failed to initialize payment");
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intent.secret,
        { payment_method: { card: cardElement } },
      );

      if (error) {
        throw new Error(error.message);
      }

      console.log("Payment successful", paymentIntent);
      toast.success("Subscription activated successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.log("SUBSCRIPTION-->", error);
      toast.error("Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-xl flex gap-2 items-center hover:cursor-pointer p-2 sm:px-4 sm:py-2 border border-border bg-primary/10 backdrop-blur-sm text-sm font-normal text-primary hover:bg-primary/20">
          <PlusIcon />
          <span className="hidden sm:block">Create Webinar</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Spotlight Subscription</DialogTitle>
        </DialogHeader>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#B4B0AE",
                "::placeholder": {
                  color: "#B4B0AE",
                },
              },
            },
          }}
          className="border-[1px] outline-none rounded-lg p-3 w-full"
        />
        <DialogFooter className="gap-4 items-center">
          <DialogClose
            className="w-full sm:w-auto border border-border rounded-md px-3 py-2"
            disabled={loading}
          >
            Cancel
          </DialogClose>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
