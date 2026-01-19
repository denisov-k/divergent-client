import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {Calendar, Users, Share2, ChevronUp, ChevronDown} from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";
import { format } from "date-fns";
import { Challenge } from "@/types";
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
  const {user} = useAppStore();

  const totalGoals = challenge.goals.length;
  const completedGoals = challenge.goals.filter(g => g.lastCompletedAt).length;
  const progress = totalGoals === 0 ? 0 : completedGoals / totalGoals;

  const leaderboard: NonNullable<Challenge["leaderboard"]> =
    challenge.leaderboard ?? [];

  // Если пользователь уже участник, кнопку "Принять" скрываем
  const isParticipant = challenge.participants.some(p => p.userId === user!.id); // предполагаем, что есть флаг

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-6 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{challenge.title}</DialogTitle>
        </DialogHeader>

        {challenge.description && (
          <p className="text-sm text-muted-foreground mt-2">{challenge.description}</p>
        )}

        <div className="flex items-center gap-6 mt-4">
          <ProgressRing progress={progress} size={70} strokeWidth={7}/>

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
              <span>{t("challenges.participants")} {challenge.participants.length}</span>
            </div>

            <Badge variant={challenge.isPublic ? "secondary" : "outline"} className="mt-1">
              {challenge.isPublic ? t("challenges.visibility.public") : t("challenges.visibility.private")}
            </Badge>
          </div>
        </div>

        {totalGoals > 0 && (
          <Collapsible open={showGoals} onOpenChange={setShowGoals} className="mt-4">
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
                    {goal.lastCompletedAt ? t("challenges.completed") : t("challenges.pending")}
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

        {leaderboard.length &&
          <Collapsible open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Топ участников</span>
                {isLeaderboardOpen ? (
                  <ChevronUp className="size-4"/>
                ) : (
                  <ChevronDown className="size-4"/>
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2 space-y-2">
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
                    {p.completedGoals} целей
                  </span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          || null}

        <div className="flex justify-between border p-2 text-sm font-medium rounded-md">
          <span>Стоимость участия</span>
          <span>{challenge.price ? challenge.price + ' руб.' : 'Бесплатно'}</span>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>

          <Button variant="outline" onClick={() => onShare(challenge.id)}>
            <Share2 size={16} className="mr-1"/> {t("common.share")}
          </Button>

          {!isParticipant && (
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
