import { TranslationProvider } from "@/context/TranslationContext";

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const locale = ["en", "es"].includes(lang) ? (lang as "en" | "es") : "en";

  let messages;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/locales/${locale}/common.json`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    messages = await response.json();
  } catch (error) {
    console.error(`Failed to load initial messages for ${locale}:`, error);
    messages = {};
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
