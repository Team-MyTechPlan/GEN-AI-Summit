"use client";
import { LanguageSwitchButton } from "@/components/shared/LanguageSwitchButton";
import { useTranslations } from "@/context/TranslationContext";

export default function HomePage() {
  const { t } = useTranslations();

  return (
    <div>
      <h1>{t("Home.title")}</h1>
      <p>{t("Home.description")}</p>
      <LanguageSwitchButton />
    </div>
  );
}
