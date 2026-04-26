import { Trophy, Star, Gift, Crown, Award, Zap } from "lucide-react";
import type { RewardIconType } from "@/shared/domain";

export type { RewardIconType } from "@/shared/domain";

interface RewardIconProps {
  icon?: RewardIconType;
  className?: string; // дополнительные стили
  size?: number; // размер иконки
  colorClass?: string; // дополнительный класс цвета
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  gift: Gift,
  crown: Crown,
  award: Award,
  zap: Zap,
} as const;

export function RewardIcon({
                             icon = "trophy",
                             className = "",
                             size = 6,
                             colorClass = "text-muted-foreground",
                           }: RewardIconProps) {
  const Icon = iconMap[icon] || Trophy;
  return (
    <div className={`p-2 rounded-lg ${className}`}>
      <Icon className={`size-${size} ${colorClass}`} />
    </div>
  );
}
