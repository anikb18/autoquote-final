import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import all translation files
import enUSCommon from "./locales/en-US/common.json";
import enUSDealer from "./locales/en-US/dealer.json";
import enUSAdmin from "./locales/en-US/admin.json";
import enUSHome from "./locales/en-US/home.json";
import enUSPricing from "./locales/en-US/pricing.json";
import enUSTestimonials from "./locales/en-US/testimonials.json";
import enUSFeatures from "./locales/en-US/features.json";
import enUSForm from "./locales/en-US/form.json";
import frCACommon from "./locales/fr-CA/common.json";
import frCADealer from "./locales/fr-CA/dealer.json";
import frCAAdmin from "./locales/fr-CA/admin.json";
import frCAHome from "./locales/fr-CA/home.json";
import frCAPricing from "./locales/fr-CA/pricing.json";
import frCATestimonials from "./locales/fr-CA/testimonials.json";
import frCAFeatures from "./locales/fr-CA/features.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-US",
    resources: {
      "en-US": {
        common: enUSCommon,
        dealer: enUSDealer,
        admin: enUSAdmin,
        home: enUSHome,
        pricing: enUSPricing,
        testimonials: enUSTestimonials,
        features: enUSFeatures,
      },
      "fr-CA": {
        common: frCACommon,
        dealer: frCADealer,
        admin: frCAAdmin,
        home: frCAHome,
        pricing: frCAPricing,
        testimonials: frCATestimonials,
        features: frCAFeatures,
      },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    ns: [
      "common",
      "dealer",
      "admin",
      "home",
      "pricing",
      "testimonials",
      "features",
      "form",
    ],
    defaultNS: "common",
  });

export default i18n;
