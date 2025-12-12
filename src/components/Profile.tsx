import {UserAvatar} from "@/components/UserAvatar.tsx";
import {Settings} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "@/stores/useAppStore.ts";
import { ExperienceBar } from "@/components/ExperienceBar.tsx";
import {useTranslation} from "react-i18next";


export function Profile() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { user } = useAppStore();
  if (!user) return null;

  const { name, level, xpInCurrentLevel, requiredXp, photoUrl } = user;

  const goToSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="flex items-start gap-6">
      <UserAvatar name={name} level={level} avatarUrl={photoUrl} size="lg"/>
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <h1>{name}</h1>
            <button
              onClick={goToSettings}
              className="p-2 rounded hover:bg-gray-200"
            >
              <Settings size={20} color={'var(--muted-foreground'}/>
            </button>
          </div>
          <p className="text-muted-foreground">
            {t('profile.description')}
          </p>
        </div>
        <ExperienceBar
          currentXp={xpInCurrentLevel}
          requiredXp={requiredXp}
          level={level}
        />
      </div>
    </div>
  );
}
