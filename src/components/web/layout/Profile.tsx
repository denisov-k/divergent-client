import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ExperienceBar } from "@/components/shared/ExperienceBar";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useAppStore } from "@/stores/useAppStore.ts";

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAppStore();
  if (!user) return null;

  const { name, level, xp, requiredXp, photoUrl } = user;

  return (
    <div className="flex items-center gap-6">
      <UserAvatar name={name} level={level} avatarUrl={photoUrl} size="md" />
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3>{name}</h3>
            <button onClick={() => navigate("/settings")} className="rounded p-2 hover:bg-gray-200">
              <Settings size={20} color={"var(--muted-foreground)"} />
            </button>
          </div>
        </div>
        <ExperienceBar currentXp={xp} requiredXp={requiredXp} level={level} />
      </div>
    </div>
  );
}

