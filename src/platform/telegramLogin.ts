export type NativeTelegramLoginResult = {
  idToken: string;
};

export function isNativeTelegramLoginSupported() {
  return false;
}

export function configureNativeTelegramLogin() {
  return;
}

export async function loginWithNativeTelegram(): Promise<NativeTelegramLoginResult> {
  throw new Error("Native Telegram login is not available on this platform.");
}
