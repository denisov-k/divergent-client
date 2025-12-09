import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {Trophy, Star, Gift, Crown, Award, Zap, Edit, Target} from "lucide-react";

type RewardIcon = "trophy" | "star" | "gift" | "crown" | "award" | "zap";

interface RewardCardProps {
  id: string;
  title: string;
  description: string;
  icon?: RewardIcon;
  isUnlocked?: boolean;
  goalTitle?: string;          // <-- Новое
  onEdit?: (id: string) => void;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  gift: Gift,
  crown: Crown,
  award: Award,
  zap: Zap,
};

export function RewardCard({
                             id,
                             title,
                             description,
                             icon = "trophy",
                             isUnlocked = false,
                             goalTitle,
                             onEdit,
                           }: RewardCardProps) {
  const Icon = iconMap[icon];

  return (
    <Card
      className={`transition-all ${
        isUnlocked
          ? "border-green-500 bg-green-500/5"
          : ""
      }`}
    >
      <CardContent className="px-6 [&:last-child]:pb-6 pt-6">
        <div className="flex gap-4 items-center">
          <div
            className={`p-3 rounded-lg ${
              isUnlocked ? "bg-green-500/10" : "bg-muted"
            }`}
          >
            <Icon
              className={`size-6 ${
                isUnlocked ? "text-green-600" : "text-muted-foreground"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle>{title}</CardTitle>
              {isUnlocked && (
                <Badge variant="default" className="bg-green-600">
                  Получено
                </Badge>
              )}
            </div>

            <CardDescription className="mt-1">
              {description}
            </CardDescription>

            {goalTitle && (
              <div className="mt-2 flex items-center">
                <Target className="size-3 text-primary mr-1" />
                <span className="">{goalTitle}</span>
              </div>
            )}
          </div>

          {onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
              <Edit className="size-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
