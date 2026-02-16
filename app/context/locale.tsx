import i18n, { setI18nLocale } from "@/utils/i18n";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import Atoms from "@/app/AtomStore";
import { useAtom } from "jotai";

type Role = "WORKER" | "EMPLOYER" | "MEDIATOR";

type AppContextType = {
  locale: string;
  role: Role;
  appKey: number; // ⭐ new
  setLocale: (locale: string) => void;
  setRole: (role: Role) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
  // 🌐 Language Atom
  const [language, setLanguage] = useAtom(Atoms.LanguageAtom);
  const [appKey, setAppKey] = useState(0);

  // 👤 Role Atom
  const [savedRole, setSavedRole] = useAtom(Atoms.SelectedRoleAtom);

  const [locale, setLocaleState] = useState<string>(i18n.locale);
  const [role, setRoleState] = useState<Role>("WORKER");

  // Load saved language + role on app start
  useEffect(() => {
    const loadAppSettings = async () => {
      if (language) {
        setI18nLocale(language);
        setLocaleState(language);
      }

      if (savedRole) {
        setRoleState(savedRole);
      }
    };

    loadAppSettings();
  }, [language, savedRole]);

  // Change Language
  const setLocale = async (newLocale: string) => {
    setI18nLocale(newLocale);
    setLocaleState(newLocale);
    await setLanguage(newLocale);
  };

  // Change Role
  const setRole = async (newRole: Role) => {
    if (newRole === role) return;

    setRoleState(newRole);
    await setSavedRole(newRole);

    // ⭐ Reset navigation & refresh whole app
    setAppKey((prev) => prev + 1);
  };

  return (
    <AppContext.Provider value={{ locale, role, setLocale, setRole, appKey }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

const APP_CONTEXT = {
  useApp,
  AppProvider,
};

export default APP_CONTEXT;
