import { onAuthenticateUser } from "@/actions/auth";
import { getWebinarById } from "@/actions/webinar";
import React from "react";
import RenderWebinar from "./_components/RenderWebinar";
import { getStreamClient } from "@/lib/stream/streamClient";

type Props = {
  params: Promise<{
    liveWebinarId: string;
  }>;
  searchParams: Promise<{
    error: string;
  }>;
};

const page = async ({ params, searchParams }: Props) => {
  const { liveWebinarId } = await params;
  const { error } = await searchParams;

  const webinarData = await getWebinarById(liveWebinarId);
  if (!webinarData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        Webinar not found
      </div>
    );
  }
  const checkUser = await onAuthenticateUser();
  //TODO: create API keys
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  
  let token = process.env.STREAM_TOKEN as string;
  if (checkUser?.user?.id === webinarData.presenterId) {
    const streamUserId = process.env.NEXT_PUBLIC_STREAM_USER_ID!;
    await getStreamClient.upsertUsers([
      {
        id: streamUserId,
        name: checkUser.user.name || "Host",
        role: "admin",
      },
    ]);

    const validity = 60 * 60 * 60;
    token = getStreamClient.generateUserToken({
      user_id: streamUserId,
      validity_in_seconds: validity,
    });
  }

  const callId = process.env.STREAM_CALL_ID as string; // or webinarData.id if you want to make it dynamic

  return (
    <div className="w-full in-h-screen mx-auto">
      <RenderWebinar
        error={error}
        user={checkUser?.user || null}
        webinar={webinarData}
        apiKey={apiKey}
        token={token}
        callId={callId}
      />
    </div>
  );
};

export default page;
