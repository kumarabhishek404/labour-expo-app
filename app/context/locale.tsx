import i18n, { setI18nLocale } from "@/utils/i18n";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import Atoms from "@/app/AtomStore";
import { useAtom, useAtomValue } from "jotai";

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<string>(i18n.locale);
  const [language, setLanguage] = useAtom(Atoms?.LanguageAtom);

  useEffect(() => {
    // Load the saved locale when the app starts
    const loadLocale = async () => {
      const savedLocale = await language;
      if (savedLocale) {
        setI18nLocale(savedLocale);
        setLocaleState(savedLocale);
      }
    };

    loadLocale();
  }, [language]);

  const setLocale = async (locale: string) => {
    setI18nLocale(locale);
    setLocaleState(locale);
    await setLanguage(locale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

const LOCAL_CONTEXT = {
  useLocale,
  LocaleProvider,
};

export default LOCAL_CONTEXT;
