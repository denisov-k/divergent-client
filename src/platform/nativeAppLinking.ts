export type NativeAppTab = "goals" | "reminders" | "challenges" | "rewards" | "progress" | "more";

export type NativeChallengeLinkState = {
  focusId?: string | null;
  paymentId?: string | null;
};

export type NativeAppLinkState = {
  tab?: NativeAppTab;
  challenge?: NativeChallengeLinkState;
};

function normalizeTab(value: string | null): NativeAppTab | undefined {
  if (
    value === "goals" ||
    value === "reminders" ||
    value === "challenges" ||
    value === "rewards" ||
    value === "progress" ||
    value === "more"
  ) {
    return value;
  }

  return undefined;
}

function normalizeRoute(value: string | null): NativeAppTab | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/^\/+|\/+$/g, "").toLowerCase();
  return normalizeTab(normalized || null);
}

export function parseNativeAppLink(url: string): NativeAppLinkState | null {
  try {
    const parsed = new URL(url);
    const tabFromQuery = normalizeTab(parsed.searchParams.get("tab"));
    const routeFromPath = normalizeRoute(parsed.pathname.split("/").filter(Boolean)[0] ?? null);
    const routeFromHost =
      parsed.protocol === "http:" || parsed.protocol === "https:" ? undefined : normalizeRoute(parsed.hostname);
    const tab = tabFromQuery || routeFromPath || routeFromHost;

    if (!tab) {
      return null;
    }

    if (tab === "challenges") {
      return {
        tab,
        challenge: {
          focusId: parsed.searchParams.get("id"),
          paymentId: parsed.searchParams.get("paymentId"),
        },
      };
    }

    return { tab };
  } catch {
    return null;
  }
}
