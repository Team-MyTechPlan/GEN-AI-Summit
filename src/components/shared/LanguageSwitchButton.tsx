"use client";
import { useTranslations } from "@/context/TranslationContext";
import React from "react";

export const LanguageSwitchButton: React.FC = () => {
  const { t, locale } = useTranslations();

  const handleLanguageChange = () => {
    const newLocale = locale === "en" ? "es" : "en";

    // Construir la nueva URL
    const currentPath = window.location.pathname;
    const newPath =
      currentPath.startsWith("/en") || currentPath.startsWith("/es")
        ? `/${newLocale}${currentPath.substring(3)}`
        : `/${newLocale}${currentPath}`;

    // Forzar una recarga completa de la página con la nueva URL
    window.location.href = `${window.location.origin}${newPath}`;
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      {t("Common.switchLanguage", {
        language: locale === "en" ? t("Common.spanish") : t("Common.english"),
      })}
    </button>
  );
};
