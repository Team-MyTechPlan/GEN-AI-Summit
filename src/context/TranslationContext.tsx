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
import { Translations } from "@/types/translations";

type Locale = "en" | "es";
type TranslationParams = Record<string, string | number>;

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  getTranslation: (
    namespace: string
  ) => (key: string, params?: TranslationParams) => string;
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
        console.log(`Loading messages for locale: ${newLocale}`);
        const response = await fetch(`/locales/${newLocale}/common.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newMessages = await response.json();
        console.log(`Loaded messages:`, newMessages);
        setMessages(newMessages);
        return newMessages;
      } catch (error) {
        console.error(`Failed to load messages for ${newLocale}:`, error);
        return {} as Translations;
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

  const getTranslation = useCallback(
    (namespace: string) =>
      (key: string, params?: TranslationParams): string => {
        const parts = namespace.split(".");
        let current: any = messages;

        for (const part of parts) {
          if (!current[part]) {
            console.warn(`Missing translation: ${namespace}.${key}`);
            return `${namespace}.${key}`;
          }
          current = current[part];
        }

        // Verifica que 'current' sea el objeto final esperado
        if (current && typeof current === "object") {
          console.log("Final object to search in:", current);

          let translation = current[key];
          if (typeof translation !== "string") {
            console.warn(`Missing translation: ${namespace}.${key}`);
            return `${namespace}.${key}`;
          }

          if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
              translation = translation.replace(
                new RegExp(`{${paramKey}}`, "g"),
                String(paramValue)
              );
            });
          }
          return translation;
        } else {
          console.warn(`Missing translation: ${namespace}.${key}`);
          return `${namespace}.${key}`;
        }
      },
    [messages]
  );

  return (
    <TranslationContext.Provider value={{ locale, setLocale, getTranslation }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslations = (namespace: string) => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      "useTranslations must be used within a TranslationProvider"
    );
  }
  return context.getTranslation(namespace);
};
