"use server";

import { getStreamClient } from "@/lib/stream/streamClient";
import { Attendee } from "@prisma/client";
import { UserRequest } from "@stream-io/video-react-sdk";

export const getStreamIoToken = async (attendee: Attendee | null) => {
  try {
    const seed = encodeURIComponent(attendee?.name || "Guest");
    const newUser: UserRequest = {
      id: attendee?.id || "guest",
      //TODO: add role
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
