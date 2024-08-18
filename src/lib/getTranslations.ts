// lib/getTranslations.ts
import fs from "fs/promises";
import path from "path";

export async function getTranslations(lang: string = "es") {
  const filePath = getTranslationFilePath(lang);
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default function getTranslationFilePath(locale: string): string {
  const isProduction = process.env.NODE_ENV === "production";
  // Utilizamos process.cwd() para obtener la ruta actual de trabajo
  if (isProduction) {
    console.log(
      "Production mode: " +
        path.join(process.cwd(), "public", "locales", locale, "common.json")
    );
    return path.join(process.cwd(), "public", "locales", locale, "common.json");
  } else {
    console.log(
      "Development mode: " +
        path.join(process.cwd(), "src", "locales", locale, "common.json")
    );
    return path.join(process.cwd(), "src", "locales", locale, "common.json");
  }
}
