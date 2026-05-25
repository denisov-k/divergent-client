import { getLocales } from "expo-localization";

import { resolveSupportedLanguage } from "@/i18nConfig";

export function getSystemLanguage() {
  return resolveSupportedLanguage(getLocales()[0]?.languageTag);
}
