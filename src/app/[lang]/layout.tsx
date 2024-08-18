// src/app/layout.tsx
import { TranslationsProvider } from "@/context/TranslationContext";
import { getTranslations } from "@/lib/getTranslations";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialTranslations;

  try {
    initialTranslations = await getTranslations("es");
  } catch (error) {
    console.error("Failed to load initial translations:", error);
    // Proporciona un objeto con las propiedades mínimas requeridas
    initialTranslations = {
      NotFound: {
        title: "Página no encontrada",
        description: "La página que buscas no existe.",
      },
      Home: {
        pageTitle: "Bienvenido a nuestro Sitio Web",
        title: "¡Hola, Mundo!",
        description: "Este es un ejemplo de internacionalización.",
        variable: "Estado de la operación: {status}",
        success: "Éxito",
        switchLanguage: "Cambiar a {language}",
        spanish: "Español",
        english: "Inglés",
        footer: "© 2024 Nuestra Empresa",
      },
      // Agrega otras propiedades que sean necesarias según la estructura de `Translations`
    };
  }

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
