import { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { FormSheetLayout } from "@/components/native/form-sheet/Layout";
import {
  CategorySection,
  GoalPeriodSection,
  GoalTypeSection,
  ProgressFieldsSection,
  RewardSection,
  TasksSection,
} from "@/components/native/goal-form-sheet/Sections";
import { createTask } from "@/components/native/goal-form-sheet/helpers";
import type { CategoryOption, Goal, GoalFormData, GoalPeriod, GoalType, Reward, Task } from "@/types";

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

  return (
    <FormSheetLayout
      open={open}
      onOpenChange={onOpenChange}
      title={goal ? "Редактировать цель" : "Новая цель"}
      subtitle="Базовая mobile-форма поверх общего goal screen layer."
      footer={
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {!!goal && (
            <ActionChip onPress={handleDelete} tone="danger">
              Удалить
            </ActionChip>
          )}
          <ActionChip onPress={() => onOpenChange(false)}>Отмена</ActionChip>
          <ActionChip onPress={() => void handleSave()} tone="primary">
            {isSubmitting ? "Сохраняем..." : goal ? "Сохранить" : "Создать"}
          </ActionChip>
        </View>
      }
    >
      <FieldInput label="Название" value={title} onChangeText={setTitle} placeholder="Например, 12 книг за год" />
      <FieldInput label="Описание" value={description} onChangeText={setDescription} placeholder="Коротко опиши цель" />
      <GoalTypeSection goalType={goalType} onChange={setGoalType} />
      <GoalPeriodSection goalPeriod={goalPeriod} onChange={setGoalPeriod} />
      <FieldInput label="Срок (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} placeholder="2026-05-01" />
      <CategorySection categories={categories} category={category} onChange={setCategory} />
      <RewardSection rewards={rewards} activeRewardId={activeRewardId} onChange={setSelectedRewardId} />
      {goalType === "PROGRESS" ? (
        <ProgressFieldsSection
          currentValue={currentValue}
          targetValue={targetValue}
          onChangeCurrentValue={setCurrentValue}
          onChangeTargetValue={setTargetValue}
        />
      ) : (
        <TasksSection
          tasks={tasks}
          newTaskTitle={newTaskTitle}
          onChangeNewTaskTitle={setNewTaskTitle}
          onAddTask={addTask}
          onRemoveTask={removeTask}
        />
      )}
    </FormSheetLayout>
  );
}
