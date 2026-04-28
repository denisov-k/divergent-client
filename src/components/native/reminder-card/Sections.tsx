import { Linking, Text, View } from "react-native";

import { buildGoalsPath } from "@/app/routes";
import { Bell, CircleCheck, Clock, Edit, Repeat, Target } from "@/components/native/icons";
import { buildNativeRouteUrl } from "@/platform/appUrl.native";
import { appPalette } from "@/theme/palette";
import type { Goal, Reminder, Task } from "@/types";

import { ReminderAction, ReminderBadge, ReminderSwitch, useReminderDayFormatter } from "./Primitives";

function openGoal(goalId?: string) {
  if (!goalId) {
    return;
  }

  void Linking.openURL(buildNativeRouteUrl(buildGoalsPath({ id: goalId })));
}

export function ReminderHeader({
  reminder,
  onToggle,
  onEdit,
}: {
  reminder: Reminder;
  onToggle?: () => void;
  onEdit?: (id: string) => void;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
      <View style={{ flex: 1, gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Bell size={20} color={reminder.isActive ? appPalette.brand.primary : appPalette.semantic.textSubtle} />
          <Text style={{ fontSize: 12, fontWeight: "500", color: appPalette.semantic.textStrong, flex: 1, fontFamily: "Montserrat", lineHeight: 12 }}>
            {reminder.title}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Clock size={14} color={appPalette.semantic.textSubtle} />
          <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>
            {reminder.time}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <ReminderSwitch checked={reminder.isActive} onPress={onToggle} />
        {!!onEdit && <ReminderAction icon={<Edit size={14} color={appPalette.semantic.textMuted} />} onPress={() => onEdit(reminder.id)} />}
      </View>
    </View>
  );
}

export function ReminderRepeatSection({
  reminder,
}: {
  reminder: Reminder;
}) {
  const formatReminderDayLabel = useReminderDayFormatter();
  const hasDays = reminder.daysOfWeek.length > 0;
  const hasDates = reminder.daysOfMonth.length > 0;

  if (!hasDays && !hasDates) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
      <Repeat size={14} color={appPalette.semantic.textSubtle} style={{ marginTop: 2 }} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, flex: 1 }}>
        {hasDays && reminder.daysOfWeek.map((day) => <ReminderBadge key={day}>{formatReminderDayLabel(day)}</ReminderBadge>)}
        {hasDates && [...reminder.daysOfMonth].sort((a, b) => a - b).map((day) => <ReminderBadge key={day}>{day}</ReminderBadge>)}
      </View>
    </View>
  );
}

export function ReminderLinksSection({
  goal,
  task,
}: {
  goal?: Goal;
  task?: Task;
}) {
  if (!goal && !task) {
    return null;
  }

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: appPalette.semantic.borderSubtle, paddingTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {!!goal && (
        <ReminderBadge tone="info" icon={<Target size={12} color={appPalette.semantic.infoText} />} onPress={() => openGoal(goal.id)}>
          {goal.title}
        </ReminderBadge>
      )}
      {!!goal && !!task && (
        <ReminderBadge tone="info" icon={<CircleCheck size={12} color={appPalette.semantic.infoText} />} onPress={() => openGoal(goal.id)}>
          {task.title}
        </ReminderBadge>
      )}
    </View>
  );
}

