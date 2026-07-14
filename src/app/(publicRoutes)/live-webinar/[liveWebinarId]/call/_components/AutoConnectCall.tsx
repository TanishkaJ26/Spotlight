"use client";
import { WebinarWithPresenter } from "@/lib/type";
import React, { useEffect, useRef, useState } from "react";
import CountdownTimer from "../../_components/UpcomingWebinar/CountdownTimer";
import { CallStatusEnum } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi/vapiClient";
import { changeCallStatus } from "@/actions/attendance";
import {
  Bot,
  CheckCircle,
  Clock,
  Loader2,
  Mic,
  MicOff,
  PhoneOffIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createCheckoutLink } from "@/actions/stripe";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  userName?: string;
  assistantId: string;
  assistantName?: string;
  callTimeLimit?: number;
  webinar: WebinarWithPresenter;
  userId: string;
};

const AutoConnectCall = ({
  userName = "User",
  assistantId,
  assistantName = "Ai Assistant",
  callTimeLimit = 180,
  webinar,
  userId,
}: Props) => {
  const CallStatus = {
    CONNECTING: "CONNECTING",
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
  };

  const [callStatus, setCallStatus] = useState(CallStatus.CONNECTING);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(callTimeLimit);

  const refs = useRef({
    countdownTimer: undefined as NodeJS.Timeout | undefined,
    audioStream: null as MediaStream | null,
    userSpeakingTimeout: undefined as NodeJS.Timeout | undefined,
  });

  const router = useRouter();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const cleanup = () => {
    if (refs.current.countdownTimer) {
      clearInterval(refs.current.countdownTimer);
      refs.current.countdownTimer = undefined;
    }
    if (refs.current.userSpeakingTimeout) {
      clearTimeout(refs.current.userSpeakingTimeout);
      refs.current.userSpeakingTimeout = undefined;
    }
    if (refs.current.audioStream) {
      refs.current.audioStream.getTracks().forEach((track) => track.stop());
      refs.current.audioStream = null;
    }
  };

  const setupAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      refs.current.audioStream = stream;

      const audioContext = new (window.AudioContext || window.AudioContext)();
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyzer);

      const checkAudioLevel = () => {
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(dataArray);

        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedVolume = average / 256;

        // Lowered threshold from 0.15 to 0.05 for better sensitivity
        if (normalizedVolume > 0.05 && !assistantIsSpeaking && !isMicMuted) {
          setUserIsSpeaking(true);

          if (refs.current.userSpeakingTimeout) {
            clearTimeout(refs.current.userSpeakingTimeout);
          }

          refs.current.userSpeakingTimeout = setTimeout(() => {
            setUserIsSpeaking(false);
          }, 500);
        }
        requestAnimationFrame(checkAudioLevel);
      };

      // Kick off the loop (This was missing before!)
      checkAudioLevel();
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  };

  const handleCallConclusion = () => {
    setTimeout(() => {
      router.push(`/live-webinar/${webinar.id}`);
    }, 3000);
  };

  const stopCall = async () => {
    try {
      vapi.stop();
      setCallStatus(CallStatus.FINISHED);
      cleanup();
      const res = await changeCallStatus(userId, CallStatusEnum.COMPLETED);
      if (!res.success) {
        throw new Error("Failed to update call status");
      }
      toast.success("Call ended successfully");
      handleCallConclusion();
    } catch (error) {
      console.error("Failed to stop call:", error);
      toast.error("Failed to stop call. Please try again.");
    }
  };

  const toggleMicMute = () => {
    if (refs.current.audioStream) {
      refs.current.audioStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicMuted;
      });
    }
    setIsMicMuted(!isMicMuted);
  };

  const checkoutLink = async () => {
    try {
      if (!webinar?.priceId || !webinar?.presenter?.stripeConnectId) {
        return toast.error("No priceId or stripeConnectId found");
      }
      const session = await createCheckoutLink(
        webinar.priceId,
        webinar?.presenter?.stripeConnectId,
        userId,
        webinar.id,
      );
      if (!session.sessionUrl) {
        throw new Error("Session ID not found in response");
      }

      window.open(session.sessionUrl, "_blank");
    } catch (error) {
      console.error("Error creating checkout link", error);
      toast.error("Failed to create checkout session. Please try again.");
    }
  };

  //TODO: vapi call useeffect

  useEffect(() => {
    startCall();

    return () => {
      stopCall();
    };
  }, []);

  const startCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);
      await vapi.start(assistantId);
      const res = await changeCallStatus(userId, CallStatusEnum.InProgress);
      if (!res.success) {
        throw new Error("Failed to update call status");
      }
      toast.success("Call started successfully");
    } catch (error) {
      console.error("Failed to start call:", error);
      toast.error("Failed to start call. Please try again.");
      setCallStatus(CallStatus.FINISHED);
    }
  };

  useEffect(() => {
    const onCallStart = async () => {
      console.log("call started");
      setCallStatus(CallStatus.ACTIVE);
      setupAudio();

      setTimeRemaining(callTimeLimit);
      refs.current.countdownTimer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(refs.current.countdownTimer);
            stopCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const onCallEnd = () => {
      console.log("Call ended");
      setCallStatus(CallStatus.FINISHED);
      cleanup();
      handleCallConclusion();
    };

    const onSpeechStart = () => {
      setAssistantIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setAssistantIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi error:", error);
      setCallStatus(CallStatus.FINISHED);
      cleanup();
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [userName, callTimeLimit]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gradient-to-br from-background via-background to-accent-primary/5 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary/10 via-background to-background pointer-events-none" />

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 z-10 w-full">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* AI Card */}
          <div className="relative aspect-video bg-card/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center group transition-all duration-500 hover:border-white/10">
            {/* Top Label */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white/90 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-white/5 shadow-lg">
              <Mic
                className={cn(
                  "h-4 w-4 transition-colors duration-300",
                  assistantIsSpeaking ? "text-accent-primary animate-pulse" : "text-muted-foreground"
                )}
              />
              <span>{assistantName}</span>
            </div>
            
            {/* Bot Avatar */}
            <div className="relative">
              {assistantIsSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full border border-accent-primary animate-ping opacity-40" style={{ margin: "-12px", animationDuration: "2s" }} />
                  <div className="absolute inset-0 rounded-full border border-accent-primary animate-ping opacity-20" style={{ margin: "-24px", animationDuration: "2s", animationDelay: "0.5s" }} />
                </>
              )}
              <div
                className={cn(
                  "flex justify-center items-center rounded-full overflow-hidden border-4 p-8 transition-all duration-500",
                  assistantIsSpeaking
                    ? "border-accent-primary bg-accent-primary/10 shadow-[0_0_40px_rgba(var(--accent-primary),0.3)] scale-110"
                    : "border-white/10 bg-black/20"
                )}
              >
                <Bot className={cn("w-20 h-20 transition-all duration-500", assistantIsSpeaking ? "text-accent-primary" : "text-white/40")} />
              </div>
            </div>
          </div>

          {/* User Card */}
          <div className="relative aspect-video bg-card/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center group transition-all duration-500 hover:border-white/10">
            {/* Top Label */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white/90 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-white/5 shadow-lg">
              {isMicMuted ? (
                <MicOff className="h-4 w-4 text-destructive" />
              ) : (
                <Mic
                  className={cn(
                    "h-4 w-4 transition-colors duration-300",
                    userIsSpeaking ? "text-accent-secondary animate-pulse" : "text-muted-foreground"
                  )}
                />
              )}
              <span>{userName}</span>
            </div>
            
            {/* Timer Label */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white/90 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-white/5 shadow-lg">
              <Clock className={cn("h-4 w-4", timeRemaining < 30 ? "text-destructive" : "text-muted-foreground")} />
              <span className={cn(timeRemaining < 30 ? "text-destructive animate-pulse font-bold" : "")}>
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* User Avatar */}
            <div className="relative">
              {userIsSpeaking && !isMicMuted && (
                <>
                  <div className="absolute inset-0 rounded-full border border-accent-secondary animate-ping opacity-40" style={{ margin: "-12px", animationDuration: "2s" }} />
                  <div className="absolute inset-0 rounded-full border border-accent-secondary animate-ping opacity-20" style={{ margin: "-24px", animationDuration: "2s", animationDelay: "0.5s" }} />
                </>
              )}
              <div
                className={cn(
                  "flex justify-center items-center rounded-full overflow-hidden border-4 transition-all duration-500",
                  isMicMuted
                    ? "border-destructive/40 bg-destructive/5"
                    : userIsSpeaking
                      ? "border-accent-secondary shadow-[0_0_40px_rgba(var(--accent-secondary),0.3)] scale-110"
                      : "border-white/10"
                )}
              >
                <Avatar className="w-32 h-32">
                  <AvatarImage src="/user-avatar.png" alt={userName} />
                  <AvatarFallback className="text-5xl font-bold uppercase text-white bg-secondary/30">
                    {userName.split("")?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {isMicMuted && (
                <div className="absolute -bottom-3 -right-3 bg-destructive text-white p-3 rounded-full shadow-lg border-4 border-background">
                  <MicOff className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Control Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4 md:px-0">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-3 rounded-full flex items-center justify-center gap-4 shadow-2xl mx-auto">
          
          <Button
            onClick={toggleMicMute}
            variant="ghost"
            className={cn(
              "h-14 w-14 rounded-full transition-all duration-300",
              isMicMuted
                ? "bg-destructive/20 text-destructive hover:bg-destructive/30 hover:text-destructive"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
            disabled={callStatus !== CallStatus.ACTIVE}
            title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMicMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            onClick={stopCall}
            variant="destructive"
            className="h-14 w-14 rounded-full hover:bg-destructive/90 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            title="End Call"
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <PhoneOffIcon className="h-6 w-6" />
          </Button>

          <div className="w-[1px] h-8 bg-white/20 mx-2" />

          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 rounded-full bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(var(--accent-primary),0.4)]">
                Buy Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-10 bg-card border-white/10 backdrop-blur-xl">
              <DialogHeader className="flex flex-col items-center">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                <DialogTitle className="text-center text-3xl font-extrabold text-foreground">
                  Payment Successful!
                </DialogTitle>
                <DialogDescription className="text-center pt-4 text-base text-muted-foreground">
                  Thank you for your purchase. Your payment has been processed
                  successfully. You will receive an email with your receipt
                  shortly.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      {/* Connection Overlay */}
      {callStatus === CallStatus.CONNECTING && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center flex-col gap-6 z-50 transition-all duration-500">
          <div className="relative">
             <div className="absolute inset-0 rounded-full border-4 border-accent-primary/30 animate-ping" />
             <Loader2 className="h-16 w-16 animate-spin text-accent-primary relative z-10" />
          </div>
          <h3 className="text-2xl font-medium tracking-wide">Connecting...</h3>
        </div>
      )}

      {/* Finished Overlay */}
      {callStatus === CallStatus.FINISHED && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center flex-col gap-4 z-50 transition-all duration-500">
          <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
             <CheckCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-3xl font-bold tracking-tight">Call Ended</h3>
          <p className="text-muted-foreground text-lg">The session has concluded.</p>
        </div>
      )}
    </div>
  );
};

export default AutoConnectCall;
