import Config from "@/services/Config";

export function createTelegramLoginUrl(redirectPath = "/") {
  const baseUrl =
    Config.data.api.http.baseURL ||
    (typeof window !== "undefined" ? window.location.origin : Config.data.app.publicURL);
  const url = new URL("/api/auth/telegram/start", baseUrl);
  url.searchParams.set("redirect", redirectPath);
  return url.toString();
}
