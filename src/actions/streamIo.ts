"use server";

import { prismaClient } from "@/lib/prismaClient";
import { getStreamClient } from "@/lib/stream/streamClient";
import { Attendee, Webinar } from "@prisma/client";
import { UserRequest } from "@stream-io/node-sdk";

export const getStreamIoToken = async (attendee: Attendee | null) => {
  try {
    const seed = encodeURIComponent(attendee?.name || "Guest");
    const newUser: UserRequest = {
      id: attendee?.id || "guest",
      role: "user",
      name: attendee?.name || "Guest",
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=a76ef6`,
    };
    await getStreamClient.upsertUsers([newUser]);

    const validity = 60 * 60 * 60;
    const token = getStreamClient.generateUserToken({
      user_id: attendee?.id || "guest",
      validity_in_seconds: validity,
    });
    return token;
  } catch (error) {
    console.error("Error generating Stream Io token:", error);
    throw new Error("Failed to generate Stream Io token");
  }
};

export const getTokenForHost = async (
  userId: string,
  username: string,
  profilePic: string,
) => {
  try {
    const newUser: UserRequest = {
      id: userId,
      role: "user",
      name: username || "Guest",
      image:
        profilePic ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
    };
    await getStreamClient.upsertUsers([newUser]);

    const validity = 60 * 60 * 60;
    const token = getStreamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: validity,
    });

    return token;
  } catch (error) {
    console.error("Error generating Stream Io token:", error);
    throw new Error("Failed to generate Stream Io token");
  }
};

export const createAndStartStream = async (webinar: Webinar) => {
  try {
    const checkWebinar = await prismaClient.webinar.findMany({
      where: {
        presenterId: webinar.presenterId,
        webinarStatus: "LIVE",
      },
    });

    if (checkWebinar.length > 0) {
      throw new Error("You are already hosting a live webinar!");
    }

    const call = getStreamClient.video.call("livestream", webinar.id);
    await call.getOrCreate({
      data: {
        created_by_id: webinar.presenterId,
        members: [
          {
            user_id: webinar.presenterId,
            role: "host",
          },
        ],
      },
    });
    await call.goLive({ start_recording: false });
    console.log("Stream successfully started");
  } catch (error: any) {
    console.error("Error creating and starting stream:", error);
    throw new Error(error.message || "Failed to create and start stream");
  }
};

export const getStreamRecording = async (callId: string) => {
  try {
    const call = getStreamClient.video.call("livestream", callId);
    const response = await call.listRecordings();
    if (response.recordings.length > 0) {
      return response.recordings[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching stream recording:", error);
    return null;
  }
};
