import { StreakCard } from "@/components/StreakCard";
import { StatCard } from "@/components/StatCard";
import { ProgressChart } from "@/components/ProgressChart";

import { Target, Trophy, Zap } from "lucide-react";

import { useAppStore } from "@/stores/useAppStore";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import dayjs from "dayjs";
import {PeriodCalendar} from "@/components/PeriodCalendar.tsx";
import {GoalActivity} from "@/types";

export default function Progress() {
  const { user, goals, rewards, getActivity, getGoalXp } = useAppStore();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const goalId = searchParams.get("goalId");

  const [xp, setXp] = useState<number>(0);
  //const [loadingXp, setLoadingXp] = useState(false);

  const [activity, setActivity] = useState<GoalActivity>();
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
    if (!activity) return [];

    // последние 7 дней, от сегодня назад
    const days = Array.from({ length: 7 }).map((_, i) =>
      dayjs().subtract(6 - i, "day")
    );

    const result = days.map(day => ({
      name: day.format("dd"),           // Пн, Вт и т.д.
      value: 0,
      date: day.format("YYYY-MM-DD"),
    }));

    // суммируем xp из activity.data
    activity.data.forEach(item => {
      const date = dayjs(item.periodStart).format("YYYY-MM-DD");
      const dayIndex = result.findIndex(d => d.date === date);
      if (dayIndex !== -1) {
        result[dayIndex].value += item.xp || 0;
      }
    });

    return result.map(({ name, value }) => ({ name, value }));
  }, [activity]);

  const last7 = activity?.data.slice(-7).map(d => d.status === "full");

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

        setActivity(res);
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

      <div className='overflow-y-auto flex flex-col gap-2'>
        {selectedGoal && selectedGoal.goalType === 'TASK' && activity && (
          <PeriodCalendar
            goal={selectedGoal}
            activity={activity}
            loading={loadingActivity}
          />
        )}

        {/* Статистика */}
        <div className="columns-1
          sm:columns-2
          lg:columns-3
          xl:columns-4
          gap-2">
          {selectedGoal &&
            <StatCard
              title="XP за цель"
              value={xp}
              icon={Zap}
              description="Накоплено опыта"
              /*trend={{value: 12, isPositive: true}}*/
            />
          }
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
        {selectedGoal && selectedGoal.goalType === 'TASK' && activity &&
          <StreakCard
            currentStreak={activity.currentStreak}
            longestStreak={activity.longestStreak}
            streakDays={last7!}
          />
        }

        {/* Графики */}
        <div className="columns-1
          sm:columns-2
          lg:columns-3
          xl:columns-4
          gap-2">
          {selectedGoal && selectedGoal.goalType === "TASK" &&
            <ProgressChart
              type="line"
              title="Опыт за неделю"
              description="Ваш заработанный опыт по дням"
              data={weeklyXpData}
              dataKey="value"
            />
          }
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
