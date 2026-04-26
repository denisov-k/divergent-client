import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { useRemindersScreen } from "@/shared/screens/reminders/useRemindersScreen";

export default function NativeRemindersScreen() {
  const {
    reminders,
    goals,
    openCreateReminder,
    openEditReminder,
    toggleReminderState,
    removeReminder,
  } = useRemindersScreen();

  const handleDeleteReminder = async (id: string) => {
    await removeReminder(id);
    Alert.alert("Готово", "Напоминание удалено");
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
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#0f172a" }}>Напоминания</Text>
        <Pressable
          onPress={openCreateReminder}
          style={{
            backgroundColor: "#2563eb",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "600" }}>Новое</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {reminders.length === 0 ? (
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
              Пока нет напоминаний
            </Text>
            <Text style={{ color: "#64748b", marginBottom: 16 }}>
              Это базовый native entrypoint на общей screen-логике reminders.
            </Text>
            <Pressable
              onPress={openCreateReminder}
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#eff6ff",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#1d4ed8", fontWeight: "600" }}>Создать напоминание</Text>
            </Pressable>
          </View>
        ) : (
          reminders.map((reminder) => {
            const goal = goals.find((item) => item.id === reminder.goalId);

            return (
              <View
                key={reminder.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>
                      {reminder.title}
                    </Text>
                    <Text style={{ color: "#64748b", marginTop: 4 }}>{reminder.time}</Text>
                    {!!goal && (
                      <Text style={{ color: "#0f766e", marginTop: 6 }}>Цель: {goal.title}</Text>
                    )}
                  </View>

                  <Pressable onPress={() => openEditReminder(reminder.id)}>
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>Изменить</Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {reminder.daysOfWeek.map((day) => (
                    <View
                      key={day}
                      style={{
                        backgroundColor: "#f1f5f9",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: "#334155" }}>{day}</Text>
                    </View>
                  ))}
                  {reminder.daysOfMonth.map((day) => (
                    <View
                      key={day}
                      style={{
                        backgroundColor: "#f1f5f9",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: "#334155" }}>{day}</Text>
                    </View>
                  ))}
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={() => void toggleReminderState(reminder.id)}
                    style={{
                      backgroundColor: reminder.isActive ? "#dcfce7" : "#e2e8f0",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color: reminder.isActive ? "#166534" : "#475569", fontWeight: "600" }}>
                      {reminder.isActive ? "Активно" : "Выключено"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => void handleDeleteReminder(reminder.id)}
                    style={{
                      backgroundColor: "#fef2f2",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color: "#b91c1c", fontWeight: "600" }}>Удалить</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
