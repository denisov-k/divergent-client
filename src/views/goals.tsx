import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalDialog } from "@/components/GoalDialog";
import {GoalFormData, Goal, CategoryOption, Task} from "@/types";

import { GoalCard } from "@/components/GoalCard";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useAppStore } from "@/stores/useAppStore";
import { useState} from "react";
import {ReminderDialog} from "@/components/ReminderDialog.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

import {Reminder} from "@/types";
import CreateReportDialog from "@/components/CreateReportDialog.tsx";

export default function Goals() {
  const {
    goals,
    addGoal,
    updateGoal,
    toggleTask,
    addXp,
    addReminder,
    addCategory,
    addReport,
    updateReminder,
    updateRewardGoal,
    updateGoalProgress,
    deleteGoal,
    rewards,
    categories
  } = useAppStore();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("id");

  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  const [createReportDialogOpen, setCreateReportDialogOpen] = useState(false);
  const [reportTaskId, setReportTaskId] = useState<string | null>(null);

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

  const handleDeleteGoal = async (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      await deleteGoal(goal);
      setGoalDialogOpen(false);
    }
  };

  const handleAddProgress = (id: string, delta: number) => {
    return updateGoalProgress(id, delta);
  }
  const handleGoToProgress = (id: string) => {
    return navigate(`/progress?goalId=${id}`);
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

  const handleSaveReport = async ({
    file,
    comment,
  }: {
    file: File;
    comment?: string;
  }) => {
    if (!reportTaskId) return;

    const formData = new FormData();
    formData.append("file", file);
    if (comment) formData.append("comment", comment);

    await addReport(reportTaskId, formData);

    toast.success("Отчёт отправлен, задача выполнена");

    setCreateReportDialogOpen(false);
    setReportTaskId(null);
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

  function isTaskCompletedThisPeriod(task: Task, goalPeriod: string) {
    if (!task.lastCompletedAt) return false;
    const last = new Date(task.lastCompletedAt);
    const now = new Date();

    if (goalPeriod === "DAILY") return last.toDateString() === now.toDateString();

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

    return true; // NONE
  }



  // ------------------------------
  // Переключить задачу
  // ------------------------------
  const handleTaskToggle = (goalId: string, taskId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const task = findTaskRecursive(goal.tasks, taskId);
    if (!task) return;

    const newCompleted = !isTaskCompletedThisPeriod(task, goal.goalPeriod);

    // ❗ если требуется отчёт — сначала модалка
    if (
      newCompleted &&
      goal.challenge?.requiresReport
    ) {
      setReportTaskId(taskId);
      setCreateReportDialogOpen(true);
      return;
    }

    // обычное выполнение
    if (newCompleted) {
      addXp(task.xpReward || 0);
      toast.success(`+${task.xpReward ?? 0} XP`);
    } else {
      addXp(-(task.xpReward || 0));
    }

    toggleTask(taskId);
  };

  /*useEffect(() => {
    if (!focusId) return;

    const el = goalRefs.current[focusId];
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
  }, [focusId, goals]);*/

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
        <div className="grid gap-2 overflow-auto
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4">
          {goals.map((goal) => {
            const reward = rewards.find((r) => r.goalId === goal.id) || null;

            return (
              <GoalCard
                {...goal}
                key={goal.id}
                reward={reward}
                onEdit={handleEditGoal}
                onTaskToggle={handleTaskToggle}
                onAddReminder={handleAddReminderFromGoal}
                onAddProgress={handleAddProgress}
                onGoToProgress={handleGoToProgress}
                autoExpand={goal.id === focusId}
              />
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
        onDelete={handleDeleteGoal}
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
      <CreateReportDialog
        open={createReportDialogOpen}
        onOpenChange={(open) => {
          setCreateReportDialogOpen(open);
          if (!open) setReportTaskId(null);
        }}
        onSubmit={handleSaveReport}
      />
    </div>
  );
}
