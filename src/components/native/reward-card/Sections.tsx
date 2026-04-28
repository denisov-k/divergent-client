import { Linking, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { buildChallengesPath, buildGoalsPath } from "@/app/routes";
import { Edit, Swords, Target } from "@/components/native/Icons";
import { NativeRewardIcon } from "@/components/native/NativeRewardIcon";
import { buildNativeRouteUrl } from "@/platform/appUrl.native";
import { appPalette } from "@/theme/palette";
import type { Challenge, Goal, Reward } from "@/types";

import { RewardBadge, RewardEditAction } from "./Primitives";

export function RewardCardHeader({
  reward,
}: {
  reward: Reward;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
      <NativeRewardIcon icon={reward.icon} unlocked={reward.isUnlocked} />

      <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Text style={{ fontSize: 12, fontWeight: "500", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", lineHeight: 12, flexShrink: 1 }}>
            {reward.title}
          </Text>
          {reward.isUnlocked && <RewardBadge tone="success">{t("rewards.unlocked")}</RewardBadge>}
        </View>

        <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>
          {reward.description}
        </Text>
      </View>
    </View>
  );
}

export function RewardCardLinks({
  reward,
  goal,
  challenge,
}: {
  reward: Reward;
  goal?: Goal;
  challenge?: Challenge;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {!!goal && (
        <RewardBadge
          tone="info"
          icon={<Target size={12} color={appPalette.semantic.textInverse} />}
          onPress={() => void Linking.openURL(buildNativeRouteUrl(buildGoalsPath({ id: goal.id })))}
        >
          {goal.title}
        </RewardBadge>
      )}

      {!!challenge && (
        <RewardBadge
          tone="warning"
          icon={<Swords size={12} color={appPalette.semantic.textInverse} />}
          onPress={() => void Linking.openURL(buildNativeRouteUrl(buildChallengesPath({ id: challenge.id })))}
        >
          {challenge.title}
        </RewardBadge>
      )}

      {!!reward.xpRequires && !reward.isUnlocked && <RewardBadge>{t("ai.xp_required", { xp: reward.xpRequires })}</RewardBadge>}
    </View>
  );
}

export function RewardCardEdit({
  canEdit,
  rewardId,
  onEdit,
}: {
  canEdit: boolean;
  rewardId: string;
  onEdit?: (id: string) => void;
}) {
  if (!canEdit || !onEdit) {
    return null;
  }

  return <RewardEditAction onPress={() => onEdit(rewardId)} icon={<Edit size={14} color={appPalette.semantic.textMuted} />} />;
}
