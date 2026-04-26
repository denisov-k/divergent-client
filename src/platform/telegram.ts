import Config from "@/services/Config";

export function createTelegramLoginUrl(redirectPath = "/") {
  const url = new URL("/api/auth/telegram/start", Config.data.api.http.baseURL);
  url.searchParams.set("redirect", redirectPath);
  return url.toString();
}
