import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {Calendar, Users, Share2, ChevronUp, ChevronDown} from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";
import { format } from "date-fns";
import {Challenge, Leader} from "@/types";
import { useTranslation } from "react-i18next";
import {useAppStore} from "@/stores/useAppStore.ts";

interface ChallengeDialogProps {
  challenge: Challenge;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (id: string) => void;
  onShare: (id: string) => void;
}

export function AcceptChallengeDialog({ challenge, isOpen, onOpenChange, onAccept, onShare }: ChallengeDialogProps) {
  const [showGoals, setShowGoals] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const { t } = useTranslation();
  const {user, getLeaderboard} = useAppStore();

  const totalGoals = challenge.goals.length;
  const completedGoals = challenge.goals.filter(g => g.lastCompletedAt).length;
  const progress = totalGoals === 0 ? 0 : completedGoals / totalGoals;

  const [leaderboard, setLeaderboard] = useState<Leader[]>([]);

  const goals = challenge.goals;

  // Если пользователь уже участник, кнопку "Принять" скрываем
  const isParticipant = challenge.participants.some(p => p.userId === user!.id); // предполагаем, что есть флаг

  const getGoalStatus = (goal: typeof goals[0]) => {
    return goal.lastCompletedAt ? "COMPLETED" : "NOT_COMPLETED";
  };

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

  const onLeaderboardClick = async (id: string) => {
    if (isLeaderboardOpen)
      return;
    const leaderboard = await getLeaderboard(id);
    setLeaderboard(leaderboard);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-6 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{challenge.title}</DialogTitle>
        </DialogHeader>

        {challenge.description && (
          <p className="text-sm text-muted-foreground mt-2 whitespace-break-spaces">{challenge.description}</p>
        )}

        <div className="flex items-center gap-6 mt-4">
          <ProgressRing progress={progress * 100} size={70} strokeWidth={7}/>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16}/>
              <span>
          {challenge.startsAt ? format(new Date(challenge.startsAt), "dd.MM.yyyy") : "—"} →{" "}
                {challenge.endsAt ? format(new Date(challenge.endsAt), "dd.MM.yyyy") : "—"}
        </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16}/>
              <span>{t("challenges.participants_count")} {challenge.participants.length}</span>
            </div>

            <Badge variant={challenge.isPublic ? "secondary" : "outline"} className="mt-1">
              {challenge.isPublic ? t("challenges.visibility.public") : t("challenges.visibility.private")}
            </Badge>
            {challengeStatus !== "ACTIVE" && (
              <Badge
                className={
                  challengeStatus === "COMPLETED"
                    ? "bg-green-600"
                    : challengeStatus === "FAILED"
                      ? "bg-red-400"
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
        </div>

        <div className="flex flex-col gap-2">
          {totalGoals > 0 && (
            <Collapsible open={showGoals} onOpenChange={setShowGoals} className="mt-2">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>{t("challenges.goals")}</span>
                  {showGoals ? (
                    <ChevronUp className="size-4"/>
                  ) : (
                    <ChevronDown className="size-4"/>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 dark:border-gray-700 pt-2">
                {challenge.goals.map(goal => (
                  <div key={goal.id}
                       className="flex items-center justify-between p-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <span className="text-sm">{goal.title}</span>
                    <Badge variant={goal.lastCompletedAt ? "secondary" : "outline"}>
                      {goal.lastCompletedAt ? t("challenges.completed") : ""}
                    </Badge>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {challenge.rules && (
            <Collapsible open={isRulesOpen} onOpenChange={setIsRulesOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
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

              <CollapsibleContent className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                {challenge.rules}
              </CollapsibleContent>
            </Collapsible>
          )}


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
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>

          <Button variant="outline" onClick={() => onShare(challenge.id)}>
            <Share2 size={16} className="mr-1"/> {t("common.share")}
          </Button>

          {!isParticipant && !hasStarted && !hasEnded && (
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
              onAccept(challenge.id);
              onOpenChange(false);
            }}>
              {t("challenges.accept")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
