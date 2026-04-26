import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { FriendFormSheet } from "@/components/native/FriendFormSheet";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { StatTile } from "@/components/native/StatTile";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { ActionChip } from "@/components/native/ActionChip";
import { useFrensScreen } from "@/shared/screens/frens/useFrensScreen";

export default function NativeFrensScreen() {
  const { friends, addFriend, loading } = useFrensScreen();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScreenHeader title="Друзья" subtitle="Social flow теперь тоже живёт в standalone mobile runtime." />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <SurfaceCard>
          <View style={{ gap: 12 }}>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>Команда и рейтинг</Text>
              <Text style={{ color: "#64748b" }}>
                Добавляй друзей вручную и сравнивай прогресс прямо в mobile-ветке.
              </Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <ActionChip onPress={() => setIsCreateOpen(true)} tone="primary">
                {loading ? "Сохраняем..." : "Добавить друга"}
              </ActionChip>
            </View>
          </View>
        </SurfaceCard>

        {friends.length === 0 ? (
          <SurfaceCard>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>Пока нет друзей</Text>
            <Text style={{ color: "#64748b" }}>
              Добавь первого друга, и social-слой сразу появится в мобильном клиенте.
            </Text>
          </SurfaceCard>
        ) : (
          friends.map((friend) => {
            const completionRate = friend.totalGoals > 0 ? (friend.completedGoals / friend.totalGoals) * 100 : 0;

            return (
              <SurfaceCard key={friend.id}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>{friend.name}</Text>
                    <Text style={{ color: "#64748b", marginTop: 4 }}>
                      Уровень {friend.level} • {friend.currentXp} XP
                    </Text>
                  </View>
                  {typeof friend.rank === "number" && (
                    <View
                      style={{
                        minWidth: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: friend.rank <= 3 ? "#fef3c7" : "#f1f5f9",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "700", color: friend.rank <= 3 ? "#92400e" : "#475569" }}>
                        #{friend.rank}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                  <StatTile label="Выполнено целей" value={String(friend.completedGoals)} tone="blue" />
                  <StatTile label="Серия" value={`${friend.streak} дн.`} tone="emerald" />
                </View>

                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "#64748b" }}>Прогресс целей</Text>
                    <Text style={{ color: "#334155", fontWeight: "600" }}>
                      {friend.completedGoals} / {friend.totalGoals}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 10,
                      backgroundColor: "#e2e8f0",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${Math.max(6, Math.min(100, completionRate))}%`,
                        height: "100%",
                        backgroundColor: "#2563eb",
                        borderRadius: 999,
                      }}
                    />
                  </View>
                </View>
              </SurfaceCard>
            );
          })
        )}
      </ScrollView>

      <FriendFormSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} onSave={addFriend} />
    </View>
  );
}
