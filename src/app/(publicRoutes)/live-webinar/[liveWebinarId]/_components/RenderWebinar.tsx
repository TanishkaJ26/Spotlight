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
      ) : webinar.webinarStatus === WebinarStatusEnum.ENDED ? (
        <div className="relative w-full min-h-[calc(100vh-4rem)] p-6 sm:p-10 overflow-y-auto flex flex-col gap-10 bg-background overflow-x-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto w-full text-center sm:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 mb-2 pb-1">
              {webinar.title}
            </h1>
            {webinar.description && (
              <p className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl leading-relaxed mx-auto sm:mx-0">
                {webinar.description}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center text-center p-6 md:p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-white/10 shadow-2xl max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 hover:border-primary/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent-primary/20 transition-all duration-500 shadow-inner">
              <StopCircle className="w-7 h-7 text-accent-primary animate-pulse" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-foreground">
              Webinar has concluded
            </h2>
            <div className="flex items-center gap-2.5 text-muted-foreground text-sm md:text-base bg-background/60 px-4 py-2 rounded-full border border-white/5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
              </span>
              Ended{" "}
              {formatDistanceToNow(new Date(webinar.updatedAt), {
                addSuffix: true,
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                Session Recording
              </h3>
            </div>

            {recording ? (
              <div className="group flex flex-col gap-0 rounded-3xl overflow-hidden bg-card/60 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                <div className="relative aspect-video w-full bg-black/95 overflow-hidden ring-1 ring-white/10">
                  <video
                    src={recording.url}
                    controls
                    className="w-full h-full object-contain relative z-10"
                  />
                  {/* Subtle overlay gradient that fades out on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-0"></div>
                </div>
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50">
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl md:text-2xl line-clamp-1 group-hover:text-primary transition-colors duration-300">
                      {webinar.title}
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground font-medium flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]"></span>
                      Recorded on{" "}
                      {format(new Date(recording.start_time), "MMMM do, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                    <div className="text-xs font-semibold px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      High Quality
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden flex flex-col justify-center items-center h-72 border-2 border-dashed border-primary/20 rounded-3xl bg-card/30 backdrop-blur-sm w-full group hover:border-primary/40 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="text-center space-y-5 relative z-10 flex flex-col items-center p-6">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                     <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                     <Video className="w-8 h-8 text-muted-foreground animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-foreground">Processing Recording</h4>
                    <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
                      The recording is currently being processed and optimized. It will be available to watch shortly.
                    </p>
                  </div>
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

