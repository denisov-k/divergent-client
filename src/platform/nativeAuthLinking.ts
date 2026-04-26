export type NativeAuthTab = "signin" | "signup" | "reset";
export type NativeResetMode = "request" | "confirm";

export type NativeAuthLinkState = {
  tab?: NativeAuthTab;
  resetMode?: NativeResetMode;
  email?: string;
  token?: string;
};

function normalizeTab(value: string | null): NativeAuthTab | undefined {
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

export function parseNativeAuthLink(url: string): NativeAuthLinkState | null {
  try {
    const parsed = new URL(url);
    const token = parsed.searchParams.get("token") || undefined;
    const email = parsed.searchParams.get("email") || undefined;
    const requestedTab = normalizeTab(parsed.searchParams.get("tab"));
    const requestedMode = normalizeResetMode(parsed.searchParams.get("mode"));
    const path = parsed.pathname.toLowerCase();

    if (path.includes("reset")) {
      return {
        tab: "reset",
        resetMode: token ? "confirm" : requestedMode || "request",
        email,
        token,
      };
    }

    if (path.includes("signup")) {
      return { tab: "signup", email };
    }

    if (path.includes("signin") || path.includes("login")) {
      return { tab: "signin", email };
    }

    if (requestedTab) {
      return {
        tab: requestedTab,
        resetMode: requestedTab === "reset" ? token ? "confirm" : requestedMode : undefined,
        email,
        token,
      };
    }

    if (token) {
      return {
        tab: "reset",
        resetMode: "confirm",
        email,
        token,
      };
    }

    return null;
  } catch {
    return null;
  }
}
