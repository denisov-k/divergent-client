import { Suspense, lazy, useEffect } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const AiChatSheet = lazy(() => import("@/components/native/AiChatSheet").then((m) => ({ default: m.AiChatSheet })));
const CreateReportSheet = lazy(() => import("@/components/native/CreateReportSheet").then((m) => ({ default: m.CreateReportSheet })));
const GoalFormSheet = lazy(() => import("@/components/native/GoalFormSheet").then((m) => ({ default: m.GoalFormSheet })));

import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { NativeGoalCard } from "@/components/native/NativeGoalCard";
import { Plus, Sparkles } from "@/components/native/icons";
import { useAppStore } from "@/stores/useAppStore";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";
import { appPalette } from "@/theme/palette";

function SheetFallback() {
  return null;
}

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
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          backgroundColor: appPalette.surface.background,
        }}
      >
        <Text
          style={{
            fontSize: 19,
            fontWeight: "500",
            color: appPalette.semantic.textStrong,
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
              backgroundColor: appPalette.semantic.infoSurface,
              borderWidth: 1,
              borderColor: appPalette.semantic.infoBorder,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Plus size={16} color={appPalette.semantic.infoText} />
            <Text style={{ color: appPalette.semantic.infoText, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
              {t("goals.create_goal")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setAiOpen(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: appPalette.brand.ai,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Sparkles size={16} color={appPalette.brand.primaryForeground} />
            <Text style={{ color: appPalette.brand.primaryForeground, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
              {t("goals.open_ai")}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
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

      <Suspense fallback={<SheetFallback />}>
        {createReportDialogOpen && (
          <CreateReportSheet open={createReportDialogOpen} onOpenChange={setCreateReportDialogOpen} onSubmit={saveReport} />
        )}
        {goalDialogOpen && (
          <GoalFormSheet open={goalDialogOpen} goal={editingGoal} categories={categories} rewards={rewards} onOpenChange={setGoalDialogOpen} onSave={saveGoal} onDelete={removeGoal} />
        )}
        {aiOpen && (
          <AiChatSheet
            open={aiOpen}
            onOpenChange={setAiOpen}
            onDraftAdded={(goal) => {
              Alert.alert("Черновик добавлен", `Цель \"${goal.title}\" появилась в списке.`);
            }}
          />
        )}
      </Suspense>
    </View>
  );
}
