import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import { fallbackLanguage, resources, resolveSupportedLanguage } from "./i18nConfig";

const deviceLanguage = resolveSupportedLanguage(getLocales()[0]?.languageTag);

i18n
  .use(initReactI18next)
  .init({
    lng: deviceLanguage,
    fallbackLng: fallbackLanguage,
    debug: true,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
