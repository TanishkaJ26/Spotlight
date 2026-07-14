"use client";
import { registerAttendee } from "@/actions/attendance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { WebinarStatusEnum } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
  onRegistered?: () => void;
};

const WaitListComponent = ({
  webinarId,
  webinarStatus,
  onRegistered,
}: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  const { setAttendee } = useAttendeeStore();
  const router = useRouter();

  const buttonText = () => {
    switch (webinarStatus) {
      case WebinarStatusEnum.SCHEDULED:
        return "Get Reminder";
      case WebinarStatusEnum.WAITING_ROOM:
        return "Join Webinar";
      case WebinarStatusEnum.LIVE:
        return "Join Webinar";
      default:
        return "Register";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Please enter a valid email address";
    if (!phone.match(/^\d{10}$/)) newErrors.phone = "Phone number must be exactly 10 digits";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await registerAttendee({
        email,
        name,
        phone,
        webinarId,
      });

      if (!res.success) {
        throw new Error(res.message || "Something went wrong!");
      }

      if (res.data?.user) {
        setAttendee(res.data.user);
      }

      toast.success(
        webinarStatus === WebinarStatusEnum.LIVE
          ? "Successfully joined the webinar!"
          : "Successfully registered for webinar!",
      );
      setEmail("");
      setName("");
      setPhone("");
      setSubmitted(true);

      setTimeout(() => {
        setIsOpen(false);

        if (webinarStatus === WebinarStatusEnum.LIVE) {
          router.refresh();
        }

        if (onRegistered) onRegistered();
      }, 1500);
    } catch (error) {
      console.error("Error submitting waitlist form:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${
            webinarStatus === WebinarStatusEnum.LIVE
              ? "bg-red-800 hover:bg-red-900 text-white"
              : "bg-primary hover:bg-primary/90 text-black"
          } rounded-md px-4 py-2 text-sm font-bold`}
        >
          {webinarStatus === WebinarStatusEnum.LIVE && (
            <span className="mr-2 h-2 w-2 bg-white rounded-full animate-pulse"></span>
          )}
          {buttonText()}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-0 bg-background" showCloseButton={false}>
        {/* <DialogHeader className="justify-center items-center border border-input rounded-xl p-4 bg-background"> */}
        <DialogTitle className="text-center text-lg font-semibold mb-4">
          {webinarStatus === WebinarStatusEnum.LIVE
            ? "Join the Webinar"
            : "Join the Waitlist"}
        </DialogTitle>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full">
          {!submitted && (
            <React.Fragment>
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className={errors.name ? "text-red-400" : ""}
                >
                  Your Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={cn(
                    "!bg-background/50 border border-input",
                    errors.name && "border-red-400 focus-visible:ring-red-400"
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={errors.email ? "text-red-400" : ""}
                >
                  Your Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={cn(
                    "!bg-background/50 border border-input",
                    errors.email && "border-red-400 focus-visible:ring-red-400"
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className={errors.phone ? "text-red-400" : ""}
                >
                  Your Phone Number <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your Phone Number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  maxLength={10}
                  className={cn(
                    "!bg-background/50 border border-input",
                    errors.phone && "border-red-400 focus-visible:ring-red-400"
                  )}
                />
                {errors.phone && (
                  <p className="text-sm text-red-400">{errors.phone}</p>
                )}
              </div>
            </React.Fragment>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || submitted}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                {webinarStatus === WebinarStatusEnum.LIVE
                  ? "Joining..."
                  : "Registering..."}
              </>
            ) : submitted ? (
              webinarStatus === WebinarStatusEnum.LIVE ? (
                "You're all set to join!"
              ) : (
                "You've successfully joined the waitlist!"
              )
            ) : webinarStatus === WebinarStatusEnum.LIVE ? (
              "Join Now"
            ) : (
              "Join Waitlist"
            )}
          </Button>
        </form>
        {/* </DialogHeader> */}
      </DialogContent>
    </Dialog>
  );
};

export default WaitListComponent;
