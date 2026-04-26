import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";

export default function NativeGoalsScreen() {
  const {
    goals,
    rewards,
    openCreateGoal,
    openEditGoal,
    openReminderForGoal,
    addProgress,
    toggleGoalTask,
  } = useGoalsScreen();

  const handleTaskToggle = async (goalId: string, taskId: string) => {
    const result = await toggleGoalTask(goalId, taskId);

    if (result.status === "completed") {
      Alert.alert("Готово", `+${result.xpReward} XP`);
      return;
    }

    if (result.status === "report_required") {
      Alert.alert("Нужен отчёт", "Для этой задачи сначала нужно прикрепить отчёт.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#0f172a" }}>Цели</Text>
        <Pressable
          onPress={openCreateGoal}
          style={{
            backgroundColor: "#2563eb",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "600" }}>Новая цель</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {goals.length === 0 ? (
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "#e2e8f0",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a", marginBottom: 8 }}>
              Пока нет целей
            </Text>
            <Text style={{ color: "#64748b", marginBottom: 16 }}>
              Создайте первую цель, чтобы начать перенос mobile flow на общий screen-layer.
            </Text>
            <Pressable
              onPress={openCreateGoal}
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#eff6ff",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#1d4ed8", fontWeight: "600" }}>Создать цель</Text>
            </Pressable>
          </View>
        ) : (
          goals.map((goal) => {
            const reward = rewards.find((item) => item.goalId === goal.id);

            return (
              <View
                key={goal.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  gap: 12,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>
                      {goal.title}
                    </Text>
                    {!!goal.description && (
                      <Text style={{ marginTop: 4, color: "#64748b" }}>{goal.description}</Text>
                    )}
                    {reward && (
                      <Text style={{ marginTop: 8, color: "#0f766e", fontWeight: "600" }}>
                        Награда: {reward.title}
                      </Text>
                    )}
                  </View>

                  <Pressable onPress={() => openEditGoal(goal.id)}>
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>Изменить</Text>
                  </Pressable>
                </View>

                {goal.goalType === "PROGRESS" && (
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Pressable
                      onPress={() => addProgress(goal.id, -1)}
                      style={{
                        backgroundColor: "#f1f5f9",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: "#334155", fontWeight: "600" }}>-1</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => addProgress(goal.id, 1)}
                      style={{
                        backgroundColor: "#dbeafe",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: "#1d4ed8", fontWeight: "600" }}>+1</Text>
                    </Pressable>
                    <Text style={{ color: "#475569", alignSelf: "center" }}>
                      {goal.currentValue ?? 0} / {goal.targetValue ?? "—"}
                    </Text>
                  </View>
                )}

                <View style={{ gap: 8 }}>
                  {goal.tasks?.map((task) => (
                    <Pressable
                      key={task.id}
                      onPress={() => void handleTaskToggle(goal.id, task.id)}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f8fafc",
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: "#0f172a", flex: 1 }}>{task.title}</Text>
                      <Text style={{ color: "#64748b" }}>{task.lastCompletedAt ? "Готово" : "Открыто"}</Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  onPress={() => openReminderForGoal(goal.id)}
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "#f8fafc",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "#334155", fontWeight: "600" }}>Добавить напоминание</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
