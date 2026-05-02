import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Target, Trophy, Zap } from "@/components/native/Icons";
import { NativePeriodCalendar } from "@/components/native/NativePeriodCalendar";
import {
  ProgressCategoriesSection,
  ProgressGoalPickerModal,
  ProgressHeader,
  ProgressStreakSection,
  ProgressWeeklyXpSection,
} from "@/components/native/progress-screen/ProgressSections";
import { ProgressStatCard } from "@/components/native/progress-screen/ProgressPrimitives";
import { useProgressScreen } from "@/shared/screens/progress/useProgressScreen";
import { appPalette } from "@/theme/palette";

export default function NativeProgressScreenView(props: { goalId?: string | null; onConsumeLinkState?: () => void }) {
  const { t } = useTranslation();
  const [goalId, setGoalId] = useState<string | null>(props.goalId || null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { goals, rewards, selectedGoal, filteredGoals, xp, activity, loadingActivity, completedGoals, categoryData, weeklyXpData, streakDays } = useProgressScreen(goalId);

  useEffect(() => {
    if (props.goalId === undefined) return;
    setGoalId(props.goalId || null);
    props.onConsumeLinkState?.();
  }, [props.goalId, props.onConsumeLinkState]);

  const unlockedRewards = rewards.filter((reward) => reward.isUnlocked).length;
  const streakMeta = useMemo(
    () => (!activity || !streakDays ? null : { current: activity.currentStreak, longest: activity.longestStreak, days: streakDays }),
    [activity, streakDays]
  );
  const selectedLabel = selectedGoal?.title || t("progress.all_goals");

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <ProgressHeader title={t("progress.title")} selectedLabel={selectedLabel} onOpenPicker={() => setPickerOpen(true)} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
        {selectedGoal && selectedGoal.goalType === "TASK" && activity && <NativePeriodCalendar goal={selectedGoal} activity={activity} loading={loadingActivity} />}

        <View style={{ gap: 8 }}>
          {selectedGoal && <ProgressStatCard title={t("progress.goal_xp")} value={xp} description={t("progress.goal_xp_description")} icon={<Zap size={20} color={appPalette.semantic.textMuted} />} />}
          {!selectedGoal && <ProgressStatCard title={t("progress.completed_goals")} value={completedGoals} description={t("progress.completed_goals_description", { count: filteredGoals.length })} icon={<Target size={20} color={appPalette.semantic.textMuted} />} />}
          {!selectedGoal && <ProgressStatCard title={t("progress.rewards_received")} value={unlockedRewards} description={t("progress.rewards_received_description", { count: rewards.length })} icon={<Trophy size={20} color={appPalette.semantic.textMuted} />} />}
        </View>

        {selectedGoal && selectedGoal.goalType === "TASK" && streakMeta && (
          <ProgressStreakSection current={streakMeta.current} longest={streakMeta.longest} days={streakMeta.days} />
        )}

        {selectedGoal && selectedGoal.goalType === "TASK" && weeklyXpData.length > 0 && <ProgressWeeklyXpSection data={weeklyXpData} />}

        {!selectedGoal && <ProgressCategoriesSection categoryData={categoryData} />}
      </ScrollView>

      <ProgressGoalPickerModal
        open={pickerOpen}
        goals={goals}
        goalId={goalId}
        onClose={() => setPickerOpen(false)}
        onSelectGoal={(nextGoalId) => {
          setGoalId(nextGoalId);
          setPickerOpen(false);
        }}
      />
    </View>
  );
}
