import {
  StreamVideo,
  StreamVideoClient,
  User as StreamUser,
} from "@stream-io/video-react-sdk";
import { WebinarWithPresenter } from "@/lib/type";
import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import CustomLiveStreamPlayer from "./CustomLiveStreamPlayer";
import { getTokenForHost } from "@/actions/streamIo";

type Props = {
  apiKey: string;
  callId: string;
  webinar: WebinarWithPresenter;
  user: User;
};

const LiveStreamState = ({ apiKey, callId, webinar, user }: Props) => {
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  const clientInitialized = React.useRef(false);

  useEffect(() => {
    let isMounted = true;
    if (clientInitialized.current) return;

    let activeClient: StreamVideoClient | null = null;

    const init = async () => {
      try {
        const token = await getTokenForHost(
          webinar.presenterId,
          webinar.presenter.name,
          webinar.presenter.profileImage,
        );

        const hostUser: StreamUser = {
          id: webinar.presenterId,
          name: webinar.presenter.name,
          image: webinar.presenter.profileImage,
        };

        const streamClient = new StreamVideoClient({
          apiKey,
          user: hostUser,
          token,
        });
        
        activeClient = streamClient;

        if (!isMounted) {
          streamClient.disconnectUser();
          return;
        }

        setHostToken(token);
        setClient(streamClient);
        clientInitialized.current = true;
      } catch (error) {
        console.error("Error initializing Stream client:", error);
      }
    };
    init();

    return () => {
      isMounted = false;
      if (activeClient) {
        activeClient.disconnectUser();
        clientInitialized.current = false;
      }
    };
  }, [apiKey, webinar]);

  if (!client || !hostToken) return null;

  return (
    <StreamVideo client={client}>
      <CustomLiveStreamPlayer
        callId={callId}
        callType="livestream"
        webinar={webinar}
        username={user.name}
        token={hostToken}
      />
    </StreamVideo>
  );
};

export default LiveStreamState;
