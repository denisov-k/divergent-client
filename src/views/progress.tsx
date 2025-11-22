import { StreakCard } from "@/components/StreakCard";
import { StatCard } from "@/components/StatCard";
import { ProgressChart } from "@/components/ProgressChart";

import { Target, Trophy, Zap, CheckCircle } from "lucide-react";

import { useAppStore } from "@/stores/useAppStore";

export default function Progress() {
  const { user, goals, rewards } = useAppStore();

  // ==========================
  // Вычисляем статистику
  // ==========================
  const currentXp = user.xp;
  const completedTasks = goals.reduce(
    (acc, goal) => acc + goal.tasks.filter((t) => t.completed).length,
    0
  );
  const totalTasks = goals.reduce((acc, goal) => acc + goal.tasks.length, 0);
  const completedGoals = goals.filter((g) => g.tasks.every((t) => t.completed)).length;

  // Данные по категориям
  const categoryMap: Record<string, number> = {};
  goals.forEach((g) => {
    categoryMap[g.categoryLabel] = (categoryMap[g.categoryLabel] || 0) + g.tasks.filter((t) => t.completed).length;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Пример данных по опыту за неделю (можно подключить реальный источник)
  const weeklyXpData = [
    { name: "Пн", value: 120 },
    { name: "Вт", value: 90 },
    { name: "Ср", value: 150 },
    { name: "Чт", value: 80 },
    { name: "Пт", value: 200 },
    { name: "Сб", value: 50 },
    { name: "Вс", value: 70 },
  ];

  // Пример серии выполнений (streak)
  const currentStreak = 12; // здесь можно вычислить динамически
  const longestStreak = 21; // здесь можно вычислить динамически
  const streakDays = [true, true, true, false, true, true, true]; // пример

  return (
    <div className="flex flex-col flex-1 px-2">
      <h2 className="py-3">Мой прогресс</h2>

      <div className='overflow-y-auto flex flex-col'>
        {/* Статистика */}
        <div className="grid gap-2 md:grid-cols-4">
          <StatCard
            title="Всего XP"
            value={currentXp}
            icon={Zap}
            description="Накоплено опыта"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Выполнено задач"
            value={completedTasks}
            icon={CheckCircle}
            description={`Из ${totalTasks} задач`}
          />
          <StatCard
            title="Завершено целей"
            value={completedGoals}
            icon={Target}
            description={`Из ${goals.length} целей`}
          />
          <StatCard
            title="Получено наград"
            value={rewards.filter((r) => r.isUnlocked).length}
            icon={Trophy}
            description={`Из ${rewards.length} наград`}
          />
        </div>

        {/* Серия выполнений */}
        <StreakCard
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          streakDays={streakDays}
        />

        {/* Графики */}
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          <ProgressChart
            type="line"
            title="Опыт за неделю"
            description="Ваш заработанный опыт по дням"
            data={weeklyXpData}
            dataKey="value"
          />
          <ProgressChart
            type="bar"
            title="Задачи по категориям"
            description="Распределение выполненных задач"
            data={categoryData}
            dataKey="value"
          />
        </div>
      </div>
    </div>
  );
}
