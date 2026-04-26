import { useEffect, useMemo, useState } from "react";
import { Alert, Modal, ScrollView, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import type { Goal, Reminder } from "@/types";

const WEEK_DAYS = [
  { key: "mon", label: "Пн" },
  { key: "tue", label: "Вт" },
  { key: "wed", label: "Ср" },
  { key: "thu", label: "Чт" },
  { key: "fri", label: "Пт" },
  { key: "sat", label: "Сб" },
  { key: "sun", label: "Вс" },
] as const;

const MONTH_DAYS = Array.from({ length: 31 }, (_, index) => index + 1);

type ReminderMode = "week" | "month";

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
    setSelectedDays((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  const toggleMonthDay = (value: number) => {
    setSelectedDaysOfMonth((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
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
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.35)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            maxHeight: "90%",
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 14,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a" }}>
              {reminder ? "Редактировать напоминание" : "Новое напоминание"}
            </Text>
            <Text style={{ color: "#64748b" }}>Полноценная mobile-форма для reminder flow.</Text>
          </View>

          <ScrollView contentContainerStyle={{ gap: 14 }}>
            <FieldInput
              label="Название"
              value={title}
              onChangeText={setTitle}
              placeholder="Например, утренняя зарядка"
            />
            <FieldInput label="Время" value={time} onChangeText={setTime} placeholder="09:00" />

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Режим</Text>
              <SectionTabs
                tabs={[
                  { key: "week", label: "Дни недели" },
                  { key: "month", label: "Числа месяца" },
                ]}
                activeTab={mode}
                onChange={setMode}
              />
            </View>

            {mode === "week" ? (
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Дни недели</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {WEEK_DAYS.map((day) => (
                    <ActionChip
                      key={day.key}
                      onPress={() => toggleWeekDay(day.key)}
                      tone={selectedDays.includes(day.key) ? "primary" : "secondary"}
                    >
                      {day.label}
                    </ActionChip>
                  ))}
                </View>
                <ActionChip onPress={() => setSelectedDays(WEEK_DAYS.map((day) => day.key))}>Каждый день</ActionChip>
              </View>
            ) : (
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Числа месяца</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {MONTH_DAYS.map((day) => (
                    <ActionChip
                      key={day}
                      onPress={() => toggleMonthDay(day)}
                      tone={selectedDaysOfMonth.includes(day) ? "primary" : "secondary"}
                    >
                      {day}
                    </ActionChip>
                  ))}
                </View>
                <ActionChip onPress={() => setSelectedDaysOfMonth(MONTH_DAYS)}>Каждый день месяца</ActionChip>
              </View>
            )}

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Привязка к цели</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                <ActionChip onPress={() => { setGoalId(initialGoalId); setTaskId(undefined); }} tone={!goalId ? "primary" : "secondary"}>
                  Без привязки
                </ActionChip>
                {goals.map((goal) => (
                  <ActionChip
                    key={goal.id}
                    onPress={() => { setGoalId(goal.id); setTaskId(undefined); }}
                    tone={goalId === goal.id ? "primary" : "secondary"}
                  >
                    {goal.title}
                  </ActionChip>
                ))}
              </View>
            </View>

            {!!goalId && availableTasks.length > 0 && (
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Привязка к задаче</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  <ActionChip onPress={() => setTaskId(undefined)} tone={!taskId ? "primary" : "secondary"}>
                    Без задачи
                  </ActionChip>
                  {availableTasks.map((task) => (
                    <ActionChip
                      key={task.id}
                      onPress={() => setTaskId(task.id)}
                      tone={taskId === task.id ? "primary" : "secondary"}
                    >
                      {task.title}
                    </ActionChip>
                  ))}
                </View>
              </View>
            )}

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Состояние</Text>
              <SectionTabs
                tabs={[
                  { key: "active", label: "Активно" },
                  { key: "paused", label: "Выключено" },
                ]}
                activeTab={isActive ? "active" : "paused"}
                onChange={(tab) => setIsActive(tab === "active")}
              />
            </View>
          </ScrollView>

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
        </View>
      </View>
    </Modal>
  );
}

