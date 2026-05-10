import { View } from "react-native";

import { GoalsScreenDialogs } from "@/components/native/goals-screen/Dialogs";
import { GoalsScreenContent, GoalsScreenHeader } from "@/components/native/goals-screen/Sections";
import { useGoalsScreenController } from "@/components/native/goals-screen/useGoalsScreenController";
import { appPalette } from "@/theme/palette";

export default function NativeGoalsScreen(props: {
  goalId?: string | null;
  reportTaskId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const {
    loading,
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
    userTimeZone,
    handleTaskToggle,
    handleDraftAdded,
  } = useGoalsScreenController(props);

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <GoalsScreenHeader onCreate={openCreateGoal} onOpenAi={() => setAiOpen(true)} />

      <GoalsScreenContent
        loading={loading}
        goals={goals}
        rewards={rewards}
        categories={categories}
        userTimeZone={userTimeZone}
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
        onDraftAdded={(goal) => handleDraftAdded(goal.title)}
      />
    </View>
  );
}
