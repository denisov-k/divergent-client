import { useState } from "react";

import { useAppStore } from "@/stores/useAppStore";
import type { Reminder } from "@/types";

type SaveReminderResult =
  | { status: "created"; reminderId: string }
  | { status: "updated"; reminderId: string };

export function useRemindersScreen() {
  const { reminders, goals, addReminder, updateReminder, toggleReminder, deleteReminder } = useAppStore();

  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);

  const openCreateReminder = () => {
    setEditingReminder(undefined);
    setReminderDialogOpen(true);
  };

  const openEditReminder = (id: string) => {
    const reminder = reminders.find((item) => item.id === id);
    if (!reminder) {
      return;
    }

    setEditingReminder(reminder);
    setReminderDialogOpen(true);
  };

  const saveReminder = async (reminder: Reminder): Promise<SaveReminderResult> => {
    if (editingReminder) {
      await updateReminder(reminder);
      setEditingReminder(undefined);
      return { status: "updated", reminderId: reminder.id };
    }

    await addReminder(reminder);
    setEditingReminder(undefined);
    return { status: "created", reminderId: reminder.id };
  };

  const toggleReminderState = async (id: string) => {
    await toggleReminder(id);
  };

  const removeReminder = async (id: string) => {
    const reminder = reminders.find((item) => item.id === id);
    if (!reminder) {
      return false;
    }

    await deleteReminder(reminder);
    setReminderDialogOpen(false);
    return true;
  };

  const closeReminderDialog = (open: boolean) => {
    setReminderDialogOpen(open);
    if (!open) {
      setEditingReminder(undefined);
    }
  };

  return {
    reminders,
    goals,
    reminderDialogOpen,
    editingReminder,
    setReminderDialogOpen,
    openCreateReminder,
    openEditReminder,
    saveReminder,
    toggleReminderState,
    removeReminder,
    closeReminderDialog,
  };
}
