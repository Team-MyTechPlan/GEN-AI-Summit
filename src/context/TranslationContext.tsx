"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { getCookie, setCookie } from "cookies-next";

type Locale = "en" | "es";
type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

interface Translations {
  [key: string]: string | Translations;
}

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

interface TranslationProviderProps {
  children: ReactNode;
  initialLocale: Locale;
  initialMessages: Translations;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  initialLocale,
  initialMessages,
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Translations>(initialMessages);

  const loadMessages = useCallback(
    async (newLocale: Locale): Promise<Translations> => {
      try {
        const response = await fetch(`/locales/${newLocale}/common.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newMessages = await response.json();
        console.log(`Loaded messages for ${newLocale}:`, newMessages);
        return newMessages;
      } catch (error) {
        console.error(`Failed to load messages for ${newLocale}:`, error);
        return {};
      }
    },
    []
  );

  const setLocale = useCallback(
    async (newLocale: Locale) => {
      const newMessages = await loadMessages(newLocale);
      setMessages(newMessages);
      setLocaleState(newLocale);
      setCookie("NEXT_LOCALE", newLocale, { maxAge: 365 * 24 * 60 * 60 });
    },
    [loadMessages]
  );

  useEffect(() => {
    const savedLocale = getCookie("NEXT_LOCALE") as Locale | undefined;
    if (savedLocale && savedLocale !== locale) {
      void setLocale(savedLocale);
    }
  }, [locale, setLocale]);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      const keys = key.split(".");
      let current: any = messages;
      for (const k of keys) {
        if (current[k] === undefined) {
          console.warn(`Missing translation: ${key}`);
          return key;
        }
        current = current[k];
      }
      if (typeof current !== "string") {
        console.warn(`Invalid translation for key: ${key}`);
        return key;
      }
      let translation = current;
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          translation = translation.replace(
            new RegExp(`{${paramKey}}`, "g"),
            String(paramValue)
          );
        });
      }
      return translation;
    },
    [messages]
  );

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
