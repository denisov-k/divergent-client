import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenHeader } from "@/components/native/ScreenHeader";
import { StatTile } from "@/components/native/StatTile";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useProgressScreen } from "@/shared/screens/progress/useProgressScreen";

export default function NativeProgressScreen(props: {
  goalId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { t } = useTranslation();
  const [goalId, setGoalId] = useState<string | null>(props.goalId || null);
  const {
    user,
    goals,
    rewards,
    selectedGoal,
    filteredGoals,
    xp,
    activity,
    loadingActivity,
    completedGoals,
    categoryData,
    weeklyXpData,
    streakDays,
  } = useProgressScreen(goalId);

  useEffect(() => {
    if (props.goalId === undefined) {
      return;
    }

    setGoalId(props.goalId || null);
    props.onConsumeLinkState?.();
  }, [props.goalId, props.onConsumeLinkState]);

  const totalTasks = filteredGoals.reduce((sum, goal) => sum + (goal.tasks?.length ?? 0), 0);
  const completedTasks = filteredGoals.reduce(
    (sum, goal) => sum + (goal.tasks?.filter((task) => !!task.lastCompletedAt).length ?? 0),
    0
  );
  const unlockedRewards = rewards.filter((reward) => reward.isUnlocked).length;
  const bestDay = weeklyXpData.reduce(
    (best, day) => (day.value > best.value ? day : best),
    { name: "—", value: 0 }
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScreenHeader
        title={t("navigation.progress")}
        subtitle={
          selectedGoal
            ? t("progress.subtitle_selected", { title: selectedGoal.title })
            : t("progress.subtitle_all")
        }
      />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>{t("progress.filter_label")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <Pressable
              onPress={() => setGoalId(null)}
              style={{
                backgroundColor: goalId === null ? "#dbeafe" : "#ffffff",
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: goalId === null ? "#93c5fd" : "#e2e8f0",
              }}
            >
              <Text style={{ color: goalId === null ? "#1d4ed8" : "#334155", fontWeight: "600" }}>
                {t("progress.all_goals")}
              </Text>
            </Pressable>

            {goals.map((goal) => {
              const active = goal.id === goalId;

              return (
                <Pressable
                  key={goal.id}
                  onPress={() => setGoalId(goal.id)}
                  style={{
                    backgroundColor: active ? "#dbeafe" : "#ffffff",
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor: active ? "#93c5fd" : "#e2e8f0",
                  }}
                >
                  <Text style={{ color: active ? "#1d4ed8" : "#334155", fontWeight: "600" }}>
                    {goal.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          <StatTile label={t("progress.current_xp")} value={String(xp)} tone="blue" />
          <StatTile label={t("progress.completed_goals")} value={String(completedGoals)} tone="emerald" />
          <StatTile label={t("progress.completed_tasks")} value={`${completedTasks}/${totalTasks || 0}`} />
          <StatTile label={t("progress.unlocked_rewards")} value={String(unlockedRewards)} />
        </View>

        <SurfaceCard>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>{t("progress.activity_title")}</Text>

          {selectedGoal?.goalType !== "TASK" ? (
            <Text style={{ color: "#64748b" }}>{t("progress.activity_task_only")}</Text>
          ) : loadingActivity ? (
            <Text style={{ color: "#64748b" }}>{t("progress.activity_loading")}</Text>
          ) : weeklyXpData.length === 0 ? (
            <Text style={{ color: "#64748b" }}>{t("progress.activity_empty")}</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {weeklyXpData.map((item) => (
                <View key={item.name} style={{ gap: 6 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "#334155", fontWeight: "600" }}>{item.name}</Text>
                    <Text style={{ color: "#64748b" }}>{item.value} XP</Text>
                  </View>
                  <View
                    style={{
                      height: 10,
                      backgroundColor: "#e2e8f0",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${Math.max(8, Math.min(100, item.value === 0 ? 8 : item.value * 12))}%`,
                        height: "100%",
                        backgroundColor: "#2563eb",
                        borderRadius: 999,
                      }}
                    />
                  </View>
                </View>
              ))}

              <Text style={{ color: "#64748b" }}>{t("progress.best_day", { day: bestDay.name, xp: bestDay.value })}</Text>
            </View>
          )}
        </SurfaceCard>

        <SurfaceCard>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>{t("progress.streaks_title")}</Text>

          {!streakDays || streakDays.length === 0 ? (
            <Text style={{ color: "#64748b" }}>{t("progress.streaks_empty")}</Text>
          ) : (
            <View style={{ flexDirection: "row", gap: 8 }}>
              {streakDays.map((day, index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    paddingVertical: 14,
                    backgroundColor: day ? "#2563eb" : "#e2e8f0",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: day ? "#ffffff" : "#475569", fontWeight: "700" }}>
                    {day ? t("common.yes") : t("common.no")}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </SurfaceCard>

        <SurfaceCard>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>{t("progress.categories_title")}</Text>

          {categoryData.length === 0 ? (
            <Text style={{ color: "#64748b" }}>{t("progress.categories_empty")}</Text>
          ) : (
            categoryData.map((item) => (
              <View
                key={item.name}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f8fafc",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: "#0f172a", fontWeight: "600", flex: 1 }}>{item.name}</Text>
                <Text style={{ color: "#64748b" }}>{item.value}</Text>
              </View>
            ))
          )}
        </SurfaceCard>

        <SurfaceCard gap={8}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>{t("progress.overview_title")}</Text>
          <Text style={{ color: "#475569" }}>{t("progress.overview_user", { name: user?.name || user?.email || "—" })}</Text>
          <Text style={{ color: "#475569" }}>{t("progress.overview_goals", { count: filteredGoals.length })}</Text>
          <Text style={{ color: "#475569" }}>{t("progress.overview_activity", { count: activity?.data.length ?? 0 })}</Text>
        </SurfaceCard>
      </ScrollView>
    </View>
  );
}
