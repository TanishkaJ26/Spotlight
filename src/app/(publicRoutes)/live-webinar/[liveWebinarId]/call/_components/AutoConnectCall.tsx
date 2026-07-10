"use client";
import { WebinarWithPresenter } from "@/lib/type";
import React, { useEffect, useRef, useState } from "react";
import CountdownTimer from "../../_components/UpcomingWebinar/CountdownTimer";
import { CallStatusEnum } from "@prisma/client";
import { toast } from "sonner";
import { vapi } from "@/lib/vapi/vapiClient";
import { changeCallStatus } from "@/actions/attendance";

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

        if (normalizedVolume > 0.15 && !assistantIsSpeaking && !isMicMuted) {
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
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
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
    } catch (error) {
      console.error("Failed to stop call:", error);
      toast.error("Failed to stop call. Please try again.");
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
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
      AutoConnectCall
    </div>
  );
};

export default AutoConnectCall;
