import { useState } from "react";
import { Task } from "@/components/GoalDialog";

/* универсальный рекурсивный апдейтер */
function updateRecursive(
  tasks: Task[],
  matcher: (task: Task) => boolean,
  updater: (task: Task) => Task
): Task[] {
  return tasks.map(task => {
    if (matcher(task)) {
      return updater(task);
    }

    if (task.subtasks?.length) {
      return {
        ...task,
        subtasks: updateRecursive(task.subtasks, matcher, updater),
      };
    }

    return task;
  });
}

export function useTaskTree(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  /* ---------- actions ---------- */

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const addSubtask = (parentId: string, subtask: Task) => {
    setTasks(prev =>
      updateRecursive(
        prev,
        t => t.id === parentId,
        t => ({
          ...t,
          subtasks: [...(t.subtasks || []), subtask],
        })
      )
    );

    setExpanded(prev => ({ ...prev, [parentId]: true }));
  };

  const toggleCompleted = (id: string) => {
    setTasks(prev =>
      updateRecursive(
        prev,
        t => t.id === id,
        t => ({ ...t, completed: !t.completed })
      )
    );
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const removeTask = (id: string) => {
    const removeRecursive = (tasks: Task[]): Task[] =>
      tasks
        .filter(t => t.id !== id)
        .map(t =>
          t.subtasks
            ? { ...t, subtasks: removeRecursive(t.subtasks) }
            : t
        );

    setTasks(prev => removeRecursive(prev));
  };

  return {
    tasks,
    expanded,
    addTask,
    addSubtask,
    toggleCompleted,
    toggleExpand,
    removeTask,
    setTasks, // пригодится при edit
  };
}
