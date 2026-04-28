import type { Challenge, Goal } from "@/types";

export function formatChallengeDate(value?: string) {
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

export function goalCompleted(goal: Goal) {
  if (goal.goalType === "TASK") return Boolean(goal.lastCompletedAt);
  if (goal.goalType === "PROGRESS" && goal.targetValue && goal.targetValue > 0) {
    return (goal.currentValue ?? 0) >= goal.targetValue;
  }

  return false;
}

export function calculateChallengeProgress(goals: Goal[]) {
  if (goals.length === 0) {
    return 0;
  }

  return (
    goals.reduce((sum, goal) => {
      if (goal.goalType === "TASK") return sum + (goal.lastCompletedAt ? 1 : 0);
      if (goal.goalType === "PROGRESS" && goal.targetValue && goal.targetValue > 0) {
        const value = Math.min(goal.currentValue ?? 0, goal.targetValue);
        return sum + value / goal.targetValue;
      }

      return sum;
    }, 0) / goals.length
  );
}

export function getChallengeDerivedState(challenge: Challenge, userId?: string | null) {
  const isCreator = challenge.creatorId === userId;
  const isParticipant = challenge.participants.some((participant) => participant.userId === userId);
  const completedGoals = challenge.goals.filter(goalCompleted).length;
  const progress = calculateChallengeProgress(challenge.goals);
  const allGoalsCompleted = challenge.goals.every(goalCompleted);
  const now = new Date();
  const challengeStart = challenge.startsAt ? new Date(challenge.startsAt) : null;
  const challengeEnd = challenge.endsAt ? new Date(challenge.endsAt) : null;
  const hasStarted = challengeStart
    ? new Date(challengeStart.getTime() + 24 * 60 * 60 * 1000) <= now
    : false;
  const hasEnded = challengeEnd
    ? new Date(challengeEnd.getTime() + 24 * 60 * 60 * 1000) <= now
    : false;
  const challengeStatus: "COMPLETED" | "FAILED" | "ACTIVE" = !isParticipant
    ? "ACTIVE"
    : allGoalsCompleted
      ? "COMPLETED"
      : challenge.endsAt && new Date(challenge.endsAt) < now
        ? "FAILED"
        : "ACTIVE";

  return {
    isCreator,
    isParticipant,
    completedGoals,
    progress,
    hasStarted,
    hasEnded,
    challengeStatus,
  };
}

export function getChallengeStatusTranslationKey(status: "COMPLETED" | "FAILED" | "ACTIVE") {
  if (status === "COMPLETED") return "challenges.status_completed";
  if (status === "FAILED") return "challenges.status_failed";
  return "challenges.status_active";
}
