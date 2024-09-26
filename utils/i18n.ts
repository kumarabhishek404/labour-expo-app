// import * as Localization from "expo-localization";
// import { I18n } from "i18n-js";

// // Import translation files
// import en from "../app/locales/en.json";
// import hi from "../app/locales/hi.json";

// // Create an instance of I18n and set translations with type safety
// const i18n: any = new I18n({
//   en,
//   hi,
// });

// // Set the locale dynamically based on the user's device locale
// i18n.locale = Localization.getLocales()[0].languageCode;

// // Enable fallback to English if a translation key is missing
// i18n.fallbacks = true;

// export const setI18nLocale = (locale: string) => {
//   console.log("Locale ---", locale);
//   i18n.locale = locale;
// };

// export default i18n;


import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Interface for translations
interface TranslationType {
  welcome: string;
  goodbye: string;
}

// Import translation files
import en from '../app/locales/en.json';
import hi from '../app/locales/hi.json';
import mr from '../app/locales/mr.json';
import rj from '../app/locales/rj.json';
import ta from '../app/locales/ta.json';


// Create an i18n instance with translation files
const i18n:any = new I18n({
  en, // English
  hi, // Hindi
  mr, // Marathi
  rj, // Rajasthani
  ta, // Tamil
});

// Set the default locale to the device's locale
i18n.locale = Localization.getLocales()[0].languageCode;

// Enable fallback to default language if a translation key is missing
i18n.fallbacks = true;

export const setI18nLocale = (locale: string) => {
  i18n.locale = locale;
};

export default i18n;