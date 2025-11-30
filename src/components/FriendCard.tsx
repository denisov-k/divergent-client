import { Card, CardContent } from "./ui/card";
import { UserAvatar } from "./UserAvatar";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

import { Trophy, Target, Flame } from "lucide-react";

export interface FriendCardProps {
  id: string;
  name: string;
  level: number;
  avatarUrl?: string;
  currentXp: number;
  totalGoals: number;
  completedGoals: number;
  streak: number;
  rank?: number;
}

export function FriendCard({
  name,
  level,
  avatarUrl,
  currentXp,
  totalGoals,
  completedGoals,
  streak,
  rank,
}: FriendCardProps) {
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <UserAvatar name={name} level={level} avatarUrl={avatarUrl} size="md" />
            {rank && rank <= 3 && (
              <div className="absolute -top-2 -right-2">
                <Badge 
                  variant="default" 
                  className={`size-6 flex items-center justify-center p-0 rounded-full ${
                    rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-700"
                  }`}
                >
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
