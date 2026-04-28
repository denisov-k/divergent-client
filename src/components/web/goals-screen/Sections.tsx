import { Plus, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Goal, Reward } from "@/types";

export function GoalsScreenHeader({
  onCreate,
  onOpenAi,
}: {
  onCreate: () => void;
  onOpenAi: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between py-2">
      <h2>{t("goals.title")}</h2>
      <div className="flex gap-2">
        <Button onClick={onCreate}>
          <Plus size={16} className="mr-2" />
          {t("goals.create_goal")}
        </Button>
        <Button className="bg-purple-500 hover:bg-purple-400" onClick={onOpenAi}>
          <Sparkles size={16} className="mr-2" />
          {t("goals.open_ai")}
        </Button>
      </div>
    </div>
  );
}

export function GoalsScreenContent({
  goals,
  rewards,
  focusId,
  onCreate,
  onEdit,
  onTaskToggle,
  onAddReminder,
  onAddProgress,
  onGoToProgress,
}: {
  goals: Goal[];
  rewards: Reward[];
  focusId?: string | null;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onTaskToggle: (goalId: string, taskId: string) => Promise<void>;
  onAddReminder: (id: string) => void;
  onAddProgress: (goalId: string, delta: number) => Promise<void>;
  onGoToProgress: (id: string) => void;
}) {
  const { t } = useTranslation();

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-muted-foreground">{t("goals.empty_title")}</p>
          <Button onClick={onCreate}>
            <Plus size={16} className="mr-2" />
            {t("common.create_first_goal")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
      {goals.map((goal) => {
        const reward = rewards.find((item) => item.goalId === goal.id) || null;

        return (
          <GoalCard
            {...goal}
            key={goal.id}
            reward={reward}
            onEdit={onEdit}
            onTaskToggle={onTaskToggle}
            onAddReminder={onAddReminder}
            onAddProgress={onAddProgress}
            onGoToProgress={onGoToProgress}
            autoExpand={goal.id === focusId}
          />
        );
      })}
    </div>
  );
}
