import { useSearchParams, useNavigate } from "react-router-dom";
import { Target, Trophy, Zap } from "lucide-react";

import { PeriodCalendar } from "@/components/PeriodCalendar";
import { ProgressChart } from "@/components/ProgressChart";
import { StatCard } from "@/components/StatCard";
import { StreakCard } from "@/components/StreakCard";
import { useProgressScreen } from "@/shared/screens/progress/useProgressScreen";

export default function ProgressScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const goalId = searchParams.get("goalId");

  const {
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

  const handleGoalChange = (value: string) => {
    if (!value) {
      navigate("/progress");
      return;
    }

    navigate(`/progress?goalId=${value}`);
  };

  return (
    <div className="flex w-full flex-1 flex-col px-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="py-3">Мой прогресс</h2>

        <select
          value={goalId || ""}
          onChange={(event) => handleGoalChange(event.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Все цели</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {selectedGoal && selectedGoal.goalType === "TASK" && activity && (
          <PeriodCalendar goal={selectedGoal} activity={activity} loading={loadingActivity} />
        )}

        <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
          {selectedGoal && (
            <StatCard
              title="XP за цель"
              value={xp}
              icon={Zap}
              description="Накоплено опыта"
            />
          )}

          {!selectedGoal && (
            <StatCard
              title="Завершено целей"
              value={completedGoals}
              icon={Target}
              description={`Из ${filteredGoals.length} целей`}
            />
          )}

          {!selectedGoal && (
            <StatCard
              title="Получено наград"
              value={rewards.filter((reward) => reward.isUnlocked).length}
              icon={Trophy}
              description={`Из ${rewards.length} наград`}
            />
          )}

          {selectedGoal && selectedGoal.goalType === "TASK" && activity && streakDays && (
            <StreakCard
              currentStreak={activity.currentStreak}
              longestStreak={activity.longestStreak}
              streakDays={streakDays}
            />
          )}

          {selectedGoal && selectedGoal.goalType === "TASK" && (
            <ProgressChart
              type="line"
              title="Опыт за неделю"
              description="Ваш заработанный опыт по дням"
              data={weeklyXpData}
              dataKey="value"
            />
          )}

          {!selectedGoal && (
            <ProgressChart
              type="bar"
              title="Задачи по категориям"
              description="Распределение выполненных задач"
              data={categoryData}
              dataKey="value"
            />
          )}
        </div>
      </div>
    </div>
  );
}
