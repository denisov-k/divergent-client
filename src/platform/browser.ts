export function openExternalLink(url: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

export function redirectToUrl(url: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.location.assign(url);
}

export async function shareLink(url: string) {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    await navigator.share({ url });
    return;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  if (typeof window !== "undefined") {
    window.prompt("Copy this link", url);
  }
}
