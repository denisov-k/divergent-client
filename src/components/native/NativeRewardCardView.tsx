import { View } from "react-native";

import { SurfaceCard } from "@/components/native/SurfaceCard";
import type { Challenge, Goal, Reward } from "@/types";

import { RewardCardEdit, RewardCardHeader, RewardCardLinks } from "./reward-card/Sections";

export function NativeRewardCardView({
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
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
        <View style={{ flex: 1, minWidth: 0, gap: 12 }}>
          <RewardCardHeader reward={reward} />
          <RewardCardLinks reward={reward} goal={goal} challenge={challenge} />
        </View>
        <RewardCardEdit canEdit={Boolean(canEdit)} rewardId={reward.id} onEdit={onEdit} />
      </View>
    </SurfaceCard>
  );
}
