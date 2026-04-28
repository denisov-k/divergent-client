import { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { FormSheetLayout } from "@/components/native/form-sheet/Layout";
import {
  EmptyTasksHint,
  ReminderGoalSection,
  ReminderModeSection,
  ReminderScheduleSection,
  ReminderStateSection,
  ReminderTaskSection,
} from "@/components/native/reminder-form-sheet/Sections";
import { MONTH_DAYS, type ReminderMode, WEEK_DAYS } from "@/components/native/reminder-form-sheet/constants";
import type { Goal, Reminder } from "@/types";

export function ReminderFormSheet({
  open,
  reminder,
  goals,
  onOpenChange,
  onSave,
  onDelete,
  initialGoalId,
}: {
  open: boolean;
  reminder?: Reminder;
  goals: Goal[];
  onOpenChange: (open: boolean) => void;
  onSave: (reminder: Reminder) => Promise<unknown>;
  onDelete: (id: string) => Promise<boolean>;
  initialGoalId?: string;
}) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [mode, setMode] = useState<ReminderMode>("week");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<number[]>([]);
  const [goalId, setGoalId] = useState<string | undefined>(undefined);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (reminder) {
      setTitle(reminder.title);
      setTime(reminder.time);
      setMode(reminder.daysOfMonth.length ? "month" : "week");
      setSelectedDays(reminder.daysOfWeek);
      setSelectedDaysOfMonth(reminder.daysOfMonth);
      setGoalId(reminder.goalId);
      setTaskId(reminder.taskId);
      setIsActive(reminder.isActive);
      return;
    }

    setTitle("");
    setTime("09:00");
    setMode("week");
    setSelectedDays([]);
    setSelectedDaysOfMonth([]);
    setGoalId(initialGoalId);
    setTaskId(undefined);
    setIsActive(true);
  }, [open, reminder, initialGoalId]);

  const selectedGoal = useMemo(() => goals.find((goal) => goal.id === goalId), [goals, goalId]);
  const availableTasks = selectedGoal?.tasks ?? [];

  const toggleWeekDay = (key: string) => {
    setSelectedDays((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  const toggleMonthDay = (value: number) => {
    setSelectedDaysOfMonth((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Нужно название", "Укажи название напоминания.");
      return;
    }

    if (mode === "week" && selectedDays.length === 0) {
      Alert.alert("Выбери дни", "Добавь хотя бы один день недели.");
      return;
    }

    if (mode === "month" && selectedDaysOfMonth.length === 0) {
      Alert.alert("Выбери даты", "Добавь хотя бы одно число месяца.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        id: reminder?.id ?? `${Date.now()}`,
        title: title.trim(),
        time,
        daysOfWeek: mode === "week" ? selectedDays : [],
        daysOfMonth: mode === "month" ? selectedDaysOfMonth : [],
        isActive,
        goalId,
        taskId,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!reminder) {
      return;
    }

    Alert.alert("Удалить напоминание?", "Оно исчезнет из текущего графика.", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => {
          void onDelete(reminder.id).then((ok) => {
            if (ok) {
              onOpenChange(false);
            }
          });
        },
      },
    ]);
  };

  return (
    <FormSheetLayout
      open={open}
      onOpenChange={onOpenChange}
      title={reminder ? "Редактировать напоминание" : "Новое напоминание"}
      subtitle="Полноценная mobile-форма для reminder flow."
      footer={
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {!!reminder && (
            <ActionChip onPress={handleDelete} tone="danger">
              Удалить
            </ActionChip>
          )}
          <ActionChip onPress={() => onOpenChange(false)}>Отмена</ActionChip>
          <ActionChip onPress={() => void handleSave()} tone="primary">
            {isSubmitting ? "Сохраняем..." : reminder ? "Сохранить" : "Создать"}
          </ActionChip>
        </View>
      }
    >
      <FieldInput label="Название" value={title} onChangeText={setTitle} placeholder="Например, утренняя зарядка" />
      <FieldInput label="Время" value={time} onChangeText={setTime} placeholder="09:00" />
      <ReminderModeSection mode={mode} onChange={setMode} />
      <ReminderScheduleSection
        mode={mode}
        selectedDays={selectedDays}
        selectedDaysOfMonth={selectedDaysOfMonth}
        onToggleWeekDay={toggleWeekDay}
        onToggleMonthDay={toggleMonthDay}
        onSelectAllWeek={() => setSelectedDays(WEEK_DAYS.map((day) => day.key))}
        onSelectAllMonth={() => setSelectedDaysOfMonth(MONTH_DAYS)}
      />
      <ReminderGoalSection
        goals={goals}
        goalId={goalId}
        initialGoalId={initialGoalId}
        onChangeGoalId={setGoalId}
        onResetTask={() => setTaskId(undefined)}
      />
      {goalId && availableTasks.length === 0 && <EmptyTasksHint />}
      <ReminderTaskSection visible={!!goalId && availableTasks.length > 0} availableTasks={availableTasks} taskId={taskId} onChangeTaskId={setTaskId} />
      <ReminderStateSection isActive={isActive} onChange={setIsActive} />
    </FormSheetLayout>
  );
}
