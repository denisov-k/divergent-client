import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { formatReminderDayLabel } from "@/shared/display/reminders";
import { appPalette } from "@/theme/palette";

export function useReminderDayFormatter() {
  const { t } = useTranslation();

  return (day: string) => formatReminderDayLabel(day, t);
}

export function ReminderBadge({
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
      <Text style={{ color: palette.color, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat", flexShrink: 1 }}>{children}</Text>
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

export function ReminderAction({ icon, onPress }: { icon: React.ReactNode; onPress?: () => void }) {
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

export function ReminderSwitch({ checked, onPress }: { checked: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 36,
        height: 20,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: checked ? appPalette.brand.primary : appPalette.semantic.borderStrong,
        backgroundColor: checked ? appPalette.brand.primary : appPalette.surface.background,
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
