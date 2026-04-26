import Config from "@/services/Config";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function buildAppUrl(path: string) {
  const base = trimTrailingSlash(Config.data.app.publicURL || Config.data.api.http.baseURL);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!base) {
    return normalizedPath;
  }

  return `${base}${normalizedPath}`;
}

export function buildChallengeShareUrl(id: string) {
  return buildAppUrl(`/challenges?id=${encodeURIComponent(id)}`);
}
