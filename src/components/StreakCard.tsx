import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {Flame} from "lucide-react";
import { Badge } from "./ui/badge";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import isoWeek from "dayjs/plugin/isoWeek";
import {useTranslation} from "react-i18next";

dayjs.extend(isoWeek);
dayjs.locale("ru");

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  streakDays: boolean[];
}

const today = dayjs();

export function StreakCard({ currentStreak, longestStreak, streakDays }: StreakCardProps) {
  const {t} = useTranslation();

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent my-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">Серия выполнений</CardTitle>
        <Flame className="size-5 text-orange-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl">
                {currentStreak}
              </span>
              <span className="text-muted-foreground">
                {t("progress.streak.day", { count: currentStreak })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Текущая серия</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-muted-foreground">
                {longestStreak}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("progress.streak.day", { count: longestStreak })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Рекорд</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Последние 7 дней</p>
          <div className="grid grid-cols-7 gap-2">
            {streakDays.map((active, index) => {
              const date = today.subtract(6 - index, "day");
              const label = date.format("dd"); // Пн, Вт, Ср...

              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className={`size-8 rounded-full flex items-center justify-center transition-colors ${
                      active
                        ? "bg-orange-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {active && <Flame className="size-4"/>}
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {currentStreak >= 7 && (
          <Badge className="w-full justify-center bg-orange-500">
            🔥 Отличная серия! Продолжайте в том же духе!
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
