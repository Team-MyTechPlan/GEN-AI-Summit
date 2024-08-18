// src/app/layout.tsx
import { ThemeProvider } from "@/context/ThemeProvider";
import { TranslationsProvider } from "@/context/TranslationContext";
import defaultTranslations from "@/locales/es/common.json"; // Asegúrate de que esta importación sea correcta
import "@/app/styles/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <TranslationsProvider
          initialLocale="es"
          initialTranslations={defaultTranslations}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
