import { useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { AiChatSheet } from "@/components/native/AiChatSheet";
import { CreateReportSheet } from "@/components/native/CreateReportSheet";
import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { GoalFormSheet } from "@/components/native/GoalFormSheet";
import { NativeGoalCard } from "@/components/native/NativeGoalCard";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useAppStore } from "@/stores/useAppStore";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";

export default function NativeGoalsScreen(props: {
  goalId?: string | null;
  onConsumeLinkState?: () => void;
}) {
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
    saveGoal,
    removeGoal,
    createReportDialogOpen,
    saveReport,
    setGoalDialogOpen,
    setCreateReportDialogOpen,
    setAiOpen,
    toggleGoalTask,
  } = useGoalsScreen({
    focusId: props.goalId,
  });

  useEffect(() => {
    if (!props.goalId) {
      return;
    }

    openEditGoal(props.goalId);
    props.onConsumeLinkState?.();
  }, [props.goalId, props.onConsumeLinkState, openEditGoal]);

  const handleTaskToggle = async (goalId: string, taskId: string) => {
    const result = await toggleGoalTask(goalId, taskId);

    if (result.status === "completed") {
      Alert.alert("Готово", `+${result.xpReward} XP`);
      return;
    }

    if (result.status === "report_required") {
      Alert.alert("Нужен отчёт", "Для этой задачи сначала нужно прикрепить отчёт.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScreenHeader
        title="Цели"
        actionLabel="Новая цель"
        onAction={openCreateGoal}
        paddingHorizontal={8}
        paddingVertical={8}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingTop: 8,
          paddingBottom: 16,
          gap: 8,
        }}
      >
        <SurfaceCard>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a", fontFamily: "Montserrat" }}>AI-помощник</Text>
            <Text style={{ color: "#64748b", fontFamily: "Montserrat" }}>
              Тот же сценарий генерации целей через AI, что и в вебе, теперь доступен и в mobile-клиенте.
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <ActionChip onPress={() => setAiOpen(true)} tone="secondary">
                Открыть AI
              </ActionChip>
            </View>
          </View>
        </SurfaceCard>

        {goals.length === 0 ? (
          <EmptyStateCard
            title="Пока нет целей"
            description="Создайте первую цель, чтобы начать перенос mobile flow на общий screen-layer."
            actionLabel="Создать цель"
            onAction={openCreateGoal}
          />
        ) : (
          goals.map((goal) => {
            const reward = rewards.find((item) => item.goalId === goal.id) || null;
            const categoryLabel = categories.find((item) => item.value === goal.category)?.label ?? goal.category;

            return (
              <NativeGoalCard
                key={goal.id}
                goal={goal}
                categoryLabel={categoryLabel}
                reward={reward}
                userTimeZone={user?.timeZone ?? "UTC"}
                autoExpand={goal.id === props.goalId}
                onEdit={openEditGoal}
                onTaskToggle={handleTaskToggle}
                onAddReminder={openReminderForGoal}
                onAddProgress={addProgress}
              />
            );
          })
        )}
      </ScrollView>

      <CreateReportSheet
        open={createReportDialogOpen}
        onOpenChange={setCreateReportDialogOpen}
        onSubmit={saveReport}
      />

      <GoalFormSheet
        open={goalDialogOpen}
        goal={editingGoal}
        categories={categories}
        rewards={rewards}
        onOpenChange={setGoalDialogOpen}
        onSave={saveGoal}
        onDelete={removeGoal}
      />

      <AiChatSheet
        open={aiOpen}
        onOpenChange={setAiOpen}
        onDraftAdded={(goal) => {
          Alert.alert("Черновик добавлен", `Цель \"${goal.title}\" появилась в списке.`);
        }}
      />
    </View>
  );
}
