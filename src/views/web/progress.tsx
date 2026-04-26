import { useSearchParams, useNavigate } from "react-router-dom";
import { Target, Trophy, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PeriodCalendar } from "@/components/PeriodCalendar";
import { ProgressChart } from "@/components/ProgressChart";
import { StatCard } from "@/components/StatCard";
import { StreakCard } from "@/components/StreakCard";
import { buildProgressPath } from "@/app/routes";
import { useProgressScreen } from "@/shared/screens/progress/useProgressScreen";

export default function ProgressScreen() {
  const { t } = useTranslation();
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
        <h2 className="py-3">{t("progress.title")}</h2>

        <select
          value={goalId || ""}
          onChange={(event) => handleGoalChange(event.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("progress.all_goals")}</option>
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
              title={t("progress.goal_xp")}
              value={xp}
              icon={Zap}
              description={t("progress.goal_xp_description")}
            />
          )}

          {!selectedGoal && (
            <StatCard
              title={t("progress.completed_goals")}
              value={completedGoals}
              icon={Target}
              description={t("progress.completed_goals_description", { count: filteredGoals.length })}
            />
          )}

          {!selectedGoal && (
            <StatCard
              title={t("progress.rewards_received")}
              value={rewards.filter((reward) => reward.isUnlocked).length}
              icon={Trophy}
              description={t("progress.rewards_received_description", { count: rewards.length })}
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
              title={t("progress.xp_week")}
              description={t("progress.xp_week_description")}
              data={weeklyXpData}
              dataKey="value"
            />
          )}

          {!selectedGoal && (
            <ProgressChart
              type="bar"
              title={t("progress.tasks_by_category")}
              description={t("progress.tasks_by_category_description")}
              data={categoryData}
              dataKey="value"
            />
          )}
        </div>
      </div>
    </div>
  );
}
