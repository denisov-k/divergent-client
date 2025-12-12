import { useAppStore } from '@/stores/useAppStore';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { user, updateUser } = useAppStore();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;

    i18n.changeLanguage(lang);
    await updateUser({ language: lang });
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-500">{t('settings.language')}</label>
      <select
        className="mt-1 p-2 border rounded"
        value={user!.language || i18n.language}
        onChange={handleChange}
      >
        <option value="en">English</option>
        <option value="ru">Русский</option>
      </select>
    </div>
  );
}
