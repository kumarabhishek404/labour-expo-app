import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { useCallback } from "react";

// Import translation files
import en from "../app/locales/en.json";
import hi from "../app/locales/hi.json";
import mr from "../app/locales/mr.json";
import rj from "../app/locales/rj.json";
import bn from "../app/locales/bn.json";
import gu from "../app/locales/gu.json";
import kn from "../app/locales/kn.json";
import ks from "../app/locales/ks.json";
import ml from "../app/locales/ml.json";
import pa from "../app/locales/pa.json";
import ta from "../app/locales/ta.json";
import te from "../app/locales/te.json";
import ur from "../app/locales/ur.json";

// Create an i18n instance with translation files
const i18n: any = new I18n({
  en, // English
  hi, // Hindi
  mr, // Marathi
  rj, // Rajasthani
  ta, // Tamil
  te, // Telugu
  bn, // Bangali
  gu, // Gujarati
  kn, // Kannad
  ks, // Kashmiri
  ml, // Malayalam
  pa, // Punjabi
  ur, // Urdu
});

// Set the default locale to the device's locale
i18n.locale = Localization.getLocales()[0].languageCode;

// Enable fallback to default language if a translation key is missing
i18n.fallbacks = true;

export const setI18nLocale = (locale: string) => {
  i18n.locale = locale;
};

// Function to get dynamic worker type translation
export const getDynamicWorkerType = (key: string, count: number): string => {
  const translations = i18n.t(key);
  if (translations && translations.singular && translations.plural) {
    return count === 1 ? translations.singular : translations.plural;
  }
  return i18n.t(key); // Fallback to the regular translation if singular/plural not found
};

// Custom hook to use `t` directly
export const useTranslation = () => {
  const t = useCallback(
    (key: string, options?: object) => i18n.t(key, options),
    []
  );
  return { t };
};

export default i18n;
