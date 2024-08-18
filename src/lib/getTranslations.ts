// lib/getTranslations.ts
import fs from "fs/promises";
import path from "path";

export async function getTranslations(lang: string = "es") {
  const filePath = path.join(
    process.cwd(),
    "src",
    "locales",
    lang,
    "common.json"
  );
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}
