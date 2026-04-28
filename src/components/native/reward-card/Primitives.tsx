import { Pressable, Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function RewardBadge({
  children,
  tone = "neutral",
  onPress,
  icon,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "info";
  onPress?: () => void;
  icon?: React.ReactNode;
}) {
  const palette = {
    neutral: { backgroundColor: appPalette.semantic.neutralSurface, color: appPalette.semantic.neutralText, borderColor: appPalette.semantic.borderSubtle },
    success: { backgroundColor: appPalette.semantic.successStrong, color: appPalette.semantic.textInverse, borderColor: appPalette.semantic.successStrong },
    warning: { backgroundColor: appPalette.semantic.warningStrong, color: appPalette.semantic.textInverse, borderColor: appPalette.semantic.warningStrong },
    info: { backgroundColor: appPalette.brand.primary, color: appPalette.semantic.textInverse, borderColor: appPalette.brand.primary },
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
      {icon ? <View style={{ width: 12, height: 12, flexShrink: 0, alignItems: "center", justifyContent: "center" }}>{icon}</View> : null}
      <Text style={{ color: palette.color, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat", flexShrink: 1 }}>{children}</Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return <Pressable onPress={onPress}>{content}</Pressable>;
}

export function RewardEditAction({
  onPress,
  icon,
}: {
  onPress?: () => void;
  icon: React.ReactNode;
}) {
  if (!onPress) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{ width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" }}
    >
      {icon}
    </Pressable>
  );
}
