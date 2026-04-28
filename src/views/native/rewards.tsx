import { useEffect } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { Plus } from "@/components/native/icons";
import { NativeRewardCard } from "@/components/native/NativeRewardCard";
import { RewardFormSheet } from "@/components/native/RewardFormSheet";
import { useAppStore } from "@/stores/useAppStore";
import { useRewardsScreen } from "@/shared/screens/rewards/useRewardsScreen";
import { appPalette } from "@/theme/palette";

export default function NativeRewardsScreen(props: {
  rewardId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { t } = useTranslation();
  const { challenges } = useAppStore();
  const { rewards, goals, rewardDialogOpen, editingReward, openCreateReward, openEditReward, saveReward, removeReward, closeRewardDialog } = useRewardsScreen();

  useEffect(() => {
    if (!props.rewardId) {
      return;
    }

    openEditReward(props.rewardId);
    props.onConsumeLinkState?.();
  }, [props.rewardId, props.onConsumeLinkState, openEditReward]);

  const handleDeleteReward = async (id: string) => {
    await removeReward(id);
    Alert.alert("Готово", "Награда удалена");
  };

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <View style={{ paddingHorizontal: 8, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, backgroundColor: appPalette.surface.background }}>
        <Text style={{ fontSize: 19, fontWeight: "500", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", lineHeight: 29 }}>
          {t("rewards.title")}
        </Text>

        <Pressable
          onPress={openCreateReward}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: appPalette.semantic.infoSurface,
            borderWidth: 1,
            borderColor: appPalette.semantic.infoBorder,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Plus size={16} color={appPalette.semantic.infoText} />
          <Text style={{ color: appPalette.semantic.infoText, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
            {t("rewards.add")}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8, paddingBottom: 16, gap: 8 }}>
        {rewards.length === 0 ? (
          <EmptyStateCard title="Пока нет наград" description="Создайте первую награду" actionLabel="Создать первую награду" onAction={openCreateReward} />
        ) : (
          rewards.map((reward) => {
            const goal = goals.find((item) => item.id === reward.goalId);
            const challenge = goal?.challengeId ? challenges.find((item) => item.id === goal.challengeId) : undefined;

            return <NativeRewardCard key={reward.id} reward={reward} goal={goal} challenge={challenge} onEdit={openEditReward} />;
          })
        )}
      </ScrollView>

      <RewardFormSheet open={rewardDialogOpen} reward={editingReward} goals={goals} onOpenChange={closeRewardDialog} onSave={saveReward} onDelete={handleDeleteReward} />
    </View>
  );
}
