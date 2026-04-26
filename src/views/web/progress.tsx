import { useSearchParams, useNavigate } from "react-router-dom";
import { Target, Trophy, Zap } from "lucide-react";

import { PeriodCalendar } from "@/components/PeriodCalendar";
import { ProgressChart } from "@/components/ProgressChart";
import { StatCard } from "@/components/StatCard";
import { StreakCard } from "@/components/StreakCard";
import { buildProgressPath } from "@/app/routes";
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
      navigate(buildProgressPath());
      return;
    }

    navigate(buildProgressPath({ goalId: value }));
  };

  return (
    <div className="flex w-full flex-1 flex-col px-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="py-3">РњРѕР№ РїСЂРѕРіСЂРµСЃСЃ</h2>

        <select
          value={goalId || ""}
          onChange={(event) => handleGoalChange(event.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Р’СЃРµ С†РµР»Рё</option>
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
              title="XP Р·Р° С†РµР»СЊ"
              value={xp}
              icon={Zap}
              description="РќР°РєРѕРїР»РµРЅРѕ РѕРїС‹С‚Р°"
            />
          )}

          {!selectedGoal && (
            <StatCard
              title="Р—Р°РІРµСЂС€РµРЅРѕ С†РµР»РµР№"
              value={completedGoals}
              icon={Target}
              description={`РР· ${filteredGoals.length} С†РµР»РµР№`}
            />
          )}

          {!selectedGoal && (
            <StatCard
              title="РџРѕР»СѓС‡РµРЅРѕ РЅР°РіСЂР°Рґ"
              value={rewards.filter((reward) => reward.isUnlocked).length}
              icon={Trophy}
              description={`РР· ${rewards.length} РЅР°РіСЂР°Рґ`}
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
              title="РћРїС‹С‚ Р·Р° РЅРµРґРµР»СЋ"
              description="Р’Р°С€ Р·Р°СЂР°Р±РѕС‚Р°РЅРЅС‹Р№ РѕРїС‹С‚ РїРѕ РґРЅСЏРј"
              data={weeklyXpData}
              dataKey="value"
            />
          )}

          {!selectedGoal && (
            <ProgressChart
              type="bar"
              title="Р—Р°РґР°С‡Рё РїРѕ РєР°С‚РµРіРѕСЂРёСЏРј"
              description="Р Р°СЃРїСЂРµРґРµР»РµРЅРёРµ РІС‹РїРѕР»РЅРµРЅРЅС‹С… Р·Р°РґР°С‡"
              data={categoryData}
              dataKey="value"
            />
          )}
        </div>
      </div>
    </div>
  );
}

