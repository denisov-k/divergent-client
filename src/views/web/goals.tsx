import { lazy, Suspense } from "react";
import { Plus, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const AiGenerateGoalDialog = lazy(() => import("@/components/AiDialog"));
const CreateReportDialog = lazy(() => import("@/components/CreateReportDialog"));
const GoalDialog = lazy(() => import("@/components/GoalDialog").then((m) => ({ default: m.GoalDialog })));
const ReminderDialog = lazy(() => import("@/components/ReminderDialog").then((m) => ({ default: m.ReminderDialog })));

import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildProgressPath, buildRemindersPath } from "@/app/routes";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";
import type { Goal } from "@/types";

function DialogFallback() {
  return null;
}

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
    if (result.status === "completed") toast.success(t("goals.completed_alert", { xp: result.xpReward }));
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
      <div className="flex items-center justify-between py-2">
        <h2>{t("goals.title")}</h2>
        <div className="flex gap-2">
          <Button onClick={openCreateGoal}><Plus size={16} className="mr-2" />{t("goals.create_goal")}</Button>
          <Button className="bg-purple-500 hover:bg-purple-400" onClick={() => setAiOpen(true)}><Sparkles size={16} className="mr-2" />{t("goals.open_ai")}</Button>
        </div>
      </div>

      <div>
        {goals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-muted-foreground">{t("goals.empty_title")}</p>
              <Button onClick={openCreateGoal}><Plus size={16} className="mr-2" />{t("common.create_first_goal")}</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
            {goals.map((goal) => {
              const reward = rewards.find((item) => item.goalId === goal.id) || null;
              return <GoalCard {...goal} key={goal.id} reward={reward} onEdit={openEditGoal} onTaskToggle={handleTaskToggle} onAddReminder={openReminderForGoal} onAddProgress={addProgress} onGoToProgress={navigateToProgress} autoExpand={goal.id === focusId} />;
            })}
          </div>
        )}
      </div>

      <Suspense fallback={<DialogFallback />}>
        {goalDialogOpen && <GoalDialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen} onSave={handleSaveGoal} onDelete={handleDeleteGoal} goal={editingGoal} categories={categories} rewards={rewards} onAddCategory={handleAddCategory} />}
        {reminderDialogOpen && <ReminderDialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen} onSave={handleSaveReminder} reminder={undefined} goals={goals} initialGoalId={selectedGoalIdForReminder} />}
        {createReportDialogOpen && <CreateReportDialog open={createReportDialogOpen} onOpenChange={setCreateReportDialogOpen} onSubmit={handleSaveReport} />}
        {aiOpen && <AiGenerateGoalDialog open={aiOpen} onOpenChange={setAiOpen} onDraftAdded={onDraftAdded} />}
      </Suspense>
    </div>
  );
}
