import WebApp from "@twa-dev/sdk";

export async function openTelegramInvoice(
  invoiceLink: string,
  onPaid?: () => Promise<void> | void
) {
  WebApp.openInvoice(invoiceLink, async (status) => {
    if (status === "paid") {
      await onPaid?.();
    }
  });
}
