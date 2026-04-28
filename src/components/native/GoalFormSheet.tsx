import { useEffect, useMemo, useState } from "react";
import { Alert, Modal, ScrollView, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import { appPalette } from "@/theme/palette";
import type { CategoryOption, Goal, GoalFormData, GoalPeriod, GoalType, Reward, Task } from "@/types";

function createTask(title: string): Task {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    lastCompletedAt: "",
    parentId: null,
    subtasks: [],
  };
}

export function GoalFormSheet({
  open,
  goal,
  categories,
  rewards,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean;
  goal?: Goal;
  categories: CategoryOption[];
  rewards: Reward[];
  onOpenChange: (open: boolean) => void;
  onSave: (data: GoalFormData) => Promise<unknown>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]?.value ?? "personal");
  const [goalType, setGoalType] = useState<GoalType>("TASK");
  const [goalPeriod, setGoalPeriod] = useState<GoalPeriod>("NONE");
  const [dueDate, setDueDate] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeRewardId = useMemo(() => {
    if (!goal) {
      return selectedRewardId;
    }

    return selectedRewardId ?? rewards.find((reward) => reward.goalId === goal.id)?.id ?? null;
  }, [goal, rewards, selectedRewardId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description ?? "");
      setCategory(goal.category);
      setGoalType(goal.goalType);
      setGoalPeriod(goal.goalPeriod);
      setDueDate(goal.dueDate ?? "");
      setCurrentValue(goal.currentValue?.toString() ?? "");
      setTargetValue(goal.targetValue?.toString() ?? "");
      setTasks(goal.tasks ?? []);
      setSelectedRewardId(rewards.find((reward) => reward.goalId === goal.id)?.id ?? null);
      return;
    }

    setTitle("");
    setDescription("");
    setCategory(categories[0]?.value ?? "personal");
    setGoalType("TASK");
    setGoalPeriod("NONE");
    setDueDate("");
    setCurrentValue("");
    setTargetValue("");
    setTasks([]);
    setNewTaskTitle("");
    setSelectedRewardId(null);
  }, [open, goal, categories, rewards]);

  const addTask = () => {
    const nextTitle = newTaskTitle.trim();
    if (!nextTitle) {
      return;
    }

    setTasks((current) => [...current, createTask(nextTitle)]);
    setNewTaskTitle("");
  };

  const removeTask = (taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Нужно название", "Укажи название цели.");
      return;
    }

    if (goalType === "TASK" && tasks.length === 0) {
      Alert.alert("Добавь задачу", "Для task-цели нужна хотя бы одна задача.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        id: goal?.id ?? `${Date.now()}`,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        tasks: goalType === "TASK" ? tasks : [],
        dueDate: dueDate.trim() || undefined,
        lastCompletedAt: goal?.lastCompletedAt,
        xpReward: goal?.xpReward,
        currentValue: goalType === "PROGRESS" && currentValue ? Number(currentValue) : undefined,
        targetValue: goalType === "PROGRESS" && targetValue ? Number(targetValue) : undefined,
        goalType,
        goalPeriod,
        rewardId: activeRewardId,
        challenge: goal?.challenge,
        challengeId: goal?.challengeId,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!goal) {
      return;
    }

    Alert.alert("Удалить цель?", "Это действие нельзя быстро отменить.", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => {
          void onDelete(goal.id).then((ok) => {
            if (ok) {
              onOpenChange(false);
            }
          });
        },
      },
    ]);
  };

  const sectionLabelStyle = { fontSize: 14, fontWeight: "600" as const, color: appPalette.semantic.text, fontFamily: "Montserrat" };
  const helperStyle = { color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "flex-end" }}>
        <View style={{ maxHeight: "90%", backgroundColor: appPalette.surface.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 14 }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>
              {goal ? "Редактировать цель" : "Новая цель"}
            </Text>
            <Text style={helperStyle}>Базовая mobile-форма поверх общего goal screen layer.</Text>
          </View>

          <ScrollView contentContainerStyle={{ gap: 14 }}>
            <FieldInput label="Название" value={title} onChangeText={setTitle} placeholder="Например, 12 книг за год" />
            <FieldInput label="Описание" value={description} onChangeText={setDescription} placeholder="Коротко опиши цель" />

            <View style={{ gap: 8 }}>
              <Text style={sectionLabelStyle}>Тип цели</Text>
              <SectionTabs tabs={[{ key: "TASK", label: "Задачи" }, { key: "PROGRESS", label: "Число" }]} activeTab={goalType} onChange={setGoalType} />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={sectionLabelStyle}>Период</Text>
              <SectionTabs tabs={[{ key: "NONE", label: "Без повтора" }, { key: "DAILY", label: "День" }, { key: "WEEKLY", label: "Неделя" }, { key: "MONTHLY", label: "Месяц" }]} activeTab={goalPeriod} onChange={setGoalPeriod} />
            </View>

            <FieldInput label="Срок (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} placeholder="2026-05-01" />

            <View style={{ gap: 8 }}>
              <Text style={sectionLabelStyle}>Категория</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {categories.map((item) => (
                  <ActionChip key={item.value} onPress={() => setCategory(item.value)} tone={category === item.value ? "primary" : "secondary"}>
                    {item.label}
                  </ActionChip>
                ))}
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={sectionLabelStyle}>Награда</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                <ActionChip onPress={() => setSelectedRewardId(null)} tone={activeRewardId ? "secondary" : "primary"}>Без награды</ActionChip>
                {rewards.map((reward) => (
                  <ActionChip key={reward.id} onPress={() => setSelectedRewardId(reward.id)} tone={activeRewardId === reward.id ? "primary" : "secondary"}>
                    {reward.title}
                  </ActionChip>
                ))}
              </View>
            </View>

            {goalType === "PROGRESS" ? (
              <View style={{ gap: 12 }}>
                <FieldInput label="Текущий прогресс" value={currentValue} onChangeText={setCurrentValue} placeholder="0" />
                <FieldInput label="Целевое значение" value={targetValue} onChangeText={setTargetValue} placeholder="100" />
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                <Text style={sectionLabelStyle}>Задачи</Text>

                {tasks.length === 0 ? (
                  <Text style={helperStyle}>Пока нет задач. Добавь первую ниже.</Text>
                ) : (
                  tasks.map((task) => (
                    <View key={task.id} style={{ borderWidth: 1, borderColor: appPalette.semantic.borderSubtle, borderRadius: 14, padding: 12, gap: 8, backgroundColor: appPalette.semantic.neutralSurfaceStrong }}>
                      <Text style={{ color: appPalette.semantic.textStrong, fontWeight: "600", fontFamily: "Montserrat" }}>{task.title}</Text>
                      <ActionChip onPress={() => removeTask(task.id)} tone="danger">Удалить задачу</ActionChip>
                    </View>
                  ))
                )}

                <FieldInput label="Новая задача" value={newTaskTitle} onChangeText={setNewTaskTitle} placeholder="Например, читать 20 минут" />
                <ActionChip onPress={addTask} tone="primary">Добавить задачу</ActionChip>
              </View>
            )}
          </ScrollView>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {!!goal && <ActionChip onPress={handleDelete} tone="danger">Удалить</ActionChip>}
            <ActionChip onPress={() => onOpenChange(false)}>Отмена</ActionChip>
            <ActionChip onPress={() => void handleSave()} tone="primary">{isSubmitting ? "Сохраняем..." : goal ? "Сохранить" : "Создать"}</ActionChip>
          </View>
        </View>
      </View>
    </Modal>
  );
}
