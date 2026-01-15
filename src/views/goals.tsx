import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalDialog } from "@/components/GoalDialog";
import {GoalFormData, Goal, CategoryOption, Task} from "@/types";

import { GoalCard } from "@/components/GoalCard";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useAppStore } from "@/stores/useAppStore";
import {useEffect, useRef, useState} from "react";
import {ReminderDialog} from "@/components/ReminderDialog.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

import {Reminder} from "@/types";

export default function Goals() {
  const {
    goals,
    addGoal,
    updateGoal,
    toggleTask,
    addXp,
    addReminder,
    addCategory,
    updateReminder,
    updateRewardGoal,
    updateGoalProgress,
    rewards,
    categories
  } = useAppStore();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const focusGoalId = searchParams.get("focus");

  const goalRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);
  const [selectedGoalIdForReminder, setSelectedGoalIdForReminder] = useState<string | undefined>(undefined);

  // ------------------------------
  // Сохранение цели
  // ------------------------------
  const handleSaveGoal = (goal: GoalFormData) => {
    if (editingGoal) {
      updateGoal(goal).then(() => {
        toast.success("Цель обновлена");

        // --- Обновляем goalId у награды, если она есть ---
        updateRewardGoal(goal.id, goal.rewardId ?? undefined);
      });
    } else {
      addGoal(goal).then(() => {
        toast.success("Цель создана");

        updateRewardGoal(goal.id, goal.rewardId ?? undefined);
      });
    }

    setEditingGoal(undefined);
  };

  // ------------------------------
  // Открыть редактирование
  // ------------------------------
  const handleEditGoal = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      setEditingGoal(goal);
      setGoalDialogOpen(true);
    }
  };

  const handleAddProgress = (id: string, delta: number) => {
    return updateGoalProgress(id, delta);
  }

  const handleAddCategory = (category: CategoryOption) => {
    addCategory(category);
    toast.success(`Категория "${category.label}" создана`);
  };

  const handleAddReminderFromGoal = (goalId: string) => {
    setSelectedGoalIdForReminder(goalId);
    setEditingReminder(undefined);
    setReminderDialogOpen(true);
  };

  const handleSaveReminder = (reminder: Reminder) => {
    if (editingReminder) {
      updateReminder(reminder).then(() => {
        toast.success("Напоминание обновлено");
      });
    } else {
      addReminder(reminder).then(() => {
        toast.success("Напоминание создано");
        navigate("/reminders");
      });
    }
    setEditingReminder(undefined);
  };


  function findTaskRecursive(tasks: Task[], taskId: string): Task | null {
    for (const task of tasks) {
      if (task.id === taskId) return task;

      if (task.subtasks?.length) {
        const found = findTaskRecursive(task.subtasks, taskId);
        if (found) return found;
      }
    }
    return null;
  }


  // ------------------------------
  // Переключить задачу
  // ------------------------------
  const handleTaskToggle = (goalId: string, taskId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    // --- Рекурсивно ищем задачу ---
    const task = findTaskRecursive(goal.tasks, taskId);
    if (!task) return;

    const newCompleted = !task.completed;

    // XP + Toast
    if (newCompleted) {
      addXp(task.xpReward || 0);
      toast.success(`+${task.xpReward} XP`);
    } else {
      addXp(-(task.xpReward || 0));
    }

    // toggle в сторе
    toggleTask(goalId, taskId);
  };

  useEffect(() => {
    if (!focusGoalId) return;

    const el = goalRefs.current[focusGoalId];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    el.classList.add("ring-2", "ring-primary", "ring-offset-2");

    const timeout = setTimeout(() => {
      el.classList.remove("ring-2", "ring-primary", "ring-offset-2");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [focusGoalId, goals]);

  return (
    <div className="flex flex-col px-2 flex-1">
      <div className="flex items-center justify-between py-2">
        <h2>{t('goals.title')}</h2>
        <div className="gap-2 flex">
          <Button
            onClick={() => {
              setEditingGoal(undefined);
              setGoalDialogOpen(true);
            }}
          >
            <Plus className="size-4 mr-2" />
            {t('goals.create_goal')}
          </Button>
        </div>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              У вас пока нет целей
            </p>

            <Button onClick={() => setGoalDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              Создать первую цель
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-wrap gap-2 overflow-auto flex-1">
          {goals.map((goal) => {
            const reward = rewards.find((r) => r.goalId === goal.id) || null;

            return (
              <div
                key={goal.id}
                className="
                  w-full
                  sm:w-[calc(50%-0.25rem)]
                  lg:w-[calc(33.333%-0.4rem)]
                  xl:w-[calc(25%-0.4rem)]
                "
              >
                <GoalCard
                  {...goal}
                  reward={reward}
                  onEdit={handleEditGoal}
                  onTaskToggle={handleTaskToggle}
                  onAddReminder={handleAddReminderFromGoal}
                  onAddProgress={handleAddProgress}
                  autoExpand={goal.id === focusGoalId}
                />
              </div>
            );
          })}
        </div>

      )}

      <GoalDialog
        open={goalDialogOpen}
        onOpenChange={(open) => {
          setGoalDialogOpen(open);
          if (!open) setEditingGoal(undefined);
        }}
        onSave={handleSaveGoal}
        goal={editingGoal}
        categories={categories}
        rewards={rewards}
        onAddCategory={handleAddCategory}
      />
      <ReminderDialog
        open={reminderDialogOpen}
        onOpenChange={(open) => {
          setReminderDialogOpen(open);
          if (!open) {
            setEditingReminder(undefined);
            setSelectedGoalIdForReminder(undefined);
          }
        }}
        onSave={handleSaveReminder}
        reminder={editingReminder}
        goals={goals}
        initialGoalId={selectedGoalIdForReminder}
      />
    </div>
  );
}
