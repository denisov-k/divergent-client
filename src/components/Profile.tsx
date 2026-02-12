import {UserAvatar} from "@/components/UserAvatar.tsx";
import {Settings} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "@/stores/useAppStore.ts";
import { ExperienceBar } from "@/components/ExperienceBar.tsx";

export function Profile() {

  const navigate = useNavigate();
  const { user } = useAppStore();
  if (!user) return null;

  const { name, level, xp, requiredXp, photoUrl } = user;

  const goToSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="flex gap-6 items-center">
      <UserAvatar name={name} level={level} avatarUrl={photoUrl} size="md"/>
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
        </div>
        <ExperienceBar
          currentXp={xp}
          requiredXp={requiredXp}
          level={level}
        />
      </div>
    </div>
  );
}
