"use client";

import { User, WebinarStatusEnum } from "@prisma/client";
import React, { useEffect } from "react";
import WebinarUpcomingState from "./UpcomingWebinar/WebinarUpcomingState";
import { usePathname, useRouter } from "next/navigation";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { toast } from "sonner";
import LiveStreamState from "./LiveWebinar/LiveStreamState";
import { StreamCallRecording, WebinarWithPresenter } from "@/lib/type";
import Participate from "./Participate/Participate";
import { formatDistanceToNow, format } from "date-fns";
import { StopCircle, Video } from "lucide-react";

type Props = {
  error: string | undefined;
  user: User | null;
  webinar: WebinarWithPresenter;
  apiKey: string;
  recording: StreamCallRecording | null;
};

const RenderWebinar = ({ error, user, webinar, apiKey, recording }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const { attendee } = useAttendeeStore();

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push(pathname);
    }
  }, [error]);

  return (
    <React.Fragment>
      {webinar.webinarStatus === WebinarStatusEnum.LIVE ? (
        <React.Fragment>
          {user?.id === webinar.presenterId ? (
            <LiveStreamState
              apiKey={apiKey}
              callId={webinar.id}
              webinar={webinar}
              user={user}
            />
          ) : attendee ? (
            <Participate
              apiKey={apiKey}
              webinar={webinar}
              callId={webinar.id}
            />
          ) : (
            <WebinarUpcomingState
              webinar={webinar}
              currentUser={user || null}
            />
          )}
        </React.Fragment>
      ) : webinar.webinarStatus === WebinarStatusEnum.CANCELLED ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-primary">
              {webinar?.title}
            </h3>
            <p className="text-muted-foreground text-xs">
              This webinar has been cancelled.
            </p>
          </div>
        </div>
      ) : webinar.webinarStatus === WebinarStatusEnum.ENDED ? (
        <div className="w-full min-h-screen p-6 sm:p-10 overflow-y-auto flex flex-col gap-8 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-4xl mx-auto w-full text-center sm:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-2">
              {webinar.title}
            </h1>
            {webinar.description && (
              <p className="text-muted-foreground text-lg">
                {webinar.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-gradient-to-r from-accent-primary/20 via-accent-primary/10 to-transparent border border-accent-primary/30 max-w-4xl mx-auto w-full">
            <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center mb-4">
              <StopCircle className="w-8 h-8 text-accent-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Webinar has ended
            </h2>
            <p className="text-muted-foreground text-lg">
              Ended{" "}
              {formatDistanceToNow(new Date(webinar.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" />
              Recording
            </h3>

            {recording ? (
              <div className="group flex flex-col gap-3 rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/40">
                <div className="relative aspect-video w-full bg-black/90 overflow-hidden">
                  <video
                    src={recording.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {webinar.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                    Recorded on{" "}
                    {format(new Date(recording.start_time), "PPP p")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-48 border border-dashed border-border rounded-xl bg-muted/30 w-full">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    The recording is currently processing and will be available
                    soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      )}
    </React.Fragment>
  );
};

export default RenderWebinar;

