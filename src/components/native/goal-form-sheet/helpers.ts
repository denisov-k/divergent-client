import type { Task } from "@/types";

export function createTask(title: string, xpReward?: number): Task {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    lastCompletedAt: "",
    xpReward,
    parentId: null,
    subtasks: [],
  };
}
