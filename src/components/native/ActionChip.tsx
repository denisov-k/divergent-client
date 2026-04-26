import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";

type ActionChipTone = "primary" | "secondary" | "success" | "danger";

const toneStyles: Record<ActionChipTone, { backgroundColor: string; textColor: string; borderColor?: string }> = {
  primary: { backgroundColor: "#dbeafe", textColor: "#1d4ed8", borderColor: "#93c5fd" },
  secondary: { backgroundColor: "#f1f5f9", textColor: "#334155", borderColor: "#e2e8f0" },
  success: { backgroundColor: "#dcfce7", textColor: "#166534", borderColor: "#bbf7d0" },
  danger: { backgroundColor: "#fef2f2", textColor: "#b91c1c", borderColor: "#fecaca" },
};

export function ActionChip({
  children,
  onPress,
  tone = "secondary",
}: {
  children: ReactNode;
  onPress?: () => void;
  tone?: ActionChipTone;
}) {
  const palette = toneStyles[tone];

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: palette.backgroundColor,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: palette.borderColor ?? palette.backgroundColor,
      }}
    >
      <Text style={{ color: palette.textColor, fontWeight: "600" }}>{children}</Text>
    </Pressable>
  );
}
