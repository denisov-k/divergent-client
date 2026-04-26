import { Plus, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import AiGenerateGoalDialog from "@/components/AiDialog";
import CreateReportDialog from "@/components/CreateReportDialog";
import { GoalCard } from "@/components/GoalCard";
import { GoalDialog } from "@/components/GoalDialog";
import { ReminderDialog } from "@/components/ReminderDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildProgressPath, buildRemindersPath } from "@/app/routes";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";
import type { Goal } from "@/types";

export default function GoalsScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("id");

  const {
    goals,
    rewards,
    categories,
    goalDialogOpen,
    editingGoal,
    createReportDialogOpen,
    reminderDialogOpen,
    selectedGoalIdForReminder,
    aiOpen,
    setGoalDialogOpen,
    setCreateReportDialogOpen,
    setReminderDialogOpen,
    setAiOpen,
    openCreateGoal,
    openEditGoal,
    saveGoal,
    removeGoal,
    addProgress,
    navigateToProgress,
    createCategory,
    openReminderForGoal,
    saveReminder,
    saveReport,
    toggleGoalTask,
  } = useGoalsScreen({
    focusId,
    onNavigateToProgress: (goalId) => navigate(buildProgressPath({ goalId })), 
    onReminderCreated: () => navigate(buildRemindersPath()),
  });

  const handleSaveGoal = async (...args: Parameters<typeof saveGoal>) => {
    const result = await saveGoal(...args);
    toast.success(result.status === "updated" ? "Р¦РµР»СЊ РѕР±РЅРѕРІР»РµРЅР°" : "Р¦РµР»СЊ СЃРѕР·РґР°РЅР°");
  };

  const handleSaveReminder = async (...args: Parameters<typeof saveReminder>) => {
    const result = await saveReminder(...args);
    toast.success(
      result.status === "updated"
        ? "РќР°РїРѕРјРёРЅР°РЅРёРµ РѕР±РЅРѕРІР»РµРЅРѕ"
        : "РќР°РїРѕРјРёРЅР°РЅРёРµ СЃРѕР·РґР°РЅРѕ"
    );
  };

  const handleSaveReport = async (...args: Parameters<typeof saveReport>) => {
    const saved = await saveReport(...args);
    if (saved) {
      toast.success("РћС‚С‡С‘С‚ РѕС‚РїСЂР°РІР»РµРЅ, Р·Р°РґР°С‡Р° РІС‹РїРѕР»РЅРµРЅР°");
    }
  };

  const handleTaskToggle = async (goalId: string, taskId: string) => {
    const result = await toggleGoalTask(goalId, taskId);
    if (result.status === "completed") {
      toast.success(`+${result.xpReward} XP`);
    }
  };

  const handleAddCategory = (...args: Parameters<typeof createCategory>) => {
    const category = createCategory(...args);
    toast.success(`РљР°С‚РµРіРѕСЂРёСЏ "${category.label}" СЃРѕР·РґР°РЅР°`);
  };

  const handleDeleteGoal = async (id: string) => {
    await removeGoal(id);
  };

  const onDraftAdded = (goal: Goal) => {
    console.log(goal);
  };

  return (
    <div className="flex flex-1 flex-col px-2">
      <div className="flex items-center justify-between py-2">
        <h2>{t("goals.title")}</h2>
        <div className="flex gap-2">
          <Button onClick={openCreateGoal}>
            <Plus size={16} className="mr-2" />
            {t("goals.create_goal")}
          </Button>
          <Button className="bg-purple-500 hover:bg-purple-400" onClick={() => setAiOpen(true)}>
            <Sparkles size={16} className="mr-2" />
            {t("goals.open_ai")}
          </Button>
        </div>
      </div>

      <div>
        {goals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-muted-foreground">РЈ РІР°СЃ РїРѕРєР° РЅРµС‚ С†РµР»РµР№</p>
              <Button onClick={openCreateGoal}>
                <Plus size={16} className="mr-2" />
                РЎРѕР·РґР°С‚СЊ РїРµСЂРІСѓСЋ С†РµР»СЊ
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
            {goals.map((goal) => {
              const reward = rewards.find((item) => item.goalId === goal.id) || null;
              return (
                <GoalCard
                  {...goal}
                  key={goal.id}
                  reward={reward}
                  onEdit={openEditGoal}
                  onTaskToggle={handleTaskToggle}
                  onAddReminder={openReminderForGoal}
                  onAddProgress={addProgress}
                  onGoToProgress={navigateToProgress}
                  autoExpand={goal.id === focusId}
                />
              );
            })}
          </div>
        )}
      </div>

      <GoalDialog
        open={goalDialogOpen}
        onOpenChange={setGoalDialogOpen}
        onSave={handleSaveGoal}
        onDelete={handleDeleteGoal}
        goal={editingGoal}
        categories={categories}
        rewards={rewards}
        onAddCategory={handleAddCategory}
      />
      <ReminderDialog
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        onSave={handleSaveReminder}
        reminder={undefined}
        goals={goals}
        initialGoalId={selectedGoalIdForReminder}
      />
      <CreateReportDialog
        open={createReportDialogOpen}
        onOpenChange={setCreateReportDialogOpen}
        onSubmit={handleSaveReport}
      />
      <AiGenerateGoalDialog open={aiOpen} onOpenChange={setAiOpen} onDraftAdded={onDraftAdded} />
    </div>
  );
}

