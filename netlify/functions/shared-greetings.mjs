import { getStore } from "@netlify/blobs";
import { handleSharedGreetings } from "../../server/shared-greetings.mjs";

export default (request) => handleSharedGreetings(request, getStore({ name: "mission-alive-shared-greetings", consistency: "strong" }));

export const config = {
  path: "/api/greetings",
  rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
