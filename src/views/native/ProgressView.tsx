import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Target, Trophy, Zap } from "@/components/native/Icons";
import { NativePeriodCalendar } from "@/components/native/NativePeriodCalendar";
import { NativeScreenErrorBoundary } from "@/components/native/NativeScreenErrorBoundary";
import { SurfaceCard } from "@/components/native/SurfaceCard";
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
import type { GoalActivity } from "@/types";

type SectionBoundaryProps = {
  section: string;
  diagnostics: Record<string, unknown>;
  children: ReactNode;
};

type SectionBoundaryState = {
  hasError: boolean;
};

class ProgressSectionBoundary extends Component<SectionBoundaryProps, SectionBoundaryState> {
  state: SectionBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Native progress section render failed", {
      section: this.props.section,
      error,
      componentStack: errorInfo.componentStack,
      diagnostics: this.props.diagnostics,
    });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return null;
  }
}

function ProgressGoalErrorCard({
  title,
  description,
  actionLabel,
  onPress,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onPress: () => void;
}) {
  return (
    <SurfaceCard gap={12} padding={16} radius={12}>
      <View style={{ gap: 4 }}>
        <Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat" }}>{title}</Text>
        <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{description}</Text>
      </View>
      <Pressable
        onPress={onPress}
        style={{
          alignSelf: "flex-start",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: appPalette.semantic.infoBorder,
          backgroundColor: appPalette.semantic.infoSurface,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: appPalette.semantic.infoText, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{actionLabel}</Text>
      </Pressable>
    </SurfaceCard>
  );
}

function NativeProgressScreenContent(props: { goalId?: string | null; onConsumeLinkState?: () => void }) {
  const { t, i18n } = useTranslation();
  const [goalId, setGoalId] = useState<string | null>(props.goalId || null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const {
    goals,
    rewards,
    selectedGoal,
    filteredGoals,
    xp,
    activity,
    loadingActivity,
    xpError,
    activityError,
    completedGoals,
    categoryData,
    weeklyXpData,
    streakDays,
    retryGoalMetrics,
  } = useProgressScreen(goalId);

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
  const baseDiagnostics = useMemo(
    () => ({
      goalId,
      selectedGoalId: selectedGoal?.id ?? null,
      selectedGoalType: selectedGoal?.goalType ?? null,
      selectedGoalPeriod: selectedGoal?.goalPeriod ?? null,
      selectedGoalTaskCount: selectedGoal?.tasks?.length ?? 0,
      hasActivity: Boolean(activity),
      activityPoints: activity?.data?.length ?? 0,
      currentStreak: activity?.currentStreak ?? null,
      longestStreak: activity?.longestStreak ?? null,
      streakDaysCount: streakDays?.length ?? 0,
      weeklyXpBars: weeklyXpData.length,
      loadingActivity,
      xpError,
      activityError,
    }),
    [activity, activityError, goalId, loadingActivity, selectedGoal, streakDays, weeklyXpData.length, xpError]
  );
  const selectedLabel = selectedGoal?.title || t("progress.all_goals");
  const progressLoadErrorDescription = i18n.language?.startsWith("ru")
    ? "Не удалось загрузить прогресс по этой цели. Попробуй повторить запрос ещё раз."
    : "Couldn't load progress for this goal. Try requesting it again.";
  const retryLabel = i18n.language?.startsWith("ru") ? "Повторить" : "Retry";
  const taskGoalFallbackActivity = useMemo<GoalActivity | null>(() => {
    if (!selectedGoal || selectedGoal.goalType !== "TASK") {
      return null;
    }

    return activity ?? {
      currentStreak: 0,
      longestStreak: 0,
      period: selectedGoal.goalPeriod,
      data: [],
    };
  }, [activity, selectedGoal]);
  const showTaskGoalError = !!selectedGoal && selectedGoal.goalType === "TASK" && (xpError || activityError);

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <ProgressHeader title={t("progress.title")} selectedLabel={selectedLabel} onOpenPicker={() => setPickerOpen(true)} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
        <View style={{ gap: 8 }}>
          {selectedGoal && <ProgressStatCard title={t("progress.goal_xp")} value={xp} description={t("progress.goal_xp_description")} icon={<Zap size={20} color={appPalette.semantic.textMuted} />} />}
          {!selectedGoal && <ProgressStatCard title={t("progress.completed_goals")} value={completedGoals} description={t("progress.completed_goals_description", { count: filteredGoals.length })} icon={<Target size={20} color={appPalette.semantic.textMuted} />} />}
          {!selectedGoal && <ProgressStatCard title={t("progress.rewards_received")} value={unlockedRewards} description={t("progress.rewards_received_description", { count: rewards.length })} icon={<Trophy size={20} color={appPalette.semantic.textMuted} />} />}
        </View>

        {selectedGoal && selectedGoal.goalType === "TASK" && taskGoalFallbackActivity && (
          <ProgressSectionBoundary
            section="NativePeriodCalendar"
            diagnostics={{
              ...baseDiagnostics,
              renderedActivityPoints: taskGoalFallbackActivity.data.length,
            }}
          >
            <NativePeriodCalendar goal={selectedGoal} activity={taskGoalFallbackActivity} loading={loadingActivity} />
          </ProgressSectionBoundary>
        )}

        {showTaskGoalError && (
          <ProgressGoalErrorCard
            title={t("progress.activity_widget_title")}
            description={progressLoadErrorDescription}
            actionLabel={retryLabel}
            onPress={retryGoalMetrics}
          />
        )}

        {selectedGoal && selectedGoal.goalType === "TASK" && streakMeta && (
          <ProgressSectionBoundary
            section="ProgressStreakSection"
            diagnostics={{
              ...baseDiagnostics,
              renderedStreakDays: streakMeta.days.length,
            }}
          >
            <ProgressStreakSection current={streakMeta.current} longest={streakMeta.longest} days={streakMeta.days} />
          </ProgressSectionBoundary>
        )}

        {selectedGoal && selectedGoal.goalType === "TASK" && weeklyXpData.length > 0 && (
          <ProgressSectionBoundary
            section="ProgressWeeklyXpSection"
            diagnostics={{
              ...baseDiagnostics,
              renderedWeeklyXpBars: weeklyXpData.length,
              maxWeeklyXpValue: Math.max(...weeklyXpData.map((item) => item.value), 0),
            }}
          >
            <ProgressWeeklyXpSection data={weeklyXpData} />
          </ProgressSectionBoundary>
        )}

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

export default function NativeProgressScreenView(props: { goalId?: string | null; onConsumeLinkState?: () => void }) {
  const { t, i18n } = useTranslation();
  const [boundaryKey, setBoundaryKey] = useState(0);
  const fallbackMessage = i18n.language?.startsWith("ru")
    ? "Экран прогресса временно не удалось отрисовать. Сбросим выбор цели и откроем безопасное состояние."
    : "The progress screen couldn't be rendered right now. We'll reset the selected goal and reopen a safe state.";

  return (
    <NativeScreenErrorBoundary
      key={boundaryKey}
      title={t("progress.title")}
      message={fallbackMessage}
      resetLabel={t("progress.all_goals")}
      onReset={() => {
        setBoundaryKey((value) => value + 1);
      }}
    >
      <NativeProgressScreenContent {...props} />
    </NativeScreenErrorBoundary>
  );
}
