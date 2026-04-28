import { Flame, Target, Trophy } from "lucide-react";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FriendSummary } from "@/types";

export type FriendCardProps = FriendSummary;

export function FriendCard({ name, level, avatarUrl, currentXp, totalGoals, completedGoals, streak, rank }: FriendCardProps) {
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <UserAvatar name={name} level={level} avatarUrl={avatarUrl} size="md" />
            {rank && rank <= 3 && (
              <div className="absolute -right-2 -top-2">
                <Badge variant="default" className={`flex size-6 items-center justify-center rounded-full p-0 ${rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-700"}`}>
                  {rank}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="flex items-center gap-2">
                {name}
                {rank === 1 && <Trophy className="size-4 text-yellow-500" />}
              </h3>
              <p className="text-muted-foreground">Уровень {level} • {currentXp} XP</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Прогресс целей</span>
                <span>{completedGoals} / {totalGoals}</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Target className="size-4 text-primary" />
                <span className="text-sm">{completedGoals} целей</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="size-4 text-orange-500" />
                <span className="text-sm">{streak} дней</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

