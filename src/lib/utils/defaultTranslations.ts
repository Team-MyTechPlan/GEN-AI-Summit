import { Translations } from "@/types/translations";

const defaultTranslations: Translations = {
  NotFound: {
    title: "Not Found",
    description: "The page you're looking for doesn't exist.",
  },
  Home: {
    title: "Home",
    description: "Welcome to the homepage.",
    variable: "Operation successful, An error occurred",
    success: "Operation successful",
    error: "An error occurred",
  },
  // Añade aquí cualquier otra propiedad que tu tipo Translations requiera
};

export default defaultTranslations;
