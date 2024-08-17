"use client";
import { useEffect } from "react";
import { useLanguageStore } from "@/hooks/useLanguageStore";
import { TranslationProvider } from "@/context/TranslationContext";
import { getCookie } from "cookies-next";
import { LanguageSwitchButton } from "@/components/shared/LanguageSwitchButton";

async function loadTranslations(locale: string) {
  try {
    const translations = await import(`@/locales/${locale}/common.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    return {};
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, setLocale } = useLanguageStore();

  useEffect(() => {
    const savedLocale = getCookie("NEXT_LOCALE") as "en" | "es" | undefined;
    if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
      setLocale(savedLocale);
    }
  }, [setLocale]);

  return (
    <html lang={locale}>
      <body>
        <TranslationProvider loadTranslations={loadTranslations}>
          <header>
            <LanguageSwitchButton />
          </header>
          <main>{children}</main>
        </TranslationProvider>
      </body>
    </html>
  );
}
