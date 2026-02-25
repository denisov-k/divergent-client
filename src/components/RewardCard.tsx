import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {Trophy, Star, Gift, Crown, Award, Zap, Edit, Target, Swords} from "lucide-react";
import {Goal} from "@/types";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "@/stores/useAppStore.ts";
import {useEffect, useRef, useState} from "react";

type RewardIcon = "trophy" | "star" | "gift" | "crown" | "award" | "zap";

interface RewardCardProps {
  id: string;
  title: string;
  description: string;
  xpRequires?: number;
  isUnlocked: boolean;
  icon?: RewardIcon;
  goal?: Goal;
  goalTitle?: string;          // <-- Новое
  onEdit?: (id: string) => void;
  focused: boolean;
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
                             isUnlocked,
                             title,
                             description,
                             xpRequires,
                             icon = "trophy",
                             goal,
                             goalTitle,
                             onEdit,
                             focused,
                           }: RewardCardProps) {
  const Icon = iconMap[icon];

  const navigate = useNavigate();
  const isFromChallenge = Boolean(goal?.challengeId);

  const [highlight, setHighlight] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { challenges } = useAppStore();
  const challenge = challenges.find(challenge => challenge.id === goal?.challengeId);

  const canEdit = onEdit && !isFromChallenge;

  useEffect(() => {
    if (!cardRef.current) return;
    if (!focused) return;

    cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlight(true);

    const timeout = setTimeout(() => setHighlight(false), 2000); // подсветка 2 сек
    return () => clearTimeout(timeout);
  }, [id]);

  return (
    <Card
      ref={cardRef}
      className={`
        transition-all mb-2 break-inside-avoid
        ${isUnlocked ? "bg-green-50/40" : ""}
        ${highlight ? "ring-2 ring-primary ring-offset-2" : ""}
      `}
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

          <div className="flex flex-col flex-1 min-w-0 gap-2">
            <div className="flex items-center gap-2">
              <CardTitle>{title}</CardTitle>
              {isUnlocked && (
                <Badge variant="default" className="bg-green-600">
                  Получено
                </Badge>
              )}
            </div>

            <CardDescription>
              {description}
            </CardDescription>

            <div className="gap-2 flex">
              {goal && goalTitle && (
                <Badge
                  className="cursor-pointer bg-primary text-white hover:bg-primary/80"
                  onClick={() => navigate({
                    pathname: "/goals",
                    search: `?id=${goal.id}`,
                  })}
                  title="Перейти к цели"
                >
                  <Target />
                  <span className="">{goalTitle}</span>
                </Badge>
              )}

              {isFromChallenge && challenge && (
                <Badge
                  className="mr-1 cursor-pointer bg-orange-400 hover:bg-orange-300 text-white"
                  onClick={() => navigate({
                    pathname: "/challenges",
                    search: `?id=${challenge.id}`,
                  })}
                  title="Перейти к челленджу"
                >
                  <Swords></Swords>
                  {challenge.title}
                </Badge>
              )}

              {xpRequires && !isUnlocked && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-700"
                >

                  Требуется {xpRequires} XP
                </Badge>
              ) || null}
            </div>
          </div>

          {onEdit && canEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
              <Edit className="size-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
