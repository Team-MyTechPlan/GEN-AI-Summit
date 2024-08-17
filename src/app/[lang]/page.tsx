"use client";
import { useTranslation } from "@/context/TranslationContext";

export default function Home() {
  const { t } = useTranslation();

  console.log("Translation function:", t);
  console.log("Home title translation:", t("Home.title"));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>{t("Home.title")}</div>
      <p>{t("Home.description")}</p>
    </main>
  );
}
