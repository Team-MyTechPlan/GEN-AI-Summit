"use client";
import { LanguageSwitchButton } from "@/components/shared/LanguageSwitchButton";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useTranslations } from "@/context/TranslationContext";

export default function ExampleComponent() {
  const t = useTranslations("Home");
  const m = useTranslations("Common");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <p>{t("variable", { status: m("spanish") })}</p>
      <p>{t("variable", { status: m("english") })}</p>
      <LanguageSwitchButton />
      <ThemeToggle />
    </div>
  );
}
