// app/layout.tsx
import { TranslationsProvider } from "@/context/TranslationContext";
import { getTranslations } from "@/lib/getTranslations";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialTranslations = await getTranslations("es");

  return (
    <html lang="es">
      <body>
        <TranslationsProvider
          initialLocale="es"
          initialTranslations={initialTranslations}
        >
          {children}
        </TranslationsProvider>
      </body>
    </html>
  );
}
