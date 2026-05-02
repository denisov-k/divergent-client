import type { AuthSessionResult } from "@/platform/authSession.native";

export async function openAuthSession(url: string, _redirectUrl: string): Promise<AuthSessionResult> {
  if (typeof window !== "undefined") {
    window.location.assign(url);
  }

  return { type: "dismiss" };
}
