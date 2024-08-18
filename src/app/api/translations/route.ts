// src/app/api/translations/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");

  if (!lang || !["en", "es"].includes(lang)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
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
    return NextResponse.json(translations);
  } catch (error) {
    console.error("Failed to load translations:", error);
    return NextResponse.json(
      { error: "Failed to load translations" },
      { status: 500 }
    );
  }
}
