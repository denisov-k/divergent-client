import { buildChallengesPath } from "@/app/routes";
import Config from "@/services/Config";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildAppUrl(path: string) {
  const base = trimTrailingSlash(Config.data.app.publicURL || Config.data.api.http.baseURL);
  const normalizedPath = normalizePath(path);

  if (!base) {
    return normalizedPath;
  }

  return `${base}${normalizedPath}`;
}

export function buildNativeRouteUrl(path: string) {
  const normalizedPath = normalizePath(path).replace(/^\//, "");
  const scheme = (Config.data.app.scheme || "divergent").replace(/:$/, "");

  return `${scheme}://${normalizedPath}`;
}

export function buildPaymentReturnUrl(path: string) {
  return buildNativeRouteUrl(path);
}

export function buildChallengeShareUrl(id: string) {
  return buildAppUrl(buildChallengesPath({ id }));
}
