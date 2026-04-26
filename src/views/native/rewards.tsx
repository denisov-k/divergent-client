import { useEffect } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useRewardsScreen } from "@/shared/screens/rewards/useRewardsScreen";

export default function NativeRewardsScreen(props: {
  rewardId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { rewards, goals, openCreateReward, openEditReward, removeReward } = useRewardsScreen();

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
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScreenHeader title="Награды" actionLabel="Новая" onAction={openCreateReward} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {rewards.length === 0 ? (
          <EmptyStateCard
            title="Пока нет наград"
            description="Это native entrypoint для rewards поверх общего screen-layer."
            actionLabel="Создать награду"
            onAction={openCreateReward}
          />
        ) : (
          rewards.map((reward) => {
            const goal = goals.find((item) => item.id === reward.goalId);

            return (
              <SurfaceCard key={reward.id} gap={10}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>
                      {reward.title}
                    </Text>
                    {!!reward.description && (
                      <Text style={{ marginTop: 4, color: "#64748b" }}>{reward.description}</Text>
                    )}
                  </View>

                  <Pressable onPress={() => openEditReward(reward.id)}>
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>Изменить</Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {typeof reward.xpRequires === "number" && reward.xpRequires > 0 && (
                    <View
                      style={{
                        backgroundColor: "#f1f5f9",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: "#334155" }}>{reward.xpRequires} XP</Text>
                    </View>
                  )}

                  {reward.isUnlocked && (
                    <View
                      style={{
                        backgroundColor: "#dcfce7",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: "#166534" }}>Получено</Text>
                    </View>
                  )}

                  {!!goal && (
                    <View
                      style={{
                        backgroundColor: "#dbeafe",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: "#1d4ed8" }}>Цель: {goal.title}</Text>
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <ActionChip onPress={() => openEditReward(reward.id)}>Редактировать</ActionChip>

                  <ActionChip onPress={() => void handleDeleteReward(reward.id)} tone="danger">
                    Удалить
                  </ActionChip>
                </View>
              </SurfaceCard>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
