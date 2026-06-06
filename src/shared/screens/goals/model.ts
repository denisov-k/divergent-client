import type { GoalPeriod, Task } from "@/types";

export function findTaskRecursive(tasks: Task[], taskId: string): Task | null {
  for (const task of tasks) {
    if (task.id === taskId) {
      return task;
    }

    if (task.subtasks?.length) {
      const found = findTaskRecursive(task.subtasks, taskId);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

export function isTaskCompletedThisPeriod(task: Task, goalPeriod: GoalPeriod) {
  return isTaskCompletedThisPeriodAt(task, goalPeriod, new Date());
}

function getCurrentPeriodStart(goalPeriod: GoalPeriod, now: Date) {
  const start = new Date(now);

  if (goalPeriod === "DAILY") {
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (goalPeriod === "WEEKLY") {
    const day = start.getDay();
    const diff = (day + 6) % 7;
    start.setDate(start.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (goalPeriod === "MONTHLY") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  return start;
}

export function isTaskCompletedThisPeriodAt(task: Task, goalPeriod: GoalPeriod, now: Date) {
  if (!task.lastCompletedAt) {
    return false;
  }

  const last = new Date(task.lastCompletedAt);
  const periodStart = getCurrentPeriodStart(goalPeriod, now);

  if (goalPeriod === "NONE") {
    return true;
  }

  if (goalPeriod === "DAILY") {
    return last >= periodStart;
  }

  return last >= periodStart;
}

export function sumTaskXp(tasks?: Task[]): number {
  if (!tasks || tasks.length === 0) {
    return 0;
  }

  return tasks.reduce((sum, task) => sum + (task.xpReward ?? 0) + sumTaskXp(task.subtasks), 0);
}

export function sumCompletedTaskXp(tasks: Task[] | undefined, goalPeriod: GoalPeriod, now = new Date()): number {
  if (!tasks || tasks.length === 0) {
    return 0;
  }

  return tasks.reduce(
    (sum, task) =>
      sum +
      (isTaskCompletedThisPeriodAt(task, goalPeriod, now) ? task.xpReward ?? 0 : 0) +
      sumCompletedTaskXp(task.subtasks, goalPeriod, now),
    0,
  );
}
