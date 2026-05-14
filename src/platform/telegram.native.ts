import Config from "@/services/Config";

export function createTelegramLoginUrl(redirectPath = "/") {
  const baseUrl = Config.data.api.http.baseURL || Config.data.app.publicURL;
  const url = new URL("/api/auth/telegram/start", baseUrl);
  url.searchParams.set("redirect", redirectPath);
  url.searchParams.set("native", "1");
  return url.toString();
}
