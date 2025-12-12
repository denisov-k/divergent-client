import { Progress } from "./ui/progress";
import {useTranslation} from "react-i18next";

interface ExperienceBarProps {
  currentXp: number;
  requiredXp: number;
  level: number;
}

export function ExperienceBar({ currentXp, requiredXp, level }: ExperienceBarProps) {
  const percentage = Math.min((currentXp / requiredXp) * 100, 100);
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{t('profile.level')} {level}</span>
        </div>
        <span className="text-muted-foreground">
          {currentXp} / {requiredXp} XP
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
