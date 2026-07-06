"use client";
import { WebinarWithPresenter } from "@/lib/type";
import {
  ParticipantView,
  useCallStateHooks,
  type Call,
} from "@stream-io/video-react-sdk";
import { Loader2, MessageSquare, Users, Video, StopCircle } from "lucide-react";
import { StreamChat } from "stream-chat";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CtaTypeEnum } from "@prisma/client";
import { Chat, Channel, MessageList, MessageInput } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useTheme } from "next-themes";
import CTADialogBox from "./CTADialogBox";
import { toast } from "sonner";
import { changeWebinarStatus } from "@/actions/webinar";
import { useRouter } from "next/navigation";
import ObsDialogBox from "./ObsDialogBox";

type Props = {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  isHost?: boolean;
  username: string;
  userId: string;
  userToken: string;
  call: Call;
  webinar: WebinarWithPresenter;
};

const LiveWebinarView = ({
  showChat,
  setShowChat,
  isHost,
  userId,
  username,
  userToken,
  webinar,
  call,
}: Props) => {
  const { useParticipantCount, useParticipants, useIsCallRecordingInProgress } =
    useCallStateHooks();
  const participants = useParticipants();
  const viewerCount = useParticipantCount();
  const isRecording = useIsCallRecordingInProgress();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const presenterParticipants = participants.filter((p) => p.userId === webinar.presenter.id);
  const hostParticipant =
    presenterParticipants.find((p) => p.publishedTracks && p.publishedTracks.length > 0) ||
    presenterParticipants[0] ||
    (participants.length > 0 ? participants[0] : null);
  const [loading, setLoading] = useState(false);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [fetchingRecordings, setFetchingRecordings] = useState(false);
  const router = useRouter();
  const [obsDialogBox, setObsDialogBox] = useState(false);

  const handleEndStream = async () => {
    setLoading(true);
    try {
      call.stopLive({
        continue_recording: false,
      });
      call.endCall();

      const res = await changeWebinarStatus(webinar.id, "ENDED");
      if (!res.success) {
        throw new Error(res.message);
      }
      toast.success("Webinar ended successfully");
      router.push("/");
    } catch (error) {
      console.error("Error ending stream", error);
      toast.error("Error ending stream");
    } finally {
      setLoading(false);
    }
  };

  const handleCTAButtonClick = async () => {
    if (!channel) return;
    try {
      await channel.sendEvent({
        type: "open_cta_dialog",
      });
    } catch (error) {
      console.error("Error sending CTA event:", error);
      toast.error("Failed to send CTA dialog");
    }
  };

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      );
      await client.connectUser(
        {
          id: userId,
          name: username,
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=a76ef6`,
        },
        userToken,
      );
      const channel = client.channel("livestream", webinar.id, {
        name: webinar.title,
      });
      await channel.watch();
      setChatClient(client);
      setChannel(channel);
    };
    initChat();
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [userId, username, userToken, webinar.id, webinar.title]);

  useEffect(() => {
    if (!chatClient || !channel) return;

    const handleEvent = (event: any) => {
      if (
        event.type === "open_cta_dialog" ||
        event.type === "custom.open_cta_dialog"
      ) {
        setDialogOpen(true);
      }
    };

    channel.on(handleEvent);

    return () => {
      channel.off(handleEvent);
    };
  }, [chatClient, channel]);

  useEffect(() => {
    call.on("call.rtmp_broadcast_started", () => {
      toast.success("Webinar started siccessfully");
      router.refresh();
    });

    call.on("call.rtmp_broadcast_failed", () => {
      toast.error("Stream failed to start. Please try again.");
    });
  }, [call]);

  //FETCH RECORDINGS
  useEffect(() => {
    const fetchRecordings = async () => {
      setFetchingRecordings(true);
      try {
        const response = await call.queryRecordings();
        setRecordings(response.recordings);
      } catch (error) {
        console.error("Error fetching recordings", error);
      } finally {
        setFetchingRecordings(false);
      }
    };
    if (call) {
      fetchRecordings();
    }
  }, [call]);

  const handleToggleRecording = async () => {
    try {
      if (isRecording) {
        await call.stopRecording();
        toast.success("Recording stopped");
      } else {
        await call.startRecording();
        toast.success("Recording started");
      }
    } catch (error) {
      console.error("Error toggling recording:", error);
      toast.error("Failed to toggle recording");
    }
  };

  // if(!chatClient || !channel) return null

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-background text-foreground">
      <div className="py-2 px-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-accent-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive animate-pulse"></span>
            </span>
            LIVE
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-muted/50 px-3 py-1 rounded-full">
            <Users size={16} />
            <span className="text-sm">{viewerCount}</span>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
              showChat
                ? "bg-accent-primary text-primary-foreground"
                : "bg-muted/50"
            }`}
          >
            <MessageSquare size={16} />
            <span>Chat</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 p-2 gap-2 overflow-hidden">
        <div className="flex-1 rounded-lg overflow-hidden border border-border flex flex-col bg-card">
          <div className="flex-1 relative overflow-hidden">
            {hostParticipant ? (
              <div className="w-full h-full">
                <ParticipantView
                  participant={hostParticipant}
                  className="w-full h-full object-cover !max-w-full"
                />
              </div>
            ) : recordings.length > 0 ? (
              <div className="w-full h-full p-4 overflow-y-auto flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Previous Recordings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recordings.map((recording, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border border-border rounded-lg p-3 bg-muted/30"
                    >
                      <video
                        src={recording.url}
                        controls
                        className="w-full rounded-md object-cover bg-black"
                      />
                      <p className="text-sm text-muted-foreground mt-2 font-medium">
                        Recorded on{" "}
                        {new Date(recording.start_time).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground flex-col space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Users size={40} className="text-muted-foreground" />
                </div>
                <p>
                  {fetchingRecordings
                    ? "Checking for recordings..."
                    : "Waiting for stream to start..."}
                </p>
              </div>
            )}

            {isHost && (
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                Host
              </div>
            )}
          </div>

          <div className="p-2 border-t border-border flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium capitalize">
                {webinar?.title}
              </div>
            </div>

            {isHost && (
              <div className="flex items-center space-x-1">
                <Button
                  onClick={() => setObsDialogBox(true)}
                  variant="outline"
                  className="mr-2"
                >
                  OBS Creds
                </Button>
                <Button
                  onClick={handleToggleRecording}
                  variant={isRecording ? "destructive" : "secondary"}
                >
                  {isRecording ? (
                    <StopCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <Video className="mr-2 h-4 w-4" />
                  )}
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                <Button
                  onClick={handleEndStream}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Ending...
                    </>
                  ) : (
                    "End Stream"
                  )}
                </Button>
                <Button onClick={handleCTAButtonClick}>
                  {webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
                    ? "Book a Call"
                    : "Buy Now"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {showChat && chatClient && (
          <div data-theme={resolvedTheme} className="h-full">
            <Chat
              client={chatClient}
              theme={
                resolvedTheme === "dark"
                  ? "str-chat__theme-dark"
                  : "str-chat__theme-light"
              }
            >
              <Channel channel={channel}>
                <div className="w-72 bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full">
                  <div className="py-2 px-3 border-b border-border font-medium flex items-center justify-between">
                    <span>Chat</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {viewerCount} viewers
                    </span>
                  </div>

                  <MessageList />
                  <div className="p-2 border-t border-border">
                    <MessageInput />
                  </div>
                </div>
              </Channel>
            </Chat>
          </div>
        )}
      </div>

      {/*TODO: add cta dialog box*/}
      {dialogOpen && (
        <CTADialogBox
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          webinar={webinar}
          userId={userId}
        />
      )}
      {obsDialogBox && (
        <ObsDialogBox
          open={obsDialogBox}
          onOpenChange={setObsDialogBox}
          rtmpURL={`rtmps://ingress.stream-io-video.com/443/${process.env.NEXT_PUBLIC_STREAM_API_KEY}.livestream.${webinar.id}`}
          streamKey={userToken}
        />
      )}
    </div>
  );
};

export default LiveWebinarView;
