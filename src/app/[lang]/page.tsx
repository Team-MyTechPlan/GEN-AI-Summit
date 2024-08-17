"use client";

import { useTranslations } from "@/context/TranslationContext";

export default function Home() {
  const t = useTranslations("Home");

  // Simulando variables de éxito y error
  const success = { message: "Operation successful" };
  const error = { message: "An error occurred" };

  console.log("Home title translation:", t("title"));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>{t("title")}</div>
      <p>{t("description")}</p>
      <p>
        {t("variable", {
          success: success.message,
          error: error.message,
        })}
      </p>
      <p>{t("success", { success: success.message })}</p>
      <p>{t("error", { error: error.message })}</p>
    </main>
  );
}
