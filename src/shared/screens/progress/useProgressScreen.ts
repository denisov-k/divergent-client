import { useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";

import { useAppStore } from "@/stores/useAppStore";
import type { GoalActivity } from "@/types";

export function useProgressScreen(goalId?: string | null) {
  const { user, goals, rewards, categories, getActivity, getGoalXp } = useAppStore();

  const [xp, setXp] = useState<number>(0);
  const [activity, setActivity] = useState<GoalActivity>();
  const [loadingActivity, setLoadingActivity] = useState(false);

  const selectedGoal = useMemo(
    () => goals.find((goal) => goal.id === goalId),
    [goals, goalId]
  );

  const filteredGoals = useMemo(
    () => (selectedGoal ? [selectedGoal] : goals),
    [selectedGoal, goals]
  );

  const completedGoals = filteredGoals.filter(
    (goal) => goal.tasks?.length && goal.tasks.every((task) => !!task.lastCompletedAt)
  ).length;

  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    filteredGoals.forEach((goal) => {
      const categoryLabel =
        categories.find((category) => category.value === goal.category)?.label || "Без категории";

      categoryMap[categoryLabel] =
        (categoryMap[categoryLabel] || 0) +
        (goal.tasks?.filter((task) => !!task.lastCompletedAt).length || 0);
    });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [filteredGoals, categories]);

  const weeklyXpData = useMemo(() => {
    if (!activity) {
      return [];
    }

    const days = Array.from({ length: 7 }).map((_, index) => dayjs().subtract(6 - index, "day"));
    const result = days.map((day) => ({
      name: day.format("dd"),
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
  }, [activity]);

  const streakDays = activity?.data.slice(-7).map((item) => item.status === "full");

  useEffect(() => {
    const loadXp = async () => {
      const nextXp = selectedGoal ? await getGoalXp(selectedGoal.id) : user!.xp;
      setXp(nextXp);
    };

    void loadXp();
  }, [selectedGoal, getGoalXp, user]);

  useEffect(() => {
    if (!selectedGoal || selectedGoal.goalType !== "TASK") {
      setActivity(undefined);
      return;
    }

    const loadActivity = async () => {
      try {
        setLoadingActivity(true);
        const response = await getActivity(selectedGoal.id);
        setActivity(response);
      } finally {
        setLoadingActivity(false);
      }
    };

    void loadActivity();
  }, [selectedGoal, getActivity]);

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
    completedGoals,
    categoryData,
    weeklyXpData,
    streakDays,
  };
}
