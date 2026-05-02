import { requireOptionalNativeModule } from "expo-modules-core";

type NativeTelegramLoginModule = {
  configure(clientId: string, redirectUri: string, scopes: string[], fallbackScheme?: string | null): void;
  loginAsync(): Promise<{ idToken: string }>;
};

const moduleRef = requireOptionalNativeModule<NativeTelegramLoginModule>("DivergentTelegramLogin");

const DEFAULT_CLIENT_ID = "8460145268";
const DEFAULT_REDIRECT_URI = "https://app262127326-login.tg.dev";
const DEFAULT_SCOPES = ["profile"];
const DEFAULT_FALLBACK_SCHEME = "divergent";

function getClientId() {
  return process.env.EXPO_PUBLIC_TELEGRAM_CLIENT_ID || DEFAULT_CLIENT_ID;
}

function getRedirectUri() {
  return process.env.EXPO_PUBLIC_TELEGRAM_LOGIN_REDIRECT_URI || DEFAULT_REDIRECT_URI;
}

function getFallbackScheme() {
  return process.env.EXPO_PUBLIC_APP_SCHEME || DEFAULT_FALLBACK_SCHEME;
}

export type NativeTelegramLoginResult = {
  idToken: string;
};

export function isNativeTelegramLoginSupported() {
  return Boolean(moduleRef);
}

export function configureNativeTelegramLogin() {
  moduleRef?.configure(getClientId(), getRedirectUri(), DEFAULT_SCOPES, getFallbackScheme());
}

export async function loginWithNativeTelegram(): Promise<NativeTelegramLoginResult> {
  if (!moduleRef) {
    throw new Error("Native Telegram login module is not available.");
  }

  return moduleRef.loginAsync();
}
