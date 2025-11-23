import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalDialog, type Goal, type CategoryOption } from "@/components/GoalDialog";
import { GoalCard } from "@/components/GoalCard";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useAppStore } from "@/stores/useAppStore";
import {useState} from "react";
import {Reminder, ReminderDialog} from "@/components/ReminderDialog.tsx";

export default function Goals() {
  const {
    goals,
    addGoal,
    updateGoal,
    toggleTask,
    addXp,
    addReminder,
    updateReminder
  } = useAppStore();

  const [categories, setCategories] = useState<CategoryOption[]>([
    { value: "work", label: "Работа" },
    { value: "health", label: "Здоровье" },
    { value: "learning", label: "Обучение" },
    { value: "fitness", label: "Фитнес" },
    { value: "creative", label: "Творчество" },
    { value: "personal", label: "Личное" },
  ]);

  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);
  const [selectedGoalIdForReminder, setSelectedGoalIdForReminder] = useState<string | undefined>(undefined);

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

  const handleAddCategory = (category: CategoryOption) => {
    setCategories([...categories, category]);
    toast.success(`Категория "${category.label}" создана`);
  };

  const handleAddReminderFromGoal = (goalId: string) => {
    setSelectedGoalIdForReminder(goalId);
    setEditingReminder(undefined);
    setReminderDialogOpen(true);
  };

  const handleSaveReminder = (reminder: Reminder) => {
    if (editingReminder) {
      updateReminder(reminder);
      toast.success("Напоминание обновлено");
    } else {
      addReminder(reminder);
      toast.success("Напоминание создано");
    }
    setEditingReminder(undefined);
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
        <div className="flex flex-wrap gap-2 overflow-auto flex-1">
          {goals.map((goal) => (
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
                variant="detailed"
                onEdit={handleEditGoal}
                onTaskToggle={handleTaskToggle}
                onAddReminder={handleAddReminderFromGoal}
              />
            </div>
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
        categories={categories}
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
