import { Linking, Pressable, Text, View } from "react-native";

import { buildGoalsPath } from "@/app/routes";
import { Bell, CircleCheck, Clock, Edit, Repeat, Target } from "@/components/native/icons";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";
import { buildNativeRouteUrl } from "@/platform/appUrl.native";
import type { Goal, Reminder, Task } from "@/types";

const DAY_LABEL_MAP: Record<string, string> = {
  mon: "Пн",
  tue: "Вт",
  wed: "Ср",
  thu: "Чт",
  fri: "Пт",
  sat: "Сб",
  sun: "Вс",
  "1": "Пн",
  "2": "Вт",
  "3": "Ср",
  "4": "Чт",
  "5": "Пт",
  "6": "Сб",
  "7": "Вс",
};

function formatReminderDayLabel(day: string) {
  return DAY_LABEL_MAP[String(day).toLowerCase()] ?? day;
}

function SmallBadge({
  children,
  tone = "neutral",
  icon,
  onPress,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "info";
  icon?: React.ReactNode;
  onPress?: () => void;
}) {
  const palette = {
    neutral: { backgroundColor: appPalette.semantic.neutralSurfaceStrong, color: appPalette.semantic.neutralText, borderColor: appPalette.semantic.borderSubtle },
    info: { backgroundColor: appPalette.semantic.infoSurface, color: appPalette.semantic.infoText, borderColor: appPalette.categories.work.border },
  }[tone];

  const content = (
    <View
      style={{
        alignSelf: "flex-start",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: palette.borderColor,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: palette.backgroundColor,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      {icon ? <View style={{ width: 12, height: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</View> : null}
      <Text style={{ color: palette.color, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat", flexShrink: 1 }}>
        {children}
      </Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} hitSlop={6}>
      {content}
    </Pressable>
  );
}

function SmallAction({ icon, onPress }: { icon: React.ReactNode; onPress?: () => void }) {
  if (!onPress) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Pressable>
  );
}

function ReminderSwitch({ checked, onPress }: { checked: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 36,
        height: 20,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: checked ? appPalette.brand.primaryStrong : appPalette.semantic.borderStrong,
        backgroundColor: checked ? appPalette.brand.primaryStrong : appPalette.surface.background,
        padding: 2,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          backgroundColor: appPalette.surface.background,
          alignSelf: checked ? "flex-end" : "flex-start",
        }}
      />
    </Pressable>
  );
}

function openGoal(goalId?: string) {
  if (!goalId) {
    return;
  }

  void Linking.openURL(buildNativeRouteUrl(buildGoalsPath({ id: goalId })));
}

export function NativeReminderCard({
  reminder,
  goal,
  task,
  onToggle,
  onEdit,
}: {
  reminder: Reminder;
  goal?: Goal;
  task?: Task;
  onToggle?: () => void;
  onEdit?: (id: string) => void;
}) {
  const hasDays = reminder.daysOfWeek.length > 0;
  const hasDates = reminder.daysOfMonth.length > 0;

  return (
    <SurfaceCard gap={12} padding={24} radius={12}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
        <View style={{ flex: 1, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Bell size={20} color={reminder.isActive ? appPalette.brand.primaryStrong : appPalette.semantic.textSubtle} />
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
          {!!onEdit && <SmallAction icon={<Edit size={14} color={appPalette.semantic.textMuted} />} onPress={() => onEdit(reminder.id)} />}
        </View>
      </View>

      {(hasDays || hasDates) && (
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
          <Repeat size={14} color={appPalette.semantic.textSubtle} style={{ marginTop: 2 }} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, flex: 1 }}>
            {hasDays && reminder.daysOfWeek.map((day) => <SmallBadge key={day}>{formatReminderDayLabel(day)}</SmallBadge>)}
            {hasDates && [...reminder.daysOfMonth].sort((a, b) => a - b).map((day) => <SmallBadge key={day}>{day}</SmallBadge>)}
          </View>
        </View>
      )}

      {(goal || task) && (
        <View style={{ borderTopWidth: 1, borderTopColor: appPalette.semantic.borderSubtle, paddingTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {!!goal && (
            <SmallBadge tone="info" icon={<Target size={12} color={appPalette.semantic.infoText} />} onPress={() => openGoal(goal.id)}>
              {goal.title}
            </SmallBadge>
          )}
          {!!goal && !!task && (
            <SmallBadge tone="info" icon={<CircleCheck size={12} color={appPalette.semantic.infoText} />} onPress={() => openGoal(goal.id)}>
              {task.title}
            </SmallBadge>
          )}
        </View>
      )}
    </SurfaceCard>
  );
}


