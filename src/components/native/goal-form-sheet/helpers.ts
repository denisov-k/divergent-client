import type { Task } from "@/types";

export function createTask(title: string): Task {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    lastCompletedAt: "",
    parentId: null,
    subtasks: [],
  };
}
