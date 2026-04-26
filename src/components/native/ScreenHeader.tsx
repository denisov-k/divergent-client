import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";

export function ScreenHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionTone = "primary",
}: {
  title: string;
  subtitle?: string;
  actionLabel?: ReactNode;
  onAction?: () => void;
  actionTone?: "primary" | "secondary" | "success" | "danger";
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
      }}
    >
      <View style={{ flex: 1, gap: subtitle ? 4 : 0 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#0f172a" }}>{title}</Text>
        {!!subtitle && <Text style={{ color: "#64748b" }}>{subtitle}</Text>}
      </View>

      {!!actionLabel && onAction && (
        <ActionChip onPress={onAction} tone={actionTone}>
          {actionLabel}
        </ActionChip>
      )}
    </View>
  );
}
