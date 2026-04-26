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
  if (!task.lastCompletedAt) {
    return false;
  }

  const last = new Date(task.lastCompletedAt);
  const now = new Date();

  if (goalPeriod === "DAILY") {
    return last.toDateString() === now.toDateString();
  }

  if (goalPeriod === "WEEKLY") {
    const week = (d: Date) => {
      const onejan = new Date(d.getFullYear(), 0, 1);
      return Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    };

    return last.getFullYear() === now.getFullYear() && week(last) === week(now);
  }

  if (goalPeriod === "MONTHLY") {
    return last.getFullYear() === now.getFullYear() && last.getMonth() === now.getMonth();
  }

  return true;
}
