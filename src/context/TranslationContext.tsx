"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { getCookie } from "cookies-next";

type Locale = "en" | "es";

interface Translations {
  [key: string]: string | Translations;
}

interface TranslationsContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(
  undefined
);

interface TranslationsProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  initialTranslations: Translations;
}

export function TranslationsProvider({
  children,
  initialLocale,
  initialTranslations,
}: TranslationsProviderProps) {
  const [translations, setTranslations] =
    useState<Translations>(initialTranslations);
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const savedLocale = getCookie("NEXT_LOCALE") as Locale | undefined;
    if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
      setLocaleState(savedLocale);
      loadTranslations(savedLocale).then(setTranslations);
    }
  }, []);

  const loadTranslations = useCallback(
    async (locale: Locale): Promise<Translations> => {
      try {
        const response = await fetch(`/api/translations?lang=${locale}`);
        if (!response.ok) {
          throw new Error("Failed to fetch translations");
        }
        return await response.json();
      } catch (error) {
        console.error("Error loading translations:", error);
        return {};
      }
    },
    []
  );

  const setLocale = useCallback(
    async (newLocale: Locale) => {
      if (newLocale !== locale) {
        const newTranslations = await loadTranslations(newLocale);
        setTranslations(newTranslations);
        setLocaleState(newLocale);
        // Optionally, you can set a cookie or use localStorage here to persist the language preference
      }
    },
    [locale, loadTranslations]
  );

  useEffect(() => {
    // Optionally, you can load the initial locale from a cookie or localStorage here
    // and call setLocale if it's different from the initialLocale
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split(".");
      let current: any = translations;

      for (const k of keys) {
        if (current[k] === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
        current = current[k];
      }

      if (typeof current !== "string") {
        console.warn(`Invalid translation key: ${key}`);
        return key;
      }

      if (params) {
        return Object.entries(params).reduce(
          (acc, [paramKey, paramValue]) =>
            acc.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue)),
          current
        );
      }

      return current;
    },
    [translations]
  );

  const contextValue = {
    t,
    locale,
    setLocale,
  };

  return (
    <TranslationsContext.Provider value={contextValue}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error(
      "useTranslations must be used within a TranslationsProvider"
    );
  }
  return context;
}
