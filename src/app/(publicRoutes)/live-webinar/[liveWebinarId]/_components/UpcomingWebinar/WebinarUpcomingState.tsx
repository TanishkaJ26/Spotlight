"use client";
import React, { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { User, Webinar, WebinarStatusEnum } from "@prisma/client";
import Image from "next/image";
import WaitListComponent from "./WaitListComponent";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { changeWebinarStatus, getWebinarById } from "@/actions/webinar";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { createAndStartStream } from "@/actions/streamIo";

type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { attendee } = useAttendeeStore();

  React.useEffect(() => {
    // Only poll if the current user is NOT the presenter
    if (currentUser?.id === webinar.presenterId) return;
    
    // Only poll if we are waiting for the webinar to start
    if (webinar.webinarStatus !== "SCHEDULED" && webinar.webinarStatus !== "WAITING_ROOM") return;

    // Only automatically join if they have an attendee record (joined the waitlist)
    if (!attendee) return;

    const interval = setInterval(async () => {
      try {
        const latestWebinar = await getWebinarById(webinar.id);
        if (latestWebinar?.webinarStatus === "LIVE") {
          toast.success("Webinar is starting! Joining automatically...");
          router.refresh(); // Triggers server component re-render to load Participate.tsx
        }
      } catch (error) {
        console.error("Failed to poll webinar status", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser?.id, webinar.presenterId, webinar.id, webinar.webinarStatus, attendee, router]);

  const handleStartWebinar = async () => {
    setLoading(true);
    try {
      if (!currentUser?.id) {
        throw new Error("User not authenticated");
      }

      await createAndStartStream(webinar);
      const res = await changeWebinarStatus(webinar.id, "LIVE");
      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success("Webinar started successfully");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-[100dvh] overflow-hidden mx-auto max-w-[400px] flex flex-col justify-center items-center gap-4 py-4">
      <div className="space-y-4">
        <p className="text-3xl font-semibold text-primary text-center">
          Seems like you are a little early.
        </p>
        <CountdownTimer
          targetDate={new Date(webinar.startTime)}
          className="text-center"
          webinarId={webinar.id}
          webinarStatus={webinar.webinarStatus}
        />
      </div>
      <div className="w-full flex justify-center items-center flex-col">
        <div className="w-full max-w-md aspect-video relative rounded-4xl overflow-hidden mb-4">
          <Image
            src={webinar.thumbnail || "/darkthumbnail.png"}
            alt={webinar.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="mt-8">
          {webinar?.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
            <WaitListComponent
              webinarId={webinar.id}
              webinarStatus="SCHEDULED"
            />
          ) : webinar?.webinarStatus === WebinarStatusEnum.WAITING_ROOM ? (
            <>
              {currentUser?.id === webinar?.presenterId ? (
                <Button
                  className="w-full max-w-[300px] font-semibold"
                  onClick={handleStartWebinar}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Starting...
                    </>
                  ) : (
                    "Start Webinar"
                  )}
                </Button>
              ) : (
                <WaitListComponent
                  webinarId={webinar.id}
                  webinarStatus="WAITING_ROOM"
                />
              )}
            </>
          ) : webinar?.webinarStatus === WebinarStatusEnum.LIVE ? (
            <WaitListComponent webinarId={webinar.id} webinarStatus="LIVE" />
          ) : webinar?.webinarStatus === WebinarStatusEnum.CANCELLED ? (
            <p className="text-center text-xl text-foreground font-semibold">
              Webinar is Cancelled
            </p>
          ) : (
            <Button> Ended </Button>
          )}
        </div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-primary">
          {webinar?.title}
        </h3>
        <p className="text-muted-foreground text-xs">{webinar.description}</p>
        <div className="w-full justify-center flex gap-2 flex-wrap items-center">
          <Button
            variant={"outline"}
            className="rounded-md bg-secondary backdrop-blur-2xl"
          >
            <Calendar className="mr-2" />
            {format(new Date(webinar.startTime), "dd MMMM yyyy")}
          </Button>

          <Button variant={"outline"}>
            <Clock className="mr-2" />
            {format(new Date(webinar.startTime), "hh:mm a")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebinarUpcomingState;
