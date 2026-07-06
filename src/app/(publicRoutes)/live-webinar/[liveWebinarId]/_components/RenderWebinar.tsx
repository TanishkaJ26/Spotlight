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
        recording ? (
          <div className="flex flex-col items-center justify-center h-full w-full bg-black/90 p-4 rounded-xl">
            <video
              src={recording.url}
              controls
              autoPlay
              className="w-full h-full max-h-[80vh] rounded-lg shadow-2xl"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-primary">
                {webinar?.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                The webinar has ended. The recording is currently processing and
                will be available soon.
              </p>
            </div>
          </div>
        )
      ) : (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      )}
    </React.Fragment>
  );
};

export default RenderWebinar;
