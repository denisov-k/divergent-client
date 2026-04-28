import { Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { SectionTabs } from "@/components/native/SectionTabs";
import { formHelperStyle, formSectionLabelStyle } from "@/components/native/form-sheet/Layout";
import type { Goal, Task } from "@/types";

import { MONTH_DAYS, type ReminderMode, WEEK_DAYS } from "./constants";

export function ReminderModeSection(props: { mode: ReminderMode; onChange: (value: ReminderMode) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Режим</Text>
      <SectionTabs
        tabs={[{ key: "week", label: "Дни недели" }, { key: "month", label: "Числа месяца" }]}
        activeTab={props.mode}
        onChange={(value) => props.onChange(value as ReminderMode)}
      />
    </View>
  );
}

export function ReminderScheduleSection(props: {
  mode: ReminderMode;
  selectedDays: string[];
  selectedDaysOfMonth: number[];
  onToggleWeekDay: (key: string) => void;
  onToggleMonthDay: (day: number) => void;
  onSelectAllWeek: () => void;
  onSelectAllMonth: () => void;
}) {
  if (props.mode === "week") {
    return (
      <View style={{ gap: 8 }}>
        <Text style={formSectionLabelStyle}>Дни недели</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {WEEK_DAYS.map((day) => (
            <ActionChip key={day.key} onPress={() => props.onToggleWeekDay(day.key)} tone={props.selectedDays.includes(day.key) ? "primary" : "secondary"}>
              {day.label}
            </ActionChip>
          ))}
        </View>
        <ActionChip onPress={props.onSelectAllWeek}>Каждый день</ActionChip>
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Числа месяца</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {MONTH_DAYS.map((day) => (
          <ActionChip key={day} onPress={() => props.onToggleMonthDay(day)} tone={props.selectedDaysOfMonth.includes(day) ? "primary" : "secondary"}>
            {day}
          </ActionChip>
        ))}
      </View>
      <ActionChip onPress={props.onSelectAllMonth}>Каждый день месяца</ActionChip>
    </View>
  );
}

export function ReminderGoalSection(props: {
  goals: Goal[];
  goalId?: string;
  initialGoalId?: string;
  onChangeGoalId: (goalId: string | undefined) => void;
  onResetTask: () => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Привязка к цели</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <ActionChip
          onPress={() => {
            props.onChangeGoalId(props.initialGoalId);
            props.onResetTask();
          }}
          tone={!props.goalId ? "primary" : "secondary"}
        >
          Без привязки
        </ActionChip>
        {props.goals.map((goal) => (
          <ActionChip
            key={goal.id}
            onPress={() => {
              props.onChangeGoalId(goal.id);
              props.onResetTask();
            }}
            tone={props.goalId === goal.id ? "primary" : "secondary"}
          >
            {goal.title}
          </ActionChip>
        ))}
      </View>
    </View>
  );
}

export function ReminderTaskSection(props: {
  visible: boolean;
  availableTasks: Task[];
  taskId?: string;
  onChangeTaskId: (taskId: string | undefined) => void;
}) {
  if (!props.visible) {
    return null;
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Привязка к задаче</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <ActionChip onPress={() => props.onChangeTaskId(undefined)} tone={!props.taskId ? "primary" : "secondary"}>
          Без задачи
        </ActionChip>
        {props.availableTasks.map((task) => (
          <ActionChip key={task.id} onPress={() => props.onChangeTaskId(task.id)} tone={props.taskId === task.id ? "primary" : "secondary"}>
            {task.title}
          </ActionChip>
        ))}
      </View>
    </View>
  );
}

export function ReminderStateSection(props: { isActive: boolean; onChange: (value: boolean) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Состояние</Text>
      <SectionTabs
        tabs={[{ key: "active", label: "Активно" }, { key: "paused", label: "Выключено" }]}
        activeTab={props.isActive ? "active" : "paused"}
        onChange={(tab) => props.onChange(tab === "active")}
      />
    </View>
  );
}

export function EmptyTasksHint() {
  return <Text style={formHelperStyle}>У выбранной цели пока нет задач для привязки.</Text>;
}
