import { TranslationProvider } from "@/context/TranslationContext";
import { Translations } from "@/types/translations";
import defaultTranslations from "@/lib/utils/defaultTranslations";

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const locale = ["en", "es"].includes(lang) ? (lang as "en" | "es") : "en";

  console.log(`Selected locale: ${locale}`);

  let messages: Translations = defaultTranslations;
  try {
    // Intenta analizar las traducciones precargadas desde la URL
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const preloadedTranslations = searchParams.get("translations");
      if (preloadedTranslations) {
        const parsedTranslations = JSON.parse(preloadedTranslations);
        messages = { ...defaultTranslations, ...parsedTranslations };
      }
    }

    // Si no hay traducciones precargadas, intenta importarlas
    if (Object.keys(messages).length === 0) {
      const importedTranslations = await import(
        `@/locales/${locale}/common.json`
      ).then((module) => module.default);
      messages = { ...defaultTranslations, ...importedTranslations };
    }

    console.log(`Loaded messages for ${locale}:`, messages);
  } catch (error) {
    console.error(`Failed to load initial messages for ${locale}:`, error);
    // Usa las traducciones predeterminadas en caso de error
    messages = defaultTranslations;
  }

  return (
    <html lang={locale}>
      <body>
        <TranslationProvider initialLocale={locale} initialMessages={messages}>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
