import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { GoalsScreenDialogs } from "@/components/native/goals-screen/Dialogs";
import { GoalsScreenContent, GoalsScreenHeader } from "@/components/native/goals-screen/Sections";
import { useGoalsScreenController } from "@/components/native/goals-screen/useGoalsScreenController";
import { appPalette } from "@/theme/palette";

export default function NativeGoalsScreen(props: {
  goalId?: string | null;
  reportTaskId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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
    createCategory,
    createReportDialogOpen,
    saveReport,
    setGoalDialogOpen,
    setCreateReportDialogOpen,
    setAiOpen,
    userTimeZone,
    handleTaskToggle,
    handleDraftAdded,
  } = useGoalsScreenController(props);

  const categoriesWithGoals = useMemo(
    () => categories.filter((category) => goals.some((goal) => goal.category === category.value)),
    [categories, goals],
  );

  useEffect(() => {
    if (selectedCategory !== "all" && !categoriesWithGoals.some((category) => category.value === selectedCategory)) {
      setSelectedCategory("all");
    }
  }, [categoriesWithGoals, selectedCategory]);

  const filteredGoals = useMemo(() => {
    if (selectedCategory === "all") {
      return goals;
    }

    return goals.filter((goal) => goal.category === selectedCategory);
  }, [goals, selectedCategory]);

  const selectedCategoryLabel =
    selectedCategory === "all"
      ? t("goals.all_categories")
      : categoriesWithGoals.find((category) => category.value === selectedCategory)?.label ?? selectedCategory;

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <GoalsScreenHeader
        categories={categoriesWithGoals}
        showCategories={goals.length > 0}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onCreate={openCreateGoal}
        onOpenAi={() => setAiOpen(true)}
      />

      <GoalsScreenContent
        loading={loading}
        goals={filteredGoals}
        rewards={rewards}
        categories={categoriesWithGoals}
        hasGoals={goals.length > 0}
        selectedCategoryLabel={selectedCategoryLabel}
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
        onAddCategory={createCategory}
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
