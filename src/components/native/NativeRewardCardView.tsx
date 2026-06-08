import { useEffect, useState } from "react";
import { View } from "react-native";

import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";
import type { Challenge, Goal, Reward } from "@/types";

import { RewardCardEdit, RewardCardHeader, RewardCardLinks } from "./reward-card/Sections";

export function NativeRewardCardView({
  reward,
  goal,
  challenge,
  focused = false,
  onEdit,
}: {
  reward: Reward;
  goal?: Goal;
  challenge?: Challenge;
  focused?: boolean;
  onEdit?: (id: string) => void;
}) {
  const canEdit = onEdit && !goal?.challengeId && reward.sourceKey !== "onboarding_completion";
  const [highlight, setHighlight] = useState(focused);

  useEffect(() => {
    if (!focused) {
      return;
    }

    setHighlight(true);
    const timeout = setTimeout(() => setHighlight(false), 2000);
    return () => clearTimeout(timeout);
  }, [focused]);

  return (
    <View style={{ backgroundColor: highlight ? appPalette.semantic.infoSurfaceStrong : "transparent", borderRadius: 12 }}>
      <SurfaceCard gap={12} padding={24} radius={12}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
          <View style={{ flex: 1, minWidth: 0, gap: 12 }}>
            <RewardCardHeader reward={reward} />
            <RewardCardLinks reward={reward} goal={goal} challenge={challenge} />
          </View>
          <RewardCardEdit canEdit={Boolean(canEdit)} rewardId={reward.id} onEdit={onEdit} />
        </View>
      </SurfaceCard>
    </View>
  );
}
