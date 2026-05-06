import { fetch as expoFetch } from "expo/fetch";

export const streamFetch: typeof fetch = expoFetch as typeof fetch;
