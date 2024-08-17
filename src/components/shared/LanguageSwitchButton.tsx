"use client";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/hooks/useLanguageStore";
import { useEffect } from "react";
import { useTranslations } from "@/context/TranslationContext";
import { setCookie } from "cookies-next";

// Componente de cambio de idioma
export const LanguageSwitchButton: React.FC = () => {
  const { locale, setLocale } = useLanguageStore();
  const router = useRouter();
  const t = useTranslations();

  const handleLanguageChange = () => {
    const newLocale = locale === "en" ? "es" : "en";
    setLocale(newLocale);
    setCookie("NEXT_LOCALE", newLocale, { maxAge: 365 * 24 * 60 * 60 });

    // Actualiza la URL y recarga la página
    router.push(`/${newLocale}`);
    window.location.href = `/${newLocale}`; // Redirige a la nueva URL
  };

  return (
    <button onClick={handleLanguageChange}>
      {t("Home.switchLanguage", {
        language: locale === "en" ? t("Home.spanish") : t("Home.english"),
      })}
    </button>
  );
};
