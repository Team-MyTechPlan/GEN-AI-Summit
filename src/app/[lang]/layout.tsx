import { TranslationProvider } from "@/context/TranslationContext";
import fs from "fs";
import path from "path";

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const locale = ["en", "es"].includes(lang) ? (lang as "en" | "es") : "en";

  console.log(`Selected locale: ${locale}`);

  let messages;
  try {
    // Usar el alias '@' para construir la ruta del archivo JSON
    const filePath = path.resolve(
      process.cwd(),
      `src/locales/${locale}/common.json`
    );
    console.log(`Loading translations from: ${filePath}`);

    // Leer el archivo JSON directamente desde el sistema de archivos
    const fileContents = fs.readFileSync(filePath, "utf8");
    messages = JSON.parse(fileContents);
    console.log(`Loaded messages for ${locale}:`, messages);
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
