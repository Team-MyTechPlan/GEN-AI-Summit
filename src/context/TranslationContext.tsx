// context/TranslationContext.tsx

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { getCookie, setCookie } from "cookies-next";

type Locale = "en" | "es";

interface Translations {
  [key: string]: string | Translations;
}

interface TranslationsContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  isLoading: boolean;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(
  undefined
);

interface TranslationsProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  initialTranslations: Translations;
}

const COOKIE_NAME = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export function TranslationsProvider({
  children,
  initialLocale,
  initialTranslations,
}: TranslationsProviderProps) {
  const [translations, setTranslations] =
    useState<Translations>(initialTranslations);
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isLoading, setIsLoading] = useState(false);

  const loadTranslations = useCallback(
    async (locale: Locale): Promise<Translations> => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/translations?lang=${locale}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIsLoading(false);
        return data;
      } catch (error) {
        console.error("Error loading translations:", error);
        setIsLoading(false);
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
        setCookie(COOKIE_NAME, newLocale, {
          maxAge: COOKIE_MAX_AGE,
          path: "/",
        });
      }
    },
    [locale, loadTranslations]
  );

  useEffect(() => {
    const savedLocale = getCookie(COOKIE_NAME) as Locale | undefined;
    if (
      savedLocale &&
      (savedLocale === "en" || savedLocale === "es") &&
      savedLocale !== locale
    ) {
      setLocale(savedLocale);
    }
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

  const contextValue = useMemo(
    () => ({
      t,
      locale,
      setLocale,
      isLoading,
    }),
    [t, locale, setLocale, isLoading]
  );

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
