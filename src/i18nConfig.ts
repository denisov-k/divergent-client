import enTranslation from "./locales/en/translation.json";
import ruTranslation from "./locales/ru/translation.json";

export const resources = {
  en: {
    translation: enTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
} as const;

export const fallbackLanguage = "en";
export const defaultLanguage = "ru";

export function resolveSupportedLanguage(input?: string | null) {
  const normalized = input?.toLowerCase().split("-")[0];

  if (normalized === "en" || normalized === "ru") {
    return normalized;
  }

  return defaultLanguage;
}

export function getSystemLanguage() {
  return resolveSupportedLanguage(Intl.DateTimeFormat().resolvedOptions().locale);
}
