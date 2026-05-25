import { useTranslation } from "react-i18next";

import { getSystemLanguage } from "@/i18nConfig";
import { useAppStore } from "@/stores/useAppStore";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { user, updateUser } = useAppStore();
  const systemLanguage = getSystemLanguage();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    const nextLanguage = lang === "system" ? null : lang;
    await i18n.changeLanguage(nextLanguage ?? systemLanguage);
    await updateUser({ language: nextLanguage });
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-500">{t("settings.language")}</label>
      <select className="mt-1 rounded border p-2" value={user!.language ?? "system"} onChange={handleChange}>
        <option value="system">{t("settings.language_system")}</option>
        <option value="en">{t("settings.language_english")}</option>
        <option value="ru">{t("settings.language_russian")}</option>
      </select>
    </div>
  );
}
