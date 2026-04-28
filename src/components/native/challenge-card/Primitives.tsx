import { Pressable, Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function ChallengeCardAction({ icon, onPress }: { icon: React.ReactNode; onPress?: () => void }) {
  if (!onPress) return null;

  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
      {icon}
    </Pressable>
  );
}

export function ChallengeCardBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const palette = {
    neutral: { backgroundColor: appPalette.surface.background, color: appPalette.semantic.textMuted, borderColor: appPalette.semantic.borderSubtle },
    success: { backgroundColor: appPalette.semantic.successSurface, color: appPalette.semantic.successText, borderColor: appPalette.semantic.successBorder },
    warning: { backgroundColor: appPalette.semantic.warningStrong, color: appPalette.brand.primaryForeground, borderColor: appPalette.semantic.warningStrong },
    danger: { backgroundColor: appPalette.semantic.dangerText, color: appPalette.brand.primaryForeground, borderColor: appPalette.semantic.dangerText },
    info: { backgroundColor: appPalette.semantic.infoSurface, color: appPalette.semantic.infoText, borderColor: appPalette.semantic.infoBorder },
  }[tone];

  return (
    <View
      style={{
        alignSelf: "flex-start",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: palette.borderColor,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: palette.backgroundColor,
      }}
    >
      <Text style={{ color: palette.color, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{children}</Text>
    </View>
  );
}

export function ChallengePrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: appPalette.brand.primary,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <Text style={{ color: appPalette.brand.primaryForeground, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{label}</Text>
    </Pressable>
  );
}
