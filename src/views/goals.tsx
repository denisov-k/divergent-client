import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalDialog, type Goal } from "@/components/GoalDialog";
import { GoalCard } from "@/components/GoalCard";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useAppStore } from "@/stores/useAppStore";
import {useState} from "react";

export default function Goals() {
  const {
    goals,
    addGoal,
    updateGoal,
    toggleTask,
    addXp,
  } = useAppStore();

  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  // ------------------------------
  // Сохранение цели
  // ------------------------------
  const handleSaveGoal = (goal: Goal) => {
    if (editingGoal) {
      updateGoal(goal);
      toast.success("Цель обновлена");
    } else {
      addGoal(goal);
      toast.success("Цель создана");
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

  // ------------------------------
  // Переключить задачу
  // ------------------------------
  const handleTaskToggle = (goalId: string, taskId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const task = goal.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;

    // XP + Toast
    if (newCompleted) {
      addXp(task.xpReward || 0);
      toast.success(`+${task.xpReward} XP`);
    } else {
      addXp(-(task.xpReward || 0));
    }

    toggleTask(goalId, taskId);

    // Проверяем — цель выполнена?
    const updatedTasks = goal.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: newCompleted } : t
    );

    const allCompleted = updatedTasks.every((t) => t.completed);
    if (allCompleted && !goal.tasks.every((t) => t.completed)) {
      addXp(goal.xpReward ?? 0);
      toast.success(`🎉 Цель выполнена! +${goal.xpReward} XP`);
    }
  };

  return (
    <div className="flex flex-col px-2 flex-1">
      <div className="flex items-center justify-between py-2">
        <h2>Мои цели</h2>

        <Button
          onClick={() => {
            setEditingGoal(undefined);
            setGoalDialogOpen(true);
          }}
        >
          <Plus className="size-4 mr-2" />
          Создать цель
        </Button>
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
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-auto">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              {...goal}
              variant="detailed"
              onEdit={handleEditGoal}
              onTaskToggle={handleTaskToggle}
            />
          ))}
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
      />
    </div>
  );
}
