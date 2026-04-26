import WebApp from "@twa-dev/sdk";

function getTelegramWebApp() {
  return typeof globalThis !== "undefined"
    ? (globalThis as typeof globalThis & {
        Telegram?: { WebApp?: typeof WebApp };
      }).Telegram?.WebApp
    : undefined;
}

export function isTelegramWebAppAvailable() {
  return Boolean(getTelegramWebApp());
}

export function initializeTelegramWebApp() {
  if (!isTelegramWebAppAvailable()) {
    return;
  }

  WebApp.ready();

  if (WebApp.version !== "6.0") {
    WebApp.requestFullscreen();
    WebApp.disableVerticalSwipes();
    WebApp.setBackgroundColor("#0d0d10");
  }
}

export function getTelegramInitData() {
  return isTelegramWebAppAvailable() ? WebApp.initData : "";
}

export function getTelegramStartParam() {
  return isTelegramWebAppAvailable()
    ? WebApp.initDataUnsafe?.start_param ?? null
    : null;
}

export function isTelegramFullscreen() {
  return isTelegramWebAppAvailable() ? WebApp.isFullscreen : false;
}

export function triggerTelegramHapticImpact(
  style: "light" | "medium" | "heavy" | "rigid" | "soft" = "medium"
) {
  if (!isTelegramWebAppAvailable()) {
    return;
  }

  WebApp.HapticFeedback.impactOccurred(style);
}

export function openTelegramLink(url: string) {
  if (!isTelegramWebAppAvailable()) {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    return;
  }

  WebApp.openTelegramLink(url);
}

export async function openTelegramInvoice(
  invoiceLink: string,
  onPaid?: () => Promise<void> | void
) {
  if (!isTelegramWebAppAvailable()) {
    return;
  }

  WebApp.openInvoice(invoiceLink, async (status) => {
    if (status === "paid") {
      await onPaid?.();
    }
  });
}
