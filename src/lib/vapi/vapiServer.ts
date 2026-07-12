import jwt from "jsonwebtoken";
import { VapiClient } from "@vapi-ai/server-sdk";

export const getVapiServer = () => {
  const payload = {
    orgId: process.env.VAPI_ORG_ID,
    token: {
      tag: "private",
    },
  };

  const key = process.env.VAPI_PRIVATE_KEY!;

  const options = {
    expiresIn: 1800,
  };

  const token = jwt.sign(payload, key, options);

  return new VapiClient({ token: token });
};
