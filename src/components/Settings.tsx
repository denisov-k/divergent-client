import { useAppStore } from '@/stores/useAppStore';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import TimezoneSelector from "@/components/TimezoneSelector.tsx";

export default function Settings() {
  const { t } = useTranslation();
  const { signOut, user } = useAppStore();

  if (!user) return null;

  return (
    <div className="space-y-2 py-2 justify-center flex flex-col">
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">{t('settings.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">{t('settings.id')}</label>
            <input
              className="mt-1 p-2 border rounded bg-gray-50"
              value={user.id}
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">{t('settings.role')}</label>
            <input
              className="mt-1 p-2 border rounded bg-gray-50"
              value={user.role || 'user'}
              readOnly
            />
          </div>
        </div>
        <LanguageSwitcher/>
        <TimezoneSelector></TimezoneSelector>
      </div>
      <div className="flex justify-center">
        <button
          onClick={signOut}
          className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition w-26"
        >
          {t('settings.sign_out')}
        </button>
      </div>
    </div>
  );
}
