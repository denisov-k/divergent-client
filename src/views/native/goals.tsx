import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";

import { GoalsScreenDialogs } from "@/components/native/goals-screen/Dialogs";
import {
  showDraftAddedAlert,
  showGoalTaskToggleResultAlert,
} from "@/components/native/goals-screen/alerts";
import { GoalsScreenContent, GoalsScreenHeader } from "@/components/native/goals-screen/Sections";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";
import { appPalette } from "@/theme/palette";
import { View } from "react-native";

export default function NativeGoalsScreen(props: {
  goalId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAppStore();
  const {
    goals,
    rewards,
    categories,
    goalDialogOpen,
    aiOpen,
    editingGoal,
    openCreateGoal,
    openEditGoal,
    openReminderForGoal,
    addProgress,
    navigateToProgress,
    saveGoal,
    removeGoal,
    createReportDialogOpen,
    saveReport,
    setGoalDialogOpen,
    setCreateReportDialogOpen,
    setAiOpen,
    toggleGoalTask,
  } = useGoalsScreen({ focusId: props.goalId });

  useEffect(() => {
    if (!props.goalId) return;
    openEditGoal(props.goalId);
    props.onConsumeLinkState?.();
  }, [props.goalId, props.onConsumeLinkState, openEditGoal]);

  const handleTaskToggle = async (goalId: string, taskId: string) => {
    const result = await toggleGoalTask(goalId, taskId);
    showGoalTaskToggleResultAlert(result, t);
  };

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <GoalsScreenHeader onCreate={openCreateGoal} onOpenAi={() => setAiOpen(true)} />

      <GoalsScreenContent
        goals={goals}
        rewards={rewards}
        categories={categories}
        userTimeZone={user?.timeZone ?? "UTC"}
        focusedGoalId={props.goalId}
        onCreate={openCreateGoal}
        onEdit={openEditGoal}
        onTaskToggle={handleTaskToggle}
        onAddReminder={openReminderForGoal}
        onAddProgress={addProgress}
        onGoToProgress={navigateToProgress}
      />

      <GoalsScreenDialogs
        createReportDialogOpen={createReportDialogOpen}
        goalDialogOpen={goalDialogOpen}
        aiOpen={aiOpen}
        editingGoal={editingGoal}
        categories={categories}
        rewards={rewards}
        onCreateReportDialogOpenChange={setCreateReportDialogOpen}
        onGoalDialogOpenChange={setGoalDialogOpen}
        onAiOpenChange={setAiOpen}
        onSaveReport={saveReport}
        onSaveGoal={saveGoal}
        onDeleteGoal={removeGoal}
        onDraftAdded={(goal) => showDraftAddedAlert(goal.title, t)}
      />
    </View>
  );
}
