"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLanguageStore } from "@/hooks/useLanguageStore";

type TranslationFunction = (
  key: string,
  params?: Record<string, string>
) => string;

interface TranslationContextType {
  t: TranslationFunction;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export const TranslationProvider: React.FC<{
  children: React.ReactNode;
  loadTranslations: (locale: string) => Promise<Record<string, any>>;
}> = ({ children, loadTranslations }) => {
  const { locale } = useLanguageStore();
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    loadTranslations(locale).then(setTranslations);
  }, [locale, loadTranslations]);

  const t: TranslationFunction = (key, params) => {
    const keys = key.split(".");
    let current: any = translations;
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Missing translation: ${key}`);
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
        (acc, [key, value]) => acc.replace(`{${key}}`, value),
        current
      );
    }
    return current;
  };

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslations = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      "useTranslations must be used within a TranslationProvider"
    );
  }
  return context.t;
};
