import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Trophy, Star, Gift, Crown, Award, Zap, Edit } from "lucide-react";

type RewardIcon = "trophy" | "star" | "gift" | "crown" | "award" | "zap";

interface RewardCardProps {
  id: string;
  title: string;
  description: string;
  requiredXp: number;
  currentXp: number;
  icon?: RewardIcon;
  isUnlocked?: boolean;
  onClaim?: () => void;
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
  requiredXp,
  currentXp,
  icon = "trophy",
  isUnlocked = false,
  onClaim,
  onEdit,
}: RewardCardProps) {
  const Icon = iconMap[icon];
  const canClaim = currentXp >= requiredXp;
  const progress = Math.min((currentXp / requiredXp) * 100, 100);

  return (
    <Card className={`transition-all ${
      isUnlocked 
        ? "border-green-500 bg-green-500/5" 
        : canClaim 
        ? "border-primary shadow-md" 
        : ""
    }`}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${
            isUnlocked 
              ? "bg-green-500/10" 
              : canClaim 
              ? "bg-primary/10" 
              : "bg-muted"
          }`}>
            <Icon className={`size-6 ${
              isUnlocked 
                ? "text-green-600" 
                : canClaim 
                ? "text-primary" 
                : "text-muted-foreground"
            }`} />
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
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(id)}
            >
              <Edit className="size-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isUnlocked && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Требуется:</span>
              <Badge variant="outline">
                {currentXp} / {requiredXp} XP
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            {canClaim && (
              <Button 
                onClick={onClaim} 
                className="w-full"
              >
                <Gift className="size-4 mr-2" />
                Получить награду
              </Button>
            )}
          </>
        )}
        {isUnlocked && (
          <div className="flex items-center justify-center py-2 text-green-600">
            <Trophy className="size-4 mr-2" />
            <span>Награда получена!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}