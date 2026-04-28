import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { SectionTabs } from "@/components/native/SectionTabs";
import { formHelperStyle, formSectionLabelStyle } from "@/components/native/form-sheet/Layout";
import type { Goal, Task } from "@/types";

import { MONTH_DAYS, type ReminderMode, WEEK_DAYS } from "./constants";

export function ReminderModeSection(props: { mode: ReminderMode; onChange: (value: ReminderMode) => void }) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("common.mode")}</Text>
      <SectionTabs
        tabs={[{ key: "week", label: t("reminders.dialog.mode_week") }, { key: "month", label: t("reminders.dialog.mode_month") }]}
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
  const { t } = useTranslation();

  if (props.mode === "week") {
    return (
      <View style={{ gap: 8 }}>
        <Text style={formSectionLabelStyle}>{t("reminders.dialog.mode_week")}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {WEEK_DAYS.map((day) => (
            <ActionChip key={day.key} onPress={() => props.onToggleWeekDay(day.key)} tone={props.selectedDays.includes(day.key) ? "primary" : "secondary"}>
              {day.label}
            </ActionChip>
          ))}
        </View>
        <ActionChip onPress={props.onSelectAllWeek}>{t("common.every_day")}</ActionChip>
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("reminders.dialog.mode_month")}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {MONTH_DAYS.map((day) => (
          <ActionChip key={day} onPress={() => props.onToggleMonthDay(day)} tone={props.selectedDaysOfMonth.includes(day) ? "primary" : "secondary"}>
            {day}
          </ActionChip>
        ))}
      </View>
      <ActionChip onPress={props.onSelectAllMonth}>{t("common.every_month_day")}</ActionChip>
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
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("reminders.dialog.bind_goal")}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <ActionChip
          onPress={() => {
            props.onChangeGoalId(props.initialGoalId);
            props.onResetTask();
          }}
          tone={!props.goalId ? "primary" : "secondary"}
        >
          {t("reminders.dialog.goal_none")}
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
  const { t } = useTranslation();

  if (!props.visible) {
    return null;
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("reminders.dialog.bind_task")}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <ActionChip onPress={() => props.onChangeTaskId(undefined)} tone={!props.taskId ? "primary" : "secondary"}>
          {t("reminders.dialog.task_none")}
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
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("common.status")}</Text>
      <SectionTabs
        tabs={[{ key: "active", label: t("reminders.status_active") }, { key: "paused", label: t("reminders.status_disabled") }]}
        activeTab={props.isActive ? "active" : "paused"}
        onChange={(tab) => props.onChange(tab === "active")}
      />
    </View>
  );
}

export function EmptyTasksHint() {
  const { t } = useTranslation();
  return <Text style={formHelperStyle}>{t("reminders.no_tasks_hint")}</Text>;
}

