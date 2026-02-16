import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Flame } from "lucide-react";
import { Badge } from "./ui/badge";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  streakDays: boolean[];
}

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function StreakCard({ currentStreak, longestStreak, streakDays }: StreakCardProps) {
  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent my-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="size-5 text-orange-500" />
          Серия выполнений
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl">{currentStreak}</span>
              <span className="text-muted-foreground">дней</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Текущая серия</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-muted-foreground">{longestStreak}</span>
              <span className="text-sm text-muted-foreground">дней</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Рекорд</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Последние 7 дней</p>
          <div className="grid grid-cols-7 gap-2">
            {streakDays.map((active, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className={`size-8 rounded-full flex items-center justify-center transition-colors ${
                    active
                      ? "bg-orange-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {active ? <Flame className="size-4" /> : ""}
                </div>
                <span className="text-xs text-muted-foreground">{daysOfWeek[index]}</span>
              </div>
            ))}
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
