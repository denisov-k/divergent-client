import { useEffect } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AiChatSheet } from "@/components/native/AiChatSheet";
import { CreateReportSheet } from "@/components/native/CreateReportSheet";
import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { GoalFormSheet } from "@/components/native/GoalFormSheet";
import { NativeGoalCard } from "@/components/native/NativeGoalCard";
import { Plus, Sparkles } from "@/components/native/icons";
import { useAppStore } from "@/stores/useAppStore";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";

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
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          backgroundColor: "#ffffff",
        }}
      >
        <Text
          style={{
            fontSize: 19,
            fontWeight: "500",
            color: "#0f172a",
            fontFamily: "Montserrat",
            lineHeight: 29,
          }}
        >
          {t("goals.title")}
        </Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={openCreateGoal}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#dbeafe",
              borderWidth: 1,
              borderColor: "#93c5fd",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Plus size={16} color="#1d4ed8" />
            <Text style={{ color: "#1d4ed8", fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
              {t("goals.create_goal")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setAiOpen(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#a855f7",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Sparkles size={16} color="#ffffff" />
            <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
              {t("goals.open_ai")}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingTop: 8,
          paddingBottom: 16,
          gap: 8,
        }}
      >
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
                onGoToProgress={navigateToProgress}
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
