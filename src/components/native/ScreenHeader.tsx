import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";

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
        backgroundColor: "#ffffff",
      }}
    >
      <View style={{ flex: 1, gap: subtitle ? 4 : 0 }}>
        <Text style={{ fontSize: 19, fontWeight: "500", color: "#0f172a", fontFamily: "Montserrat", lineHeight: 29 }}>{title}</Text>
        {!!subtitle && <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "400", fontFamily: "Montserrat", lineHeight: 18 }}>{subtitle}</Text>}
      </View>

      {!!actionLabel && onAction && (
        <ActionChip onPress={onAction} tone={actionTone}>
          {actionLabel}
        </ActionChip>
      )}
    </View>
  );
}
