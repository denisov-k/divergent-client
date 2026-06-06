import { Plus, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AppLoader } from "@/components/shared/AppLoader";
import { GoalCard } from "@/components/web/goals/GoalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryOption, Goal, Reward } from "@/types";

export function GoalsScreenHeader({
  categories,
  showCategories,
  selectedCategory,
  onCategoryChange,
  onCreate,
  onOpenAi,
}: {
  categories: CategoryOption[];
  showCategories: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onCreate: () => void;
  onOpenAi: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 bg-background px-2 py-2 -mx-2">
      <div className="flex items-center justify-between gap-2">
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

      {showCategories && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className={`rounded-full px-3 ${selectedCategory === "all" ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
            onClick={() => onCategoryChange("all")}
          >
            {t("goals.all_categories")}
          </Button>

          {categories.map((category) => {
            const active = category.value === selectedCategory;

            return (
              <Button
                key={category.value}
                size="sm"
                variant="outline"
                className={`rounded-full px-3 ${active ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                onClick={() => onCategoryChange(category.value)}
              >
                {category.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function GoalsScreenContent({
  loading,
  goals,
  rewards,
  focusId,
  hasGoals,
  selectedCategoryLabel,
  onCreate,
  onEdit,
  onTaskToggle,
  onAddReminder,
  onAddProgress,
  onGoToProgress,
}: {
  loading: boolean;
  goals: Goal[];
  rewards: Reward[];
  focusId?: string | null;
  hasGoals: boolean;
  selectedCategoryLabel: string;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onTaskToggle: (goalId: string, taskId: string) => Promise<void>;
  onAddReminder: (id: string) => void;
  onAddProgress: (goalId: string, delta: number) => Promise<void>;
  onGoToProgress: (id: string) => void;
}) {
  const { t } = useTranslation();
  const showInitialLoading = loading && goals.length === 0;

  if (showInitialLoading) {
    return <AppLoader fullScreen />;
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-center text-muted-foreground">
            {hasGoals ? t("goals.empty_filtered_title", { category: selectedCategoryLabel }) : t("goals.empty_title")}
          </p>
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
