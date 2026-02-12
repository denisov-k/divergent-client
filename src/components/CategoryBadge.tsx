import { Badge } from "./ui/badge";
import { 
  Briefcase, 
  Heart, 
  GraduationCap, 
  Dumbbell, 
  Palette,
  Home,
  Rocket,
  type LucideIcon
} from "lucide-react";

import { type CategoryType } from "@/components/GoalCard.tsx";

interface CategoryBadgeProps {
  category: CategoryType;
  label: string;
}

const categoryConfig: Record<CategoryType, { icon: LucideIcon; color: string }> = {
  work: { icon: Briefcase, color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  health: { icon: Heart, color: "bg-red-500/10 text-red-700 border-red-200" },
  learning: { icon: GraduationCap, color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  fitness: { icon: Dumbbell, color: "bg-green-500/10 text-green-700 border-green-200" },
  creative: { icon: Palette, color: "bg-pink-500/10 text-pink-700 border-pink-200" },
  personal: { icon: Home, color: "bg-orange-500/10 text-orange-700 border-orange-200" },
  custom: { icon: Rocket, color: "bg-yellow-500/10 text-yellow-700 border-yellow-200" },
};

export function CategoryBadge({ category, label }: CategoryBadgeProps) {
  const config = categoryConfig[category] || categoryConfig['custom'];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`flex gap-1.5 ${config.color}`}>
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}
