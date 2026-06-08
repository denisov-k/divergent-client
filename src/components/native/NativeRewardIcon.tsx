import { View } from "react-native";

import { Award, Crown, Gift, Star, Trophy, Zap } from "@/components/native/icons";
import { appPalette } from "@/theme/palette";
import type { RewardIcon } from "@/types";

const iconMap = {
  trophy: Trophy,
  star: Star,
  gift: Gift,
  crown: Crown,
  award: Award,
  zap: Zap,
} as const;

export function NativeRewardIcon({
  icon = "trophy",
  unlocked = false,
  size = 48,
  iconSize = 24,
}: {
  icon?: RewardIcon;
  unlocked?: boolean;
  size?: number;
  iconSize?: number;
}) {
  const Icon = iconMap[icon] || Trophy;
  const color = unlocked ? appPalette.semantic.successText : appPalette.semantic.textMuted;
  const backgroundColor = unlocked ? appPalette.semantic.successSurface : appPalette.semantic.neutralSurface;
  const radius = Math.max(8, Math.round(size * 0.25));

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor,
      }}
    >
      <Icon size={iconSize} color={color} />
    </View>
  );
}

