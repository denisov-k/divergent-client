import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { RewardFormSheet } from "@/components/native/RewardFormSheet";
import { NativeRewardCardView } from "@/components/native/NativeRewardCardView";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { useAppStore } from "@/stores/useAppStore";
import { useRewardsScreen } from "@/shared/screens/rewards/useRewardsScreen";
import { appPalette } from "@/theme/palette";

export default function NativeRewardsScreen(props: { rewardId?: string | null; onConsumeLinkState?: () => void }) {
  const { t } = useTranslation();
  const { challenges } = useAppStore();
  const { rewards, goals, rewardDialogOpen, editingReward, openCreateReward, openEditReward, saveReward, removeReward, closeRewardDialog } = useRewardsScreen();
  const scrollRef = useRef<ScrollView | null>(null);
  const [itemOffsets, setItemOffsets] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!props.rewardId) {
      return;
    }

    const y = itemOffsets[props.rewardId];
    if (typeof y !== "number") {
      return;
    }

    scrollRef.current?.scrollTo({ y: Math.max(y - 12, 0), animated: true });
  }, [props.rewardId, itemOffsets]);

  const handleDeleteReward = async (id: string) => {
    await removeReward(id);
    Alert.alert(t("rewards.deleted_title"), t("rewards.deleted_description"));
  };

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <ScreenHeader
        title={t("rewards.title")}
        actionLabel={t("rewards.add")}
        onAction={openCreateReward}
        paddingHorizontal={8}
        paddingVertical={8}
      />

      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
        {rewards.length === 0 ? (
          <EmptyStateCard title={t("rewards.empty_title")} description={t("rewards.empty_description")} actionLabel={t("common.create_first_reward")} onAction={openCreateReward} />
        ) : (
          rewards.map((reward) => {
            const goal = goals.find((item) => item.id === reward.goalId);
            const challenge = goal?.challengeId ? challenges.find((item) => item.id === goal.challengeId) : undefined;
            return (
              <View
                key={reward.id}
                onLayout={(event) => {
                  const { y } = event.nativeEvent.layout;
                  setItemOffsets((current) => (current[reward.id] == y ? current : { ...current, [reward.id]: y }));
                }}
              >
                <NativeRewardCardView reward={reward} goal={goal} challenge={challenge} focused={reward.id === props.rewardId} onEdit={openEditReward} />
              </View>
            );
          })
        )}
      </ScrollView>
      <RewardFormSheet open={rewardDialogOpen} reward={editingReward} goals={goals} onOpenChange={closeRewardDialog} onSave={saveReward} onDelete={handleDeleteReward} />
    </View>
  );
}
