import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { useAppStore } from "@/stores/useAppStore";
import type { GoalActivity } from "@/types";

export function useProgressScreen(goalId?: string | null) {
  const { t } = useTranslation();
  const { user, goals, rewards, categories, getActivity, getGoalXp } = useAppStore();

  const [xp, setXp] = useState<number>(0);
  const [activity, setActivity] = useState<GoalActivity>();
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [xpError, setXpError] = useState(false);
  const [activityError, setActivityError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const selectedGoal = useMemo(() => goals.find((goal) => goal.id === goalId), [goals, goalId]);
  const filteredGoals = useMemo(() => (selectedGoal ? [selectedGoal] : goals), [selectedGoal, goals]);

  const completedGoals = filteredGoals.filter((goal) => goal.tasks?.length && goal.tasks.every((task) => !!task.lastCompletedAt)).length;

  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    filteredGoals.forEach((goal) => {
      const categoryLabel = categories.find((category) => category.value === goal.category)?.label || t("progress.no_category");

      categoryMap[categoryLabel] = (categoryMap[categoryLabel] || 0) + (goal.tasks?.filter((task) => !!task.lastCompletedAt).length || 0);
    });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [filteredGoals, categories, t]);

  const weeklyXpData = useMemo(() => {
    if (!activity) {
      return [];
    }

    const weekdayLabelByIsoDay: Record<number, string> = {
      1: t("weekdays.mon"),
      2: t("weekdays.tue"),
      3: t("weekdays.wed"),
      4: t("weekdays.thu"),
      5: t("weekdays.fri"),
      6: t("weekdays.sat"),
      7: t("weekdays.sun"),
    };

    const days = Array.from({ length: 7 }).map((_, index) => dayjs().subtract(6 - index, "day"));
    const result = days.map((day) => ({
      name: weekdayLabelByIsoDay[day.isoWeekday()] ?? day.format("dd"),
      value: 0,
      date: day.format("YYYY-MM-DD"),
    }));

    activity.data.forEach((item) => {
      const date = dayjs(item.periodStart).format("YYYY-MM-DD");
      const dayIndex = result.findIndex((day) => day.date === date);
      if (dayIndex !== -1) {
        result[dayIndex].value += item.xp || 0;
      }
    });

    return result.map(({ name, value }) => ({ name, value }));
  }, [activity, t]);

  const streakDays = activity?.data.slice(-7).map((item) => item.status === "full");

  const retryGoalMetrics = useCallback(() => {
    setXpError(false);
    setActivityError(false);
    setReloadKey((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;

    const loadXp = async () => {
      try {
        const fallbackXp = user?.xp ?? 0;
        const nextXp = selectedGoal ? await getGoalXp(selectedGoal.id) : fallbackXp;

        if (active) {
          setXpError(false);
          setXp(nextXp);
        }
      } catch (error) {
        console.error("Failed to load progress XP", {
          goalId: selectedGoal?.id ?? null,
          error,
        });

        if (active) {
          setXpError(true);
          setXp(user?.xp ?? 0);
        }
      }
    };

    void loadXp();

    return () => {
      active = false;
    };
  }, [selectedGoal, getGoalXp, reloadKey, user]);

  useEffect(() => {
    if (!selectedGoal || selectedGoal.goalType !== "TASK") {
      setActivity(undefined);
      setLoadingActivity(false);
      setActivityError(false);
      return;
    }

    let active = true;

    const loadActivity = async () => {
      try {
        if (active) {
          setLoadingActivity(true);
        }

        const response = await getActivity(selectedGoal.id);
        if (active) {
          setActivityError(false);
          setActivity(response);
        }
      } catch (error) {
        console.error("Failed to load goal activity", {
          goalId: selectedGoal.id,
          error,
        });

        if (active) {
          setActivityError(true);
          setActivity(undefined);
        }
      } finally {
        if (active) {
          setLoadingActivity(false);
        }
      }
    };

    void loadActivity();

    return () => {
      active = false;
    };
  }, [selectedGoal, getActivity, reloadKey]);

  return {
    user,
    goals,
    rewards,
    goalId: goalId ?? "",
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
  };
}
