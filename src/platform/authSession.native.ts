import * as WebBrowser from "expo-web-browser";
import type { AuthSessionResult } from "@/platform/authSession";

export async function openAuthSession(url: string, redirectUrl: string) {
  return (await WebBrowser.openAuthSessionAsync(url, redirectUrl)) as AuthSessionResult;
}
