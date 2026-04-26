import { useEffect } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { CreateReportSheet } from "@/components/native/CreateReportSheet";
import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { GoalFormSheet } from "@/components/native/GoalFormSheet";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";

export default function NativeGoalsScreen(props: {
  goalId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const {
    goals,
    rewards,
    categories,
    goalDialogOpen,
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
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScreenHeader title="Цели" actionLabel="Новая цель" onAction={openCreateGoal} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {goals.length === 0 ? (
          <EmptyStateCard
            title="Пока нет целей"
            description="Создайте первую цель, чтобы начать перенос mobile flow на общий screen-layer."
            actionLabel="Создать цель"
            onAction={openCreateGoal}
          />
        ) : (
          goals.map((goal) => {
            const reward = rewards.find((item) => item.goalId === goal.id);

            return (
              <SurfaceCard key={goal.id}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>
                      {goal.title}
                    </Text>
                    {!!goal.description && (
                      <Text style={{ marginTop: 4, color: "#64748b" }}>{goal.description}</Text>
                    )}
                    {reward && (
                      <Text style={{ marginTop: 8, color: "#0f766e", fontWeight: "600" }}>
                        Награда: {reward.title}
                      </Text>
                    )}
                  </View>

                  <Pressable onPress={() => openEditGoal(goal.id)}>
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>Изменить</Text>
                  </Pressable>
                </View>

                {goal.goalType === "PROGRESS" && (
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <ActionChip onPress={() => addProgress(goal.id, -1)}>-1</ActionChip>
                    <ActionChip onPress={() => addProgress(goal.id, 1)} tone="primary">
                      +1
                    </ActionChip>
                    <Text style={{ color: "#475569", alignSelf: "center" }}>
                      {goal.currentValue ?? 0} / {goal.targetValue ?? "—"}
                    </Text>
                  </View>
                )}

                <View style={{ gap: 8 }}>
                  {goal.tasks?.map((task) => (
                    <Pressable
                      key={task.id}
                      onPress={() => void handleTaskToggle(goal.id, task.id)}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f8fafc",
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: "#0f172a", flex: 1 }}>{task.title}</Text>
                      <Text style={{ color: "#64748b" }}>{task.lastCompletedAt ? "Готово" : "Открыто"}</Text>
                    </Pressable>
                  ))}
                </View>

                <ActionChip onPress={() => openReminderForGoal(goal.id)}>Добавить напоминание</ActionChip>
              </SurfaceCard>
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
    </View>
  );
}
