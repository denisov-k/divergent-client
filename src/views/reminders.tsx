import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReminderCard } from "@/components/ReminderCard";
import { ReminderDialog } from "@/components/ReminderDialog";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {Reminder} from "@/types";

import { useAppStore } from "@/stores/useAppStore";

export default function Reminders() {
  const { reminders, goals, addReminder, updateReminder, toggleReminder, deleteReminder } = useAppStore();

  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);

  // ------------------------------
  // Сохранение напоминания
  // ------------------------------
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
  // Редактирование напоминания
  // ------------------------------
  const handleEditReminder = (id: string) => {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      setEditingReminder(reminder);
      setReminderDialogOpen(true);
    }
  };

  // ------------------------------
  // Переключение активности
  // ------------------------------
  const handleToggleReminder = (id: string) => {
    toggleReminder(id);
  };

  // ------------------------------
  // Получение связанных целей и задач
  // ------------------------------
  const getReminderDetails = (reminder: Reminder) => {
    const goal = goals.find((g) => g.id === reminder.goalId);
    const task = goal?.tasks.find((t) => t.id === reminder.taskId);
    return {
      goalTitle: goal?.title,
      taskTitle: task?.title,
    };
  };

  const handleDeleteReminder = async (id: string) => {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      await deleteReminder(reminder);
      setReminderDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 px-2">
      <div className="flex items-center justify-between py-2">
        <h2>Напоминания</h2>
        <Button
          onClick={() => {
            setEditingReminder(undefined);
            setReminderDialogOpen(true);
          }}
        >
          <Plus className="size-4 mr-2" />
          Добавить напоминание
        </Button>
      </div>

      {reminders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">У вас пока нет напоминаний</p>
            <Button onClick={() => setReminderDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              Создать первое напоминание
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  overflow-auto">
          {reminders.map((reminder) => {
            const { goalTitle, taskTitle } = getReminderDetails(reminder);
            return (
              <ReminderCard
                key={reminder.id}
                {...reminder}
                goalTitle={goalTitle}
                taskTitle={taskTitle}
                onToggle={() => handleToggleReminder(reminder.id)}
                onEdit={handleEditReminder}
              />
            );
          })}
        </div>
      )}

      <ReminderDialog
        open={reminderDialogOpen}
        onOpenChange={(open) => {
          setReminderDialogOpen(open);
          if (!open) setEditingReminder(undefined);
        }}
        onSave={handleSaveReminder}
        onDelete={handleDeleteReminder}
        reminder={editingReminder}
        goals={goals}
      />
    </div>
  );
}
