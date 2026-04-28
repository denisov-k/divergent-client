import { Linking, Pressable, Text, View } from "react-native";

import { buildChallengesPath, buildGoalsPath } from "@/app/routes";
import { Edit, Swords, Target } from "@/components/native/icons";
import { NativeRewardIcon } from "@/components/native/NativeRewardIcon";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";
import { buildNativeRouteUrl } from "@/platform/appUrl.native";
import type { Challenge, Goal, Reward } from "@/types";

function SmallBadge({
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
      <Text style={{ color: palette.color, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat", flexShrink: 1 }}>
        {children}
      </Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return <Pressable onPress={onPress}>{content}</Pressable>;
}

export function NativeRewardCard({
  reward,
  goal,
  challenge,
  onEdit,
}: {
  reward: Reward;
  goal?: Goal;
  challenge?: Challenge;
  onEdit?: (id: string) => void;
}) {
  const canEdit = onEdit && !goal?.challengeId;

  return (
    <SurfaceCard gap={12} padding={24} radius={12}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <NativeRewardIcon icon={reward.icon} unlocked={reward.isUnlocked} />

        <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Text style={{ fontSize: 12, fontWeight: "500", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", lineHeight: 12, flexShrink: 1 }}>
              {reward.title}
            </Text>
            {reward.isUnlocked && <SmallBadge tone="success">Получено</SmallBadge>}
          </View>

          <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>
            {reward.description}
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {!!goal && (
              <SmallBadge
                tone="info"
                icon={<Target size={12} color={appPalette.semantic.textInverse} />}
                onPress={() => void Linking.openURL(buildNativeRouteUrl(buildGoalsPath({ id: goal.id })))}
              >
                {goal.title}
              </SmallBadge>
            )}

            {!!challenge && (
              <SmallBadge
                tone="warning"
                icon={<Swords size={12} color={appPalette.semantic.textInverse} />}
                onPress={() => void Linking.openURL(buildNativeRouteUrl(buildChallengesPath({ id: challenge.id })))}
              >
                {challenge.title}
              </SmallBadge>
            )}

            {!!reward.xpRequires && !reward.isUnlocked && <SmallBadge>{`Требуется ${reward.xpRequires} XP`}</SmallBadge>}
          </View>
        </View>

        {canEdit && (
          <Pressable
            onPress={() => onEdit(reward.id)}
            hitSlop={8}
            style={{ width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" }}
          >
            <Edit size={14} color={appPalette.semantic.textMuted} />
          </Pressable>
        )}
      </View>
    </SurfaceCard>
  );
}



