"use client";
import { useTranslations } from "@/context/TranslationContext";
import { useLanguageStore } from "@/hooks/useLanguageStore";

export default function ExampleComponent() {
  const t = useTranslations();
  const { locale } = useLanguageStore();

  return (
    <div>
      <h1>{t("Home.title")}</h1>
      <p>{t("Home.description")}</p>
      <p>{t("Home.variable", { status: t("Home.success") })}</p>
      <p>
        {t("Home.switchLanguage", {
          language: locale === "en" ? t("Home.spanish") : t("Home.english"),
        })}
      </p>
    </div>
  );
}
