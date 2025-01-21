import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import enUSCommon from './locales/en-US/common.json';
import enUSDealer from './locales/en-US/dealer.json';
import enUSAdmin from './locales/en-US/admin.json';

import frCACommon from './locales/fr-CA/common.json';
import frCADealer from './locales/fr-CA/dealer.json';
import frCAAdmin from './locales/fr-CA/admin.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    resources: {
      'en-US': {
        common: enUSCommon,
        dealer: enUSDealer,
        admin: enUSAdmin
      },
      'fr-CA': {
        common: frCACommon,
        dealer: frCADealer,
        admin: frCAAdmin
      }
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'dealer', 'admin'],
    defaultNS: 'common'
  });

export default i18n;