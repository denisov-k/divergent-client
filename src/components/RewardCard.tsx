import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Edit, Swords, Target } from "lucide-react";

import { RewardIcon } from "@/components/RewardIcon.tsx";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { useAppStore } from "@/stores/useAppStore.ts";
import type { Goal, RewardIcon as RewardIconType } from "@/types";

interface RewardCardProps {
  id: string;
  title: string;
  description: string;
  xpRequires?: number;
  isUnlocked: boolean;
  icon?: RewardIconType;
  goal?: Goal;
  goalTitle?: string;
  onEdit?: (id: string) => void;
  focused: boolean;
}

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isFromChallenge = Boolean(goal?.challengeId);

  const [highlight, setHighlight] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { challenges } = useAppStore();
  const challenge = challenges.find((item) => item.id === goal?.challengeId);

  const canEdit = onEdit && !isFromChallenge;

  useEffect(() => {
    if (!cardRef.current || !focused) return;

    cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlight(true);

    const timeout = setTimeout(() => setHighlight(false), 2000);
    return () => clearTimeout(timeout);
  }, [focused]);

  return (
    <Card
      ref={cardRef}
      className={`transition-all mb-2 break-inside-avoid ${isUnlocked ? "bg-green-50/40" : ""} ${highlight ? "bg-blue-50" : "bg-white"}`}
    >
      <CardContent className="px-6 pt-6 [&:last-child]:pb-6">
        <div className="flex items-center gap-4">
          <div className={`rounded-lg p-3 ${isUnlocked ? "bg-green-500/10" : "bg-muted"}`}>
            <RewardIcon icon={icon} colorClass={isUnlocked ? "text-green-600" : "text-muted-foreground"} />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <CardTitle>{title}</CardTitle>
              {isUnlocked && (
                <Badge variant="default" className="bg-green-500">
                  {t("rewards.unlocked")}
                </Badge>
              )}
            </div>

            <CardDescription>{description}</CardDescription>

            <div className="flex flex-wrap gap-2">
              {goal && goalTitle && (
                <Badge
                  className="cursor-pointer bg-primary text-white hover:bg-primary/80"
                  onClick={() => navigate({ pathname: "/goals", search: `?id=${goal.id}` })}
                  title={t("rewards.go_to_goal")}
                >
                  <Target />
                  <span>{goalTitle}</span>
                </Badge>
              )}

              {isFromChallenge && challenge && (
                <Badge
                  className="mr-1 cursor-pointer bg-orange-500 text-white hover:bg-orange-400"
                  onClick={() => navigate({ pathname: "/challenges", search: `?id=${challenge.id}` })}
                  title={t("rewards.go_to_challenge")}
                >
                  <Swords />
                  {challenge.title}
                </Badge>
              )}

              {!!xpRequires && !isUnlocked && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  {t("ai.xp_required", { xp: xpRequires })}
                </Badge>
              )}
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
