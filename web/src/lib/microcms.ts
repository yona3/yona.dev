import { createClient } from "microcms-js-sdk";

export const microcms = createClient({
  serviceDomain: "yona-home-page",
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});
