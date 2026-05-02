import * as WebBrowser from "expo-web-browser";

export type AuthSessionResult =
  | { type: "success"; url: string }
  | { type: "cancel" | "dismiss" | "opened" | "locked" };

export async function openAuthSession(url: string, redirectUrl: string) {
  return (await WebBrowser.openAuthSessionAsync(url, redirectUrl)) as AuthSessionResult;
}
