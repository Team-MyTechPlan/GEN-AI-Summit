import { Translations } from "@/types/translations";

const defaultTranslations: Translations = {
  Common: {
    switchLanguage: "Switch to {language}",
    spanish: "Spanish",
    english: "English",
  },
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
};

export default defaultTranslations;
