import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { appPalette } from "@/theme/palette";

export function ScreenHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionTone = "primary",
  paddingHorizontal = 16,
  paddingVertical = 12,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: ReactNode;
  onAction?: () => void;
  actionTone?: "primary" | "secondary" | "success" | "danger";
  paddingHorizontal?: number;
  paddingVertical?: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        paddingHorizontal,
        paddingVertical,
        backgroundColor: appPalette.surface.background,
      }}
    >
      <View style={{ flex: 1, gap: subtitle ? 4 : 0 }}>
        <Text style={{ fontSize: 19, fontWeight: "500", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", lineHeight: 29 }}>{title}</Text>
        {!!subtitle && <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", fontFamily: "Montserrat", lineHeight: 18 }}>{subtitle}</Text>}
      </View>

      {!!actionLabel && onAction && (
        <ActionChip onPress={onAction} tone={actionTone}>
          {actionLabel}
        </ActionChip>
      )}
    </View>
  );
}
