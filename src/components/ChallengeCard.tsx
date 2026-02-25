import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Calendar, Users, Edit, Share, ChevronUp, ChevronDown, DoorOpen, Swords} from "lucide-react"
import {Challenge, Leader} from "@/types"
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
  onAccept?: (id: string) => void;
  onLeave?: (id: string) => void;
  onOpenLink?: (id: string) => void;
  onOpenParticipants?: (id: string) => void;
  onSelect?: (challenge: Challenge) => void;
}

export function ChallengeCard({challenge, onShare, onEdit, onAccept, onLeave, onOpenLink, onOpenParticipants, onSelect}: Props) {
  const {t} = useTranslation();
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const [leaderboard, setLeaderboard] = useState<Leader[]>([]);

  const {user, getLeaderboard} = useAppStore();
  const isCreator = challenge.creatorId === user!.id;

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

  const getGoalStatus = (goal: typeof goals[0]) => {
    return goal.lastCompletedAt ? "COMPLETED" : "NOT_COMPLETED";
  };

  const isParticipant = challenge.participants.some(p => p.userId === user!.id); // предполагаем, что есть флаг

  const allGoalsCompleted = goals.every(goal => getGoalStatus(goal) === "COMPLETED");

  let challengeStatus: "COMPLETED" | "FAILED" | "ACTIVE";

  const now = new Date();
  const challengeStart = challenge.startsAt ? new Date(challenge.startsAt) : null;
  const challengeEnd = challenge.endsAt ? new Date(challenge.endsAt) : null;

// Прибавляем один день к дате старта
  const hasStarted = challengeStart
    ? new Date(challengeStart.getTime() + 24 * 60 * 60 * 1000) <= now
    : false;
  const hasEnded = challengeEnd
    ? new Date(challengeEnd.getTime() + 24 * 60 * 60 * 1000) <= now
    : false;
  if (!isParticipant) {
    // Пользователь не участвует — челлендж просто активен
    challengeStatus = "ACTIVE";
  } else if (allGoalsCompleted) {
    challengeStatus = "COMPLETED";
  } else if (challenge.endsAt && new Date(challenge.endsAt) < now) {
    challengeStatus = "FAILED";
  } else {
    challengeStatus = "ACTIVE";
  }

  const onGoalClick = (e: ReactMouseEvent, id: string) => {
    if (!isParticipant)
      return;

    e.stopPropagation();
    navigate(`/goals?id=${id}`);
  }

  const onLeaderboardClick = async (id: string) => {
    if (isLeaderboardOpen)
      return;
    const leaderboard = await getLeaderboard(id);
    setLeaderboard(leaderboard);
  }


  return (
    <Card className={`
        mb-2 break-inside-avoid
        hover:shadow-md transition-all
        ${(hasEnded || hasStarted) && !isParticipant ? "opacity-60" : ""}
      `}
      onClick={() => {
        onSelect?.(challenge);
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 min-w-0 gap-2 flex-col">
            <div className="flex items-center gap-2">
              <Swords className="size-5 text-primary"></Swords>
              <CardTitle>{challenge.title}</CardTitle>
            </div>
            <div className="flex gap-2">
              {
                (isCreator &&
                  <Badge variant="outline">
                    Организатор
                  </Badge>)
                ||
                (isParticipant &&
                  (<Badge variant="outline">
                      Участвуете
                    </Badge>
                  ))
              }
              {challengeStatus !== "ACTIVE" && (
                <Badge
                  className={
                    challengeStatus === "COMPLETED"
                      ? "bg-green-500"
                      : challengeStatus === "FAILED"
                        ? "bg-red-500"
                        : "bg-accent text-foreground"
                  }
                >
                  {challengeStatus === "COMPLETED"
                    ? "Выполнен"
                    : challengeStatus === "FAILED"
                      ? "Не выполнен"
                      : "В процессе"}
                </Badge>
              )}
            </div>
            {challenge.description && (
              <CardDescription>{challenge.description}</CardDescription>
            )}
          </div>

          <div className="flex items-center gap-2">
            { isParticipant && <ProgressRing progress={progress * 100} size={70} strokeWidth={6}/> }
            <div className="flex flex-col">
              {onEdit && isCreator && (
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
              {!isCreator && onLeave && isParticipant && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => (e.stopPropagation(), onLeave(challenge.id))}
                >
                  <DoorOpen className="size-4"/>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Прогресс */
          isParticipant &&
          <div className="pb-2">
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
        }

        {/* Цели */}
        <Collapsible open={isGoalsOpen} onOpenChange={setIsGoalsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="transparent" className="w-full justify-between"
                    onClick={(e) => e.stopPropagation()}>
              <span>{t("challenges.goals")}</span>
              {isGoalsOpen ? (
                <ChevronUp className="size-4"/>
              ) : (
                <ChevronDown className="size-4"/>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 my-2">
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

        {challenge.rules && (
          <Collapsible open={isRulesOpen} onOpenChange={setIsRulesOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="transparent"
                className="w-full justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Правила</span>
                {isRulesOpen ? (
                  <ChevronUp className="size-4"/>
                ) : (
                  <ChevronDown className="size-4"/>
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="my-2 text-sm text-muted-foreground whitespace-pre-line">
              {challenge.rules}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Топ участников */}
        <Collapsible open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="transparent"
              className="w-full justify-between"
              onClick={(e) => (e.stopPropagation(), onLeaderboardClick(challenge.id))}
            >
              <span>Топ участников</span>
              {isLeaderboardOpen ? (
                <ChevronUp className="size-4"/>
              ) : (
                <ChevronDown className="size-4"/>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="my-2 space-y-2">
            {leaderboard.map((p, index) => (
              <div
                key={p.userId}
                className="flex items-center justify-between rounded border px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">#{index + 1}</Badge>
                  <span>{p.name}</span>
                </div>
                <span className="text-muted-foreground">
                  {p.xp} XP
                </span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>


        <div className="flex justify-between border p-2 text-sm font-medium rounded-md">
          <span>Стоимость участия</span>
          <span>{challenge.price ? challenge.price + ' руб.' : 'Бесплатно'}</span>
        </div>

        <div className="flex justify-center gap-2">
          {
            onOpenLink && challenge.link && isParticipant &&
            <div className="flex justify-center py-2">
              <Button onClick={(e) => (e.stopPropagation(), onOpenLink(challenge.id))}>
                Сообщество
              </Button>
            </div>
          }
          {
            onOpenParticipants && isCreator &&
            <div className="flex justify-center py-2">
              <Button onClick={(e) => (e.stopPropagation(), onOpenParticipants(challenge.id))}>
                Участники
              </Button>
            </div>
          }
          {!isParticipant && onAccept && !hasStarted && !hasEnded && (
            <div className="flex justify-center py-2">
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={(e) => {
                e.stopPropagation(), onAccept(challenge.id);
              }}>
                {t("challenges.accept")}
              </Button>
            </div>
          )}
        </div>

        {/* Нижняя инфа */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t">
          <div className="flex items-center gap-1 text-muted-foreground">
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

          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="size-4"/>
            {challenge.participants.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
