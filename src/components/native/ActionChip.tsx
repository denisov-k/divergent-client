import type { ReactNode } from "react";
import { Text } from "react-native";
import { HapticPressable as Pressable } from "@/components/native/HapticPressable";

import { appPalette } from "@/theme/palette";

type ActionChipTone = "primary" | "secondary" | "success" | "danger";

const toneStyles: Record<ActionChipTone, { backgroundColor: string; textColor: string; borderColor?: string }> = {
  primary: {
    backgroundColor: appPalette.semantic.infoSurface,
    textColor: appPalette.semantic.infoText,
    borderColor: appPalette.semantic.infoBorder,
  },
  secondary: {
    backgroundColor: appPalette.surface.background,
    textColor: appPalette.semantic.text,
    borderColor: appPalette.semantic.borderSubtle,
  },
  success: {
    backgroundColor: appPalette.semantic.successSurface,
    textColor: appPalette.semantic.successText,
    borderColor: appPalette.semantic.successBorder,
  },
  danger: {
    backgroundColor: appPalette.semantic.dangerSurface,
    textColor: appPalette.semantic.dangerText,
    borderColor: appPalette.semantic.dangerBorder,
  },
};

export function ActionChip({
  children,
  onPress,
  tone = "secondary",
  disabled = false,
}: {
  children: ReactNode;
  onPress?: () => void;
  tone?: ActionChipTone;
  disabled?: boolean;
}) {
  const palette = toneStyles[tone];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? appPalette.semantic.borderSubtle : palette.backgroundColor,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: disabled ? appPalette.semantic.borderSubtle : (palette.borderColor ?? palette.backgroundColor),
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <Text style={{ color: disabled ? appPalette.semantic.textMuted : palette.textColor, fontWeight: "500", fontSize: 12, lineHeight: 18, fontFamily: "Montserrat" }}>{children}</Text>
    </Pressable>
  );
}
