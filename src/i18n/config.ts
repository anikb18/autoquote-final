import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import enUSCommon from './locales/en-US/common.json';
import enUSDealer from './locales/en-US/dealer.json';
import enUSAdmin from './locales/en-US/admin.json';
import enUSHome from './locales/en-US/home.json';
import enUSPricing from './locales/en-US/pricing.json';

import frCACommon from './locales/fr-CA/common.json';
import frCADealer from './locales/fr-CA/dealer.json';
import frCAAdmin from './locales/fr-CA/admin.json';
import frCAHome from './locales/fr-CA/home.json';
import frCAPricing from './locales/fr-CA/pricing.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    resources: {
      'en-US': {
        common: enUSCommon,
        dealer: enUSDealer,
        admin: enUSAdmin,
        home: enUSHome,
        pricing: enUSPricing
      },
      'fr-CA': {
        common: frCACommon,
        dealer: frCADealer,
        admin: frCAAdmin,
        home: frCAHome,
        pricing: frCAPricing
      }
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'dealer', 'admin', 'home', 'pricing'],
    defaultNS: 'common'
  });

export default i18n;