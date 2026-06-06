import { Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStreakUnitTranslationKey } from "@/shared/display/streak";
import type { GoalPeriod } from "@/types";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  streakItems: { active: boolean; label: string }[];
  windowLabel: string;
  goalPeriod: GoalPeriod;
}

export function StreakCard({ currentStreak, longestStreak, streakItems, windowLabel, goalPeriod }: StreakCardProps) {
  const { t, i18n } = useTranslation();
  const currentUnitLabel = t(getStreakUnitTranslationKey(goalPeriod, currentStreak, i18n.language));
  const longestUnitLabel = t(getStreakUnitTranslationKey(goalPeriod, longestStreak, i18n.language));

  return (
    <Card className="mb-2 break-inside-avoid border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{t("progress.streaks_title")}</CardTitle>
        <Flame className="size-5 text-orange-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl">{currentStreak}</span>
              <span className="text-muted-foreground">{currentUnitLabel}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t("progress.streak.current")}</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-muted-foreground">{longestStreak}</span>
              <span className="text-sm text-muted-foreground">{longestUnitLabel}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t("progress.streak.record")}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{windowLabel}</p>
          <div className="grid grid-cols-7 gap-2">
            {streakItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div className={`flex size-8 items-center justify-center rounded-full transition-colors ${item.active ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"}`}>
                  {item.active && <Flame className="size-4" />}
                </div>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {currentStreak >= 7 && <Badge className="w-full justify-center bg-orange-500">{t("progress.streak_great")}</Badge>}
      </CardContent>
    </Card>
  );
}
