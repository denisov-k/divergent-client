import { Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import { formHelperStyle, formSectionLabelStyle } from "@/components/native/form-sheet/Layout";
import { appPalette } from "@/theme/palette";
import type { CategoryOption, GoalPeriod, GoalType, Reward, Task } from "@/types";

export function GoalTypeSection(props: { goalType: GoalType; onChange: (value: GoalType) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Тип цели</Text>
      <SectionTabs
        tabs={[{ key: "TASK", label: "Задачи" }, { key: "PROGRESS", label: "Число" }]}
        activeTab={props.goalType}
        onChange={(value) => props.onChange(value as GoalType)}
      />
    </View>
  );
}

export function GoalPeriodSection(props: { goalPeriod: GoalPeriod; onChange: (value: GoalPeriod) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Период</Text>
      <SectionTabs
        tabs={[
          { key: "NONE", label: "Без повтора" },
          { key: "DAILY", label: "День" },
          { key: "WEEKLY", label: "Неделя" },
          { key: "MONTHLY", label: "Месяц" },
        ]}
        activeTab={props.goalPeriod}
        onChange={(value) => props.onChange(value as GoalPeriod)}
      />
    </View>
  );
}

export function CategorySection(props: {
  categories: CategoryOption[];
  category: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Категория</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {props.categories.map((item) => (
          <ActionChip key={item.value} onPress={() => props.onChange(item.value)} tone={props.category === item.value ? "primary" : "secondary"}>
            {item.label}
          </ActionChip>
        ))}
      </View>
    </View>
  );
}

export function RewardSection(props: {
  rewards: Reward[];
  activeRewardId: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Награда</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <ActionChip onPress={() => props.onChange(null)} tone={props.activeRewardId ? "secondary" : "primary"}>
          Без награды
        </ActionChip>
        {props.rewards.map((reward) => (
          <ActionChip key={reward.id} onPress={() => props.onChange(reward.id)} tone={props.activeRewardId === reward.id ? "primary" : "secondary"}>
            {reward.title}
          </ActionChip>
        ))}
      </View>
    </View>
  );
}

export function ProgressFieldsSection(props: {
  currentValue: string;
  targetValue: string;
  onChangeCurrentValue: (value: string) => void;
  onChangeTargetValue: (value: string) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <FieldInput label="Текущий прогресс" value={props.currentValue} onChangeText={props.onChangeCurrentValue} placeholder="0" />
      <FieldInput label="Целевое значение" value={props.targetValue} onChangeText={props.onChangeTargetValue} placeholder="100" />
    </View>
  );
}

export function TasksSection(props: {
  tasks: Task[];
  newTaskTitle: string;
  onChangeNewTaskTitle: (value: string) => void;
  onAddTask: () => void;
  onRemoveTask: (taskId: string) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={formSectionLabelStyle}>Задачи</Text>

      {props.tasks.length === 0 ? (
        <Text style={formHelperStyle}>Пока нет задач. Добавь первую ниже.</Text>
      ) : (
        props.tasks.map((task) => (
          <View
            key={task.id}
            style={{
              borderWidth: 1,
              borderColor: appPalette.semantic.borderSubtle,
              borderRadius: 14,
              padding: 12,
              gap: 8,
              backgroundColor: appPalette.semantic.neutralSurfaceStrong,
            }}
          >
            <Text style={{ color: appPalette.semantic.textStrong, fontWeight: "600", fontFamily: "Montserrat" }}>{task.title}</Text>
            <ActionChip onPress={() => props.onRemoveTask(task.id)} tone="danger">
              Удалить задачу
            </ActionChip>
          </View>
        ))
      )}

      <FieldInput label="Новая задача" value={props.newTaskTitle} onChangeText={props.onChangeNewTaskTitle} placeholder="Например, читать 20 минут" />
      <ActionChip onPress={props.onAddTask} tone="primary">
        Добавить задачу
      </ActionChip>
    </View>
  );
}
