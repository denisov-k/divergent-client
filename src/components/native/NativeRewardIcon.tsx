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
}: {
  icon?: RewardIcon;
  unlocked?: boolean;
}) {
  const Icon = iconMap[icon] || Trophy;
  const color = unlocked ? appPalette.semantic.successText : appPalette.semantic.textMuted;
  const backgroundColor = unlocked ? appPalette.semantic.successSurface : appPalette.semantic.neutralSurface;

  return (
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor,
      }}
    >
      <Icon size={24} color={color} />
    </View>
  );
}

