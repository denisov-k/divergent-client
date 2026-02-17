import { StreakCard } from "@/components/StreakCard";
import { StatCard } from "@/components/StatCard";
import { ProgressChart } from "@/components/ProgressChart";

import { Target, Trophy, Zap } from "lucide-react";

import { useAppStore } from "@/stores/useAppStore";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import dayjs from "dayjs";
import {PeriodCalendar} from "@/components/PeriodCalendar.tsx";
import {GridItem} from "@/types";

export default function Progress() {
  const { user, goals, rewards, getActivity, getGoalXp } = useAppStore();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const goalId = searchParams.get("goalId");

  const [xp, setXp] = useState<number>(0);
  //const [loadingXp, setLoadingXp] = useState(false);

  const [activity, setActivity] = useState<GridItem[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const selectedGoal = useMemo(
    () => goals.find(g => g.id === goalId),
    [goals, goalId]
  );

  const filteredGoals = useMemo(
    () => (selectedGoal ? [selectedGoal] : goals),
    [selectedGoal, goals]
  );

  // ==========================
  // Вычисляем статистику
  // ==========================

  const completedGoals = filteredGoals.filter(
    g => g.tasks?.length && g.tasks.every(t => !!t.lastCompletedAt)
  ).length;

  // Данные по категориям
  const categoryMap: Record<string, number> = {};
  filteredGoals.forEach(g => {
    categoryMap[g.categoryLabel] =
      (categoryMap[g.categoryLabel] || 0) +
      (g.tasks?.filter(t => !!t.lastCompletedAt).length || 0);
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Пример данных по опыту за неделю (можно подключить реальный источник)
  const weeklyXpData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) =>
      dayjs().subtract(6 - i, "day")
    );

    const result = days.map((day) => ({
      name: day.format("dd"), // Пн, Вт и тд
      value: 0,
      date: day.format("YYYY-MM-DD"),
    }));

    filteredGoals.forEach(goal => {
      goal.tasks?.forEach(task => {
        if (!task.lastCompletedAt) return;

        const taskDate = dayjs(task.lastCompletedAt).format("YYYY-MM-DD");

        const dayIndex = result.findIndex(d => d.date === taskDate);
        if (dayIndex !== -1) {
          result[dayIndex].value += task.xpReward || 0;
        }
      });
    });

    return result.map(({ name, value }) => ({ name, value }));
  }, [filteredGoals]);


  const { currentStreak, longestStreak, streakDays } = useMemo(() => {
    const completedDates = new Set<string>();

    filteredGoals.forEach(goal => {
      goal.tasks?.forEach(task => {
        if (task.lastCompletedAt) {
          completedDates.add(
            dayjs(task.lastCompletedAt).format("YYYY-MM-DD")
          );
        }
      });
    });

    let current = 0;
    let longest = 0;
    let temp = 0;

    const today = dayjs();

    for (let i = 0; i < 365; i++) {
      const date = today.subtract(i, "day").format("YYYY-MM-DD");

      if (completedDates.has(date)) {
        temp++;
        if (i === current) current++;
      } else {
        longest = Math.max(longest, temp);
        temp = 0;
        if (i === current) break;
      }
    }

    longest = Math.max(longest, temp);

    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const date = today.subtract(6 - i, "day").format("YYYY-MM-DD");
      return completedDates.has(date);
    });

    return {
      currentStreak: current,
      longestStreak: longest,
      streakDays: last7,
    };
  }, [filteredGoals]);

  const handleGoalChange = (value: string) => {
    if (!value) {
      navigate("/progress");
    } else {
      navigate(`/progress?goalId=${value}`);
    }
  };

  useEffect(() => {
    const loadXp = async () => {
      try {
        //setLoadingXp(true);

        const xp = selectedGoal ? await getGoalXp(selectedGoal.id) : user!.xp;

        setXp(xp);
      } finally {
        //setLoadingXp(false);
      }
    };

    loadXp();
  }, [selectedGoal, getGoalXp]);

  useEffect(() => {
    if (!selectedGoal || selectedGoal.goalType !== "TASK") return;

    const loadActivity = async () => {
      try {
        setLoadingActivity(true);

        const res = await getActivity(selectedGoal.id);

        setActivity(res || []);
      } finally {
        setLoadingActivity(false);
      }
    };

    loadActivity();
  }, [selectedGoal, getActivity]);


  return (
    <div className="flex flex-col flex-1 px-2 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="py-3">Мой прогресс</h2>

        <select
          value={goalId || ""}
          onChange={(e) => handleGoalChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-background"
        >
          <option value="">Все цели</option>
          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>

      <div className='overflow-y-auto flex flex-col'>
        {selectedGoal && selectedGoal.goalType === 'TASK' && (
          <PeriodCalendar
            goal={selectedGoal}
            data={activity}
            loading={loadingActivity}
          />
        )}

        {/* Статистика */}
        <div className="grid gap-2 md:grid-cols-4">
          <StatCard
            title="Всего XP"
            value={xp}
            icon={Zap}
            description="Накоплено опыта"
            trend={{value: 12, isPositive: true}}
          />
          {!selectedGoal &&
            <StatCard
              title="Завершено целей"
              value={completedGoals}
              icon={Target}
              description={`Из ${filteredGoals.length} целей`}
            />
          }
          {!selectedGoal &&
            <StatCard
              title="Получено наград"
              value={rewards.filter((r) => r.isUnlocked).length}
              icon={Trophy}
              description={`Из ${rewards.length} наград`}
            />
          }
        </div>

        {/* Серия выполнений */}
        {selectedGoal && selectedGoal.goalType === 'TASK' &&
          <StreakCard
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            streakDays={streakDays}
          />
        }

        {/* Графики */}
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          <ProgressChart
            type="line"
            title="Опыт за неделю"
            description="Ваш заработанный опыт по дням"
            data={weeklyXpData}
            dataKey="value"
          />
          {!selectedGoal &&
            <ProgressChart
              type="bar"
              title="Задачи по категориям"
              description="Распределение выполненных задач"
              data={categoryData}
              dataKey="value"
            />
          }
        </div>
      </div>
    </div>
  );
}
