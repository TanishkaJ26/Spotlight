import { Button } from "@/components/ui/button";
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { WebinarWithPresenter } from "@/lib/type";
import { ChevronRight, Loader2, Play, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  webinar: WebinarWithPresenter;
  userId: string;
};

const CTADialogBox = ({
  open,
  onOpenChange,
  trigger,
  webinar,
  userId,
}: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const handleClick = async () => {
    try {
      if (webinar?.ctaType === "BOOK_A_CALL") {
        router.push(`/live-webinar/${webinar.id}/call?attendeeId=${userId}`);
      } else {
        // Simulated Purchase Flow
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network request
        setPurchased(true);
      }
    } catch (err) {
      console.error("Error creating checkout link", err);
      toast.error("Error creating checkout link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
        {purchased ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 animate-in zoom-in duration-500" />
            <h2 className="text-2xl font-semibold text-center">Successfully Purchased!</h2>
            <p className="text-muted-foreground text-center">
              Thank you for purchasing {webinar.title}.
            </p>
            <DialogClose asChild>
              <Button className="mt-4" onClick={() => setPurchased(false)}>
                Continue
              </Button>
            </DialogClose>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-medium">
                {webinar?.ctaType === "BOOK_A_CALL" ? "Book a Call" : "Buy Now"}
              </DialogTitle>

              <p className="text-sm text-muted-foreground mt-1">
                {webinar?.ctaType === "BOOK_A_CALL"
                  ? "You will be redirected to a call on another page"
                  : "You are about to purchase this item"}
              </p>
            </DialogHeader>

            <div className="flex mt-4 space-x-4">
              <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                  <Play className="h-4 w-4" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium">{webinar.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {webinar.description}
                </p>
              </div>
            </div>

            <DialogFooter className="flex justify-between items-center mt-4 sm:mt-0">
              <DialogClose>Close</DialogClose>
              <Button
                onClick={handleClick}
                disabled={loading}
                className="flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : webinar?.ctaType === "BOOK_A_CALL" ? (
                  "Join Break-room"
                ) : (
                  "Buy Now"
                )}
                {!loading && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CTADialogBox;
