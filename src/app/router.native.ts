export type NativeAppTab = "goals" | "reminders" | "challenges" | "rewards" | "progress" | "more";
export type NativeMoreTab = "menu" | "frens" | "settings";
export type NativeAuthTab = "signin" | "signup" | "reset";
export type NativeResetMode = "request" | "confirm";

export type NativeAppRoute =
  | { kind: "app"; tab: "goals"; goalId?: string | null }
  | { kind: "app"; tab: "reminders"; reminderId?: string | null; goalId?: string | null }
  | { kind: "app"; tab: "challenges"; focusId?: string | null; paymentId?: string | null }
  | { kind: "app"; tab: "rewards"; rewardId?: string | null }
  | { kind: "app"; tab: "progress"; goalId?: string | null }
  | { kind: "app"; tab: "more"; screen?: NativeMoreTab };

export type NativeAuthRoute = {
  kind: "auth";
  tab?: NativeAuthTab;
  resetMode?: NativeResetMode;
  email?: string;
  token?: string;
};

export type NativeRoute = NativeAppRoute | NativeAuthRoute;

function normalizeAppTab(value: string | null): NativeAppTab | undefined {
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

function normalizeMoreTab(value: string | null): NativeMoreTab | undefined {
  if (value === "menu" || value === "frens" || value === "settings") {
    return value;
  }

  return undefined;
}

function normalizeAuthTab(value: string | null): NativeAuthTab | undefined {
  if (value === "signin" || value === "signup" || value === "reset") {
    return value;
  }

  return undefined;
}

function normalizeResetMode(value: string | null): NativeResetMode | undefined {
  if (value === "request" || value === "confirm") {
    return value;
  }

  return undefined;
}

function normalizeRoute(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.replace(/^\/+|\/+$/g, "").toLowerCase() || undefined;
}

function parseAuthRoute(parsed: URL): NativeAuthRoute | null {
  const token = parsed.searchParams.get("token") || undefined;
  const email = parsed.searchParams.get("email") || undefined;
  const requestedTab = normalizeAuthTab(parsed.searchParams.get("tab"));
  const requestedMode = normalizeResetMode(parsed.searchParams.get("mode"));
  const path = parsed.pathname.toLowerCase();

  if (path.includes("reset")) {
    return {
      kind: "auth",
      tab: "reset",
      resetMode: token ? "confirm" : requestedMode || "request",
      email,
      token,
    };
  }

  if (path.includes("signup")) {
    return { kind: "auth", tab: "signup", email };
  }

  if (path.includes("signin") || path.includes("login")) {
    return { kind: "auth", tab: "signin", email };
  }

  if (requestedTab) {
    return {
      kind: "auth",
      tab: requestedTab,
      resetMode: requestedTab === "reset" ? (token ? "confirm" : requestedMode) : undefined,
      email,
      token,
    };
  }

  if (token) {
    return {
      kind: "auth",
      tab: "reset",
      resetMode: "confirm",
      email,
      token,
    };
  }

  return null;
}

function parseAppRoute(parsed: URL): NativeAppRoute | null {
  const pathSegments = parsed.pathname.split("/").filter(Boolean);
  const routeFromPath = normalizeRoute(pathSegments[0] ?? null);
  const routeFromHost = parsed.protocol === "http:" || parsed.protocol === "https:" ? undefined : normalizeRoute(parsed.hostname);
  const tab = normalizeAppTab(parsed.searchParams.get("tab")) || normalizeAppTab(routeFromPath || null) || normalizeAppTab(routeFromHost || null);

  if (tab === "goals") {
    return {
      kind: "app",
      tab,
      goalId: parsed.searchParams.get("id") || parsed.searchParams.get("goalId"),
    };
  }

  if (tab === "reminders") {
    return {
      kind: "app",
      tab,
      reminderId: parsed.searchParams.get("id") || parsed.searchParams.get("reminderId"),
      goalId: parsed.searchParams.get("goalId"),
    };
  }

  if (tab === "challenges") {
    return {
      kind: "app",
      tab,
      focusId: parsed.searchParams.get("id"),
      paymentId: parsed.searchParams.get("paymentId"),
    };
  }

  if (tab === "rewards") {
    return {
      kind: "app",
      tab,
      rewardId: parsed.searchParams.get("id") || parsed.searchParams.get("rewardId"),
    };
  }

  if (tab === "progress") {
    return {
      kind: "app",
      tab,
      goalId: parsed.searchParams.get("goalId") || parsed.searchParams.get("id"),
    };
  }

  if (tab === "more") {
    return {
      kind: "app",
      tab,
      screen: normalizeMoreTab(parsed.searchParams.get("screen")) || "menu",
    };
  }

  if (tab) {
    return {
      kind: "app",
      tab,
    };
  }

  const standaloneMoreTab = normalizeMoreTab(pathSegments[0] ?? parsed.hostname);
  if (standaloneMoreTab) {
    return {
      kind: "app",
      tab: "more",
      screen: standaloneMoreTab,
    };
  }

  return null;
}

export function parseNativeRoute(url: string): NativeRoute | null {
  try {
    const parsed = new URL(url);
    return parseAuthRoute(parsed) || parseAppRoute(parsed);
  } catch {
    return null;
  }
}

export function parseNativeAppRoute(url: string): NativeAppRoute | null {
  const route = parseNativeRoute(url);
  return route?.kind === "app" ? route : null;
}

export function parseNativeAuthRoute(url: string): NativeAuthRoute | null {
  const route = parseNativeRoute(url);
  return route?.kind === "auth" ? route : null;
}

