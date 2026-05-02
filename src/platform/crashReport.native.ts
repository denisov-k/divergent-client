import * as SecureStore from "expo-secure-store";

const LAST_FATAL_ERROR_KEY = "diagnostics.lastFatalError";

type FatalHandler = (error: Error, isFatal?: boolean) => void;

type ErrorUtilsShape = {
  getGlobalHandler?: () => FatalHandler;
  setGlobalHandler?: (handler: FatalHandler) => void;
};

function coerceError(value: unknown) {
  if (value instanceof Error) {
    return value;
  }

  if (typeof value === "string") {
    return new Error(value);
  }

  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error("Unknown fatal error");
  }
}

function formatError(error: Error, isFatal?: boolean) {
  const parts = [
    `fatal=${isFatal ? "true" : "false"}`,
    `name=${error.name || "Error"}`,
    `message=${error.message || "Unknown error"}`,
  ];

  if (error.stack) {
    parts.push(`stack=${error.stack}`);
  }

  return parts.join("\n\n");
}

export function installFatalErrorReporter() {
  const errorUtils = (globalThis as typeof globalThis & { ErrorUtils?: ErrorUtilsShape }).ErrorUtils;
  const previousHandler = errorUtils?.getGlobalHandler?.();

  if (!errorUtils?.setGlobalHandler) {
    return;
  }

  errorUtils.setGlobalHandler((rawError, isFatal) => {
    const error = coerceError(rawError);

    try {
      SecureStore.setItem(LAST_FATAL_ERROR_KEY, formatError(error, isFatal));
    } catch {
      // Best-effort diagnostic logging before the app aborts.
    }

    previousHandler?.(error, isFatal);
  });
}

export function consumeLastFatalError() {
  try {
    const value = SecureStore.getItem(LAST_FATAL_ERROR_KEY);
    if (!value) {
      return null;
    }

    void SecureStore.deleteItemAsync(LAST_FATAL_ERROR_KEY);
    return value;
  } catch {
    return null;
  }
}
