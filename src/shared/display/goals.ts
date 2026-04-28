import type { GoalPeriod } from "@/types";

export function getGoalPeriodTranslationKey(goalPeriod?: GoalPeriod | null) {
  if (goalPeriod === "DAILY") return "goal_period.daily";
  if (goalPeriod === "WEEKLY") return "goal_period.weekly";
  if (goalPeriod === "MONTHLY") return "goal_period.monthly";
  return null;
}

export function formatGoalDate(value?: string) {
  if (!value) return "\u2014";

  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
