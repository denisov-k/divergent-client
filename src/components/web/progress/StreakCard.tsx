import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/ru";
import { Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getStreakDayLabel(count: number, language: string, t: (key: string) => string) {
  const category = new Intl.PluralRules(language.startsWith("ru") ? "ru" : "en").select(count);

  if (category === "one") {
    return t("progress.streak.day_one");
  }

  if (category === "few") {
    return t("progress.streak.day_few");
  }

  return t("progress.streak.day_many");
}

dayjs.extend(isoWeek);
dayjs.locale("ru");

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  streakDays: boolean[];
}

const today = dayjs();

export function StreakCard({ currentStreak, longestStreak, streakDays }: StreakCardProps) {
  const { t, i18n } = useTranslation();
  const currentDayLabel = getStreakDayLabel(currentStreak, i18n.language, t);
  const longestDayLabel = getStreakDayLabel(longestStreak, i18n.language, t);

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
              <span className="text-muted-foreground">{currentDayLabel}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t("progress.streak.current")}</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-muted-foreground">{longestStreak}</span>
              <span className="text-sm text-muted-foreground">{longestDayLabel}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t("progress.streak.record")}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("progress.last_7_days")}</p>
          <div className="grid grid-cols-7 gap-2">
            {streakDays.map((active, index) => {
              const date = today.subtract(6 - index, "day");
              const label = date.format("dd");
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className={`flex size-8 items-center justify-center rounded-full transition-colors ${active ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"}`}>
                    {active && <Flame className="size-4" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {currentStreak >= 7 && <Badge className="w-full justify-center bg-orange-500">{t("progress.streak_great")}</Badge>}
      </CardContent>
    </Card>
  );
}
