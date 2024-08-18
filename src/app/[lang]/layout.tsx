// src/app/layout.tsx
import { TranslationsProvider } from "@/context/TranslationContext";
import defaultTranslations from "@/locales/es/common.json"; // Asegúrate de que esta importación sea correcta

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <TranslationsProvider
          initialLocale="es"
          initialTranslations={defaultTranslations}
        >
          {children}
        </TranslationsProvider>
      </body>
    </html>
  );
}
