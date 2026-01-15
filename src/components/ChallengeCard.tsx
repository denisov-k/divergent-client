import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Calendar, Users, Edit, Share, ChevronUp, ChevronDown} from "lucide-react"
import {Challenge} from "@/types"
import {format} from "date-fns"
import {ProgressRing} from "@/components/ProgressRing.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Progress} from "@/components/ui/progress";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "@/stores/useAppStore.ts";
import { MouseEvent as ReactMouseEvent } from "react";

interface Props {
  challenge: Challenge;
  onEdit?: (id: string) => void;
  onShare?: (id: string) => void;
  onSelect?: (challenge: Challenge) => void; // новый проп
}

export function ChallengeCard({challenge, onShare, onEdit, onSelect}: Props) {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const {user} = useAppStore();

  const navigate = useNavigate();

  const goals = challenge.goals;

  const completedGoals = goals.filter((goal) => {
    if (goal.goalType === "TASK") {
      return !!goal.lastCompletedAt;
    }

    if (
      goal.goalType === "PROGRESS" &&
      goal.targetValue &&
      goal.targetValue > 0
    ) {
      return (goal.currentValue ?? 0) >= goal.targetValue;
    }

    return false;
  }).length;

  const progress =
    goals.length === 0
      ? 0
      : goals.reduce((sum, goal) => {
      if (goal.goalType === "TASK") {
        return sum + (goal.lastCompletedAt ? 1 : 0);
      }

      if (
        goal.goalType === "PROGRESS" &&
        goal.targetValue &&
        goal.targetValue > 0
      ) {
        const value = Math.min(goal.currentValue ?? 0, goal.targetValue);
        return sum + value / goal.targetValue;
      }

      return sum;
    }, 0) / goals.length;

  const onGoalClick = (e: ReactMouseEvent, id: string) => {
    if (challenge.participants.some(p => p.userId === user?.id))
      return;

    e.stopPropagation();
    navigate(`/goals?focus=${id}`);
  }

  return (
    <Card className="hover:shadow-md transition-shadow"
          onClick={() => {
            onSelect?.(challenge);
          }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            {(challenge.creatorId === user!.id && <Badge variant="default" className="mr-1">
                Организатор
              </Badge>) ||

              (challenge.participants.some(p => p.userId === user?.id) &&
                <Badge variant="default" className="mr-1">
                  Участвуете
                </Badge>)
            }
            {/*<Badge variant={challenge.isPublic ? "secondary" : "outline"}>
              {challenge.isPublic ? "Публичный" : "Приватный"}
            </Badge>*/}
            <CardTitle>{challenge.title}</CardTitle>
            {challenge.description && (
              <CardDescription>{challenge.description}</CardDescription>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ProgressRing progress={progress} size={70} strokeWidth={6}/>
            <div className="flex flex-col">
              {onEdit && (challenge.creatorId === user!.id) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => (e.stopPropagation(), onEdit(challenge.id))}
                >
                  <Edit className="size-4"/>
                </Button>
              )}
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => (e.stopPropagation(), onShare(challenge.id))}
                >
                  <Share className="size-4"/>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Прогресс */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">
              {t("goals.progress")}
            </span>
            <span className="text-muted-foreground">
              {completedGoals} / {goals.length} {t("challenges.goals_count")}
            </span>
          </div>
          <Progress value={progress * 100} className="h-2"/>
        </div>

        {/* Цели */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between"
                    onClick={(e) => e.stopPropagation()}>
              <span>{t("challenges.goals")}</span>
              {isOpen ? (
                <ChevronUp className="size-4"/>
              ) : (
                <ChevronDown className="size-4"/>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between rounded border px-3 py-2 cursor-pointer hover:bg-blue-50"
                onClick={(e) => onGoalClick(e, goal.id)}
              >
                <span className="truncate">{goal.title}</span>
                {goal.lastCompletedAt && (
                  <Badge variant="secondary">✓</Badge>
                )}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Нижняя инфа */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4"/>
            <span>
              {challenge.startsAt
                ? format(new Date(challenge.startsAt), "dd.MM.yyyy")
                : "—"}
              {" → "}
              {challenge.endsAt
                ? format(new Date(challenge.endsAt), "dd.MM.yyyy")
                : "—"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="size-4"/>
              {challenge.participants.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
