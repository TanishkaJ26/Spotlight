import { User, Webinar, WebinarStatusEnum } from "@prisma/client";
import React from "react";
import WebinarUpcomingState from "./UpcomingWebinar/WebinarUpcomingState";

type Props = {
  error: string | undefined;
  user: User | null;
  webinar: Webinar;
  apiKey: string;
  token: string;
  callId: string;
};

const RenderWebinar = ({
  error,
  user,
  webinar,
  apiKey,
  token,
  callId,
}: Props) => {
  return (
    //TODO: bulid waiting room and live
    <React.Fragment>
      {webinar.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default RenderWebinar;
