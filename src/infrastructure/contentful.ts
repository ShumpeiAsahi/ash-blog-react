import { createClient } from "contentful";

const SPACE_ID = (import.meta.env.VITE_CONTENTFUL_SPACE_ID as string) || "";
const ACCESS_TOKEN =
  (import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN as string) || "";

const client = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

export default client;
