import type { Goal, Task, OnboardingState, OnboardingStepKey } from "@/types";

export type OnboardingStepState = {
  key: OnboardingStepKey;
  completed: boolean;
};

export type OnboardingChecklistState = {
  steps: OnboardingStepState[];
  completedCount: number;
  totalCount: number;
  nextStep: OnboardingStepKey | null;
  isComplete: boolean;
};

function hasCompletedTask(tasks?: Task[]): boolean {
  if (!tasks?.length) {
    return false;
  }

  return tasks.some((task) => Boolean(task.lastCompletedAt) || hasCompletedTask(task.subtasks));
}

function getDerivedStepState(goals: Goal[], hasAiHistory: boolean): OnboardingState {
  const steps: OnboardingState = {};

  if (goals.length > 0) {
    steps.created_first_goal = new Date().toISOString();
  }

  if (hasAiHistory) {
    steps.used_ai = new Date().toISOString();
  }

  if (goals.some((goal) => hasCompletedTask(goal.tasks))) {
    steps.completed_first_task = new Date().toISOString();
  }

  return steps;
}

export function buildOnboardingChecklist(
  goals: Goal[],
  persistedState?: OnboardingState | null,
  hasAiHistory = false,
): OnboardingChecklistState {
  const derivedState = getDerivedStepState(goals, hasAiHistory);
  const steps: OnboardingStepState[] = [
    {
      key: "used_ai",
      completed: Boolean(persistedState?.used_ai ?? derivedState.used_ai),
    },
    {
      key: "created_first_goal",
      completed: Boolean(persistedState?.created_first_goal ?? derivedState.created_first_goal),
    },
    {
      key: "completed_first_task",
      completed: Boolean(persistedState?.completed_first_task ?? derivedState.completed_first_task),
    },
  ];

  const completedCount = steps.filter((step) => step.completed).length;
  const nextStep = steps.find((step) => !step.completed)?.key ?? null;

  return {
    steps,
    completedCount,
    totalCount: steps.length,
    nextStep,
    isComplete: completedCount === steps.length,
  };
}
