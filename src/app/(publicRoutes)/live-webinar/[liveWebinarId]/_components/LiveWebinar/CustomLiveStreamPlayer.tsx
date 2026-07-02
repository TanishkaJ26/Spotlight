"use client";
import { WebinarWithPresenter } from "@/lib/type";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";

type Props = {
  callId: string;
  callType: string;
  username: string;
  webinar: WebinarWithPresenter;
  token: string;
};

const CustomLiveStreamPlayer = ({
  username,
  callId,
  callType,
  webinar,
  token,
}: Props) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();
  const [showchat, setShowChat] = useState(true);

  useEffect(() => {
    if (!client) return;
    const myCall = client?.call(callType, callId);
    setCall(myCall);
    myCall.join().catch((e) => {
      console.error("Failed to join call", e);
    });

    return () => {
      myCall.leave().catch((e) => {
        console.error("Failed to leave call", e);
      });
      setCall(undefined);
    };
  }, [client, callId, callType]);

  return <div>CustomLiveStreamPlayer</div>;
};

export default CustomLiveStreamPlayer;
