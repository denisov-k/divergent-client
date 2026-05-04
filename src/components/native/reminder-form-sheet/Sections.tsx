import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { ChevronDown } from "@/components/native/Icons";
import { SectionTabs } from "@/components/native/SectionTabs";
import { formHelperStyle, formSectionLabelStyle } from "@/components/native/form-sheet/Layout";
import { appPalette } from "@/theme/palette";
import type { Goal, Task } from "@/types";

import { MONTH_DAYS, type ReminderMode, WEEK_DAYS } from "./constants";

function PickerTrigger(props: { value: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        borderWidth: 1,
        borderColor: appPalette.semantic.borderStrong,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: appPalette.surface.background,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <Text
        style={{
          color: props.value ? appPalette.semantic.textStrong : appPalette.semantic.textSubtle,
          fontFamily: "Montserrat",
          fontSize: 14,
          lineHeight: 20,
          flex: 1,
        }}
        numberOfLines={1}
      >
        {props.value}
      </Text>
      <ChevronDown size={16} color={appPalette.semantic.textSubtle} />
    </Pressable>
  );
}

function GoalPickerModal(props: {
  open: boolean;
  goals: Goal[];
  goalId?: string;
  onClose: () => void;
  onSelect: (goalId: string | undefined) => void;
}) {
  const { t } = useTranslation();

  return (
    <Modal visible={props.open} transparent animationType="none" onRequestClose={props.onClose}>
      <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "center", padding: 20 }}>
        <View
          style={{
            backgroundColor: appPalette.surface.background,
            borderRadius: 20,
            padding: 16,
            gap: 12,
            maxHeight: "80%",
          }}
        >
          <Text style={{ color: appPalette.semantic.textStrong, fontSize: 18, fontWeight: "600", fontFamily: "Montserrat" }}>
            {t("reminders.dialog.bind_goal")}
          </Text>
          <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
            <Pressable
              onPress={() => {
                props.onSelect(undefined);
                props.onClose();
              }}
              style={{
                borderWidth: 1,
                borderColor: !props.goalId ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
                backgroundColor: !props.goalId ? appPalette.semantic.infoSurface : appPalette.surface.background,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  color: !props.goalId ? appPalette.semantic.infoText : appPalette.semantic.textStrong,
                  fontFamily: "Montserrat",
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                {t("reminders.dialog.goal_none")}
              </Text>
            </Pressable>
            {props.goals.map((goal) => {
              const active = props.goalId === goal.id;

              return (
                <Pressable
                  key={goal.id}
                  onPress={() => {
                    props.onSelect(goal.id);
                    props.onClose();
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: active ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
                    backgroundColor: active ? appPalette.semantic.infoSurface : appPalette.surface.background,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      color: active ? appPalette.semantic.infoText : appPalette.semantic.textStrong,
                      fontFamily: "Montserrat",
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    {goal.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <ActionChip onPress={props.onClose}>{t("common.close")}</ActionChip>
        </View>
      </View>
    </Modal>
  );
}

function TaskPickerModal(props: {
  open: boolean;
  tasks: Task[];
  taskId?: string;
  onClose: () => void;
  onSelect: (taskId: string | undefined) => void;
}) {
  const { t } = useTranslation();

  return (
    <Modal visible={props.open} transparent animationType="none" onRequestClose={props.onClose}>
      <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "center", padding: 20 }}>
        <View
          style={{
            backgroundColor: appPalette.surface.background,
            borderRadius: 20,
            padding: 16,
            gap: 12,
            maxHeight: "80%",
          }}
        >
          <Text style={{ color: appPalette.semantic.textStrong, fontSize: 18, fontWeight: "600", fontFamily: "Montserrat" }}>
            {t("reminders.dialog.bind_task")}
          </Text>
          <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
            <Pressable
              onPress={() => {
                props.onSelect(undefined);
                props.onClose();
              }}
              style={{
                borderWidth: 1,
                borderColor: !props.taskId ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
                backgroundColor: !props.taskId ? appPalette.semantic.infoSurface : appPalette.surface.background,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  color: !props.taskId ? appPalette.semantic.infoText : appPalette.semantic.textStrong,
                  fontFamily: "Montserrat",
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                {t("reminders.dialog.task_none")}
              </Text>
            </Pressable>
            {props.tasks.map((task) => {
              const active = props.taskId === task.id;

              return (
                <Pressable
                  key={task.id}
                  onPress={() => {
                    props.onSelect(task.id);
                    props.onClose();
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: active ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
                    backgroundColor: active ? appPalette.semantic.infoSurface : appPalette.surface.background,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      color: active ? appPalette.semantic.infoText : appPalette.semantic.textStrong,
                      fontFamily: "Montserrat",
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    {task.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <ActionChip onPress={props.onClose}>{t("common.close")}</ActionChip>
        </View>
      </View>
    </Modal>
  );
}

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
  const weekDayLabels = useMemo(
    () =>
      WEEK_DAYS.map((day) => ({
        ...day,
        label: t(`weekdays.${day.key}`),
      })),
    [t],
  );

  if (props.mode === "week") {
    return (
      <View style={{ gap: 8 }}>
        <Text style={formSectionLabelStyle}>{t("reminders.dialog.mode_week")}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {weekDayLabels.map((day) => (
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
  onChangeGoalId: (goalId: string | undefined) => void;
  onResetTask: () => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selectedGoalTitle = useMemo(
    () => props.goals.find((goal) => goal.id === props.goalId)?.title ?? t("reminders.dialog.goal_none"),
    [props.goals, props.goalId, t],
  );

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("reminders.dialog.bind_goal")}</Text>
      <PickerTrigger value={selectedGoalTitle} onPress={() => setOpen(true)} />
      <GoalPickerModal
        open={open}
        goals={props.goals}
        goalId={props.goalId}
        onClose={() => setOpen(false)}
        onSelect={(nextGoalId) => {
          props.onChangeGoalId(nextGoalId);
          props.onResetTask();
        }}
      />
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
  const [open, setOpen] = useState(false);
  const selectedTaskTitle = useMemo(
    () => props.availableTasks.find((task) => task.id === props.taskId)?.title ?? t("reminders.dialog.task_none"),
    [props.availableTasks, props.taskId, t],
  );

  if (!props.visible) {
    return null;
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("reminders.dialog.bind_task")}</Text>
      <PickerTrigger value={selectedTaskTitle} onPress={() => setOpen(true)} />
      <TaskPickerModal
        open={open}
        tasks={props.availableTasks}
        taskId={props.taskId}
        onClose={() => setOpen(false)}
        onSelect={props.onChangeTaskId}
      />
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

