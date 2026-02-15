import "server-only";

import { createClient } from "microcms-js-sdk";

const apiKey = process.env.MICROCMS_API_KEY;

if (!apiKey) {
  throw new Error("MICROCMS_API_KEY is not set");
}

export const microcms = createClient({
  serviceDomain: "yona-home-page",
  apiKey,
});
