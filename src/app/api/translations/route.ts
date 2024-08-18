// pages/api/translations.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lang } = req.query;

  if (typeof lang !== "string" || !["en", "es"].includes(lang)) {
    return res.status(400).json({ error: "Invalid language" });
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "locales",
      lang,
      "common.json"
    );
    const fileContents = await fs.readFile(filePath, "utf8");
    const translations = JSON.parse(fileContents);
    res.status(200).json(translations);
  } catch (error) {
    console.error("Failed to load translations:", error);
    res.status(500).json({ error: "Failed to load translations" });
  }
}
