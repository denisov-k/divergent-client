import Config from "@/services/Config";
import { buildChallengesPath } from "@/app/routes";

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

export function buildPaymentReturnUrl(path: string) {
  return buildAppUrl(path);
}

export function buildChallengeShareUrl(id: string) {
  return buildAppUrl(buildChallengesPath({ id }));
}
