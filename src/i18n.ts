import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { defaultLanguage, fallbackLanguage, resources } from './i18nConfig';

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: defaultLanguage,
    fallbackLng: fallbackLanguage,
    debug: true,
    resources,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export default i18n;
