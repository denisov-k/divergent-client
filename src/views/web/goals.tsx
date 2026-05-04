import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { buildProgressPath, buildRemindersPath } from "@/app/routes";
import { GoalsScreenDialogs } from "@/components/web/goals-screen/Dialogs";
import {
  GoalsScreenContent,
  GoalsScreenHeader,
} from "@/components/web/goals-screen/Sections";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";
import type { Goal } from "@/types";

export default function GoalsScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("id");

  const {
    loading,
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
    onNavigateToProgress: (goalId) => navigate(buildProgressPath({ goalId })),
    onReminderCreated: () => navigate(buildRemindersPath()),
  });

  const handleSaveGoal = async (...args: Parameters<typeof saveGoal>) => {
    const result = await saveGoal(...args);
    toast.success(result.status === "updated" ? t("goals.updated") : t("goals.created"));
  };

  const handleSaveReminder = async (...args: Parameters<typeof saveReminder>) => {
    const result = await saveReminder(...args);
    toast.success(result.status === "updated" ? t("reminders.updated") : t("reminders.created"));
  };

  const handleSaveReport = async (...args: Parameters<typeof saveReport>) => {
    const saved = await saveReport(...args);
    if (saved) toast.success(t("goals.report_saved"));
  };

  const handleTaskToggle = async (goalId: string, taskId: string) => {
    const result = await toggleGoalTask(goalId, taskId);
    if (result.status === "completed") {
      toast.success(t("goals.completed_alert", { xp: result.xpReward }));
    }
  };

  const handleAddCategory = (...args: Parameters<typeof createCategory>) => {
    const category = createCategory(...args);
    toast.success(t("goals.category_created", { title: category.label }));
  };

  const handleDeleteGoal = async (id: string) => {
    await removeGoal(id);
  };

  const onDraftAdded = (_goal: Goal) => {
    // no-op on web for now
  };

  return (
    <div className="flex flex-1 flex-col px-2">
      <GoalsScreenHeader onCreate={openCreateGoal} onOpenAi={() => setAiOpen(true)} />

      <GoalsScreenContent
        loading={loading}
        goals={goals}
        rewards={rewards}
        focusId={focusId}
        onCreate={openCreateGoal}
        onEdit={openEditGoal}
        onTaskToggle={handleTaskToggle}
        onAddReminder={openReminderForGoal}
        onAddProgress={addProgress}
        onGoToProgress={navigateToProgress}
      />

      <GoalsScreenDialogs
        goalDialogOpen={goalDialogOpen}
        editingGoal={editingGoal}
        categories={categories}
        rewards={rewards}
        reminderDialogOpen={reminderDialogOpen}
        selectedGoalIdForReminder={selectedGoalIdForReminder}
        goals={goals}
        createReportDialogOpen={createReportDialogOpen}
        aiOpen={aiOpen}
        onGoalDialogOpenChange={setGoalDialogOpen}
        onReminderDialogOpenChange={setReminderDialogOpen}
        onCreateReportDialogOpenChange={setCreateReportDialogOpen}
        onAiOpenChange={setAiOpen}
        onSaveGoal={handleSaveGoal}
        onDeleteGoal={handleDeleteGoal}
        onAddCategory={handleAddCategory}
        onSaveReminder={handleSaveReminder}
        onSaveReport={handleSaveReport}
        onDraftAdded={onDraftAdded}
      />
    </div>
  );
}




