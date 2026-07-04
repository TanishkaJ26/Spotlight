"use client";
import { getStreamIoToken } from "@/actions/streamIo";
import { WebinarWithPresenter } from "@/lib/type";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { StreamVideoClient, type User } from "@stream-io/video-react-sdk";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  apiKey: string;
  webinar: WebinarWithPresenter;
  callId: string;
};

const Participate = ({ apiKey, webinar, callId }: Props) => {
  const { attendee } = useAttendeeStore();
  const [showChat, setShowChat] = useState<boolean>(true);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "failed" | "reconnecting" | "connected"
  >("connecting");

  const clientInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (clientInitialized.current) return;
    const initClient = async () => {
      try {
        setConnectionStatus("connecting");
        const user: User = {
          id: attendee?.id || "guest",
          name: attendee?.name || "Guest",
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${attendee?.name || "Guest"}`,
        };

        const userToken = await getStreamIoToken(attendee);
        setToken(userToken);

        const streamClient = new StreamVideoClient({
          apiKey,
          user,
          token: userToken,
        });
        streamClient.on("connection.changed", (event) => {
          if (event.online) {
            setConnectionStatus("connected");
          } else {
            setConnectionStatus("reconnecting");
          }
        });

        // await streamClient.connectUser(user, userToken);
        const streamCall = streamClient.call("livestream", callId);

        await streamCall.join({ create: true });

        setClient(streamClient);
        setCall(streamCall);
        setConnectionStatus("connected");
        clientInitialized.current = true;
      } catch (error) {
        console.error("Error initializing client or joining call:", error);
        setConnectionStatus("failed");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to connect to webinar",
        );
      }
    };
    initClient();

    return () => {
      const currentCall = call;
      const currentClient = client;
      if (currentCall && currentClient) {
        currentCall
          .leave()
          .then(() => {
            console.log("Left the call");
            currentClient.disconnectUser();
            clientInitialized.current = false;
          })
          .catch((error) => {
            console.error("Error leaving call:", error);
          });
      }
    };
  }, [apiKey, callId, attendee, call, client]);

  return <div>Participate</div>;
};

export default Participate;
