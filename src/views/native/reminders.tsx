import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { ReminderFormSheet } from "@/components/native/ReminderFormSheet";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useRemindersScreen } from "@/shared/screens/reminders/useRemindersScreen";

const WEEK_DAY_LABELS: Record<string, string> = {
  mon: "Пн",
  tue: "Вт",
  wed: "Ср",
  thu: "Чт",
  fri: "Пт",
  sat: "Сб",
  sun: "Вс",
};

export default function NativeRemindersScreen() {
  const {
    reminders,
    goals,
    reminderDialogOpen,
    editingReminder,
    closeReminderDialog,
    openCreateReminder,
    openEditReminder,
    saveReminder,
    toggleReminderState,
    removeReminder,
  } = useRemindersScreen();

  const handleDeleteReminder = async (id: string) => {
    await removeReminder(id);
    Alert.alert("Готово", "Напоминание удалено");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScreenHeader title="Напоминания" actionLabel="Новое" onAction={openCreateReminder} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {reminders.length === 0 ? (
          <EmptyStateCard
            title="Пока нет напоминаний"
            description="Это базовый native entrypoint на общей screen-логике reminders."
            actionLabel="Создать напоминание"
            onAction={openCreateReminder}
          />
        ) : (
          reminders.map((reminder) => {
            const goal = goals.find((item) => item.id === reminder.goalId);

            return (
              <SurfaceCard key={reminder.id} gap={10}>
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
                      <Text style={{ color: "#334155" }}>{WEEK_DAY_LABELS[day] ?? day}</Text>
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

                <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                  <ActionChip
                    onPress={() => void toggleReminderState(reminder.id)}
                    tone={reminder.isActive ? "success" : "secondary"}
                  >
                    {reminder.isActive ? "Активно" : "Выключено"}
                  </ActionChip>

                  <ActionChip onPress={() => void handleDeleteReminder(reminder.id)} tone="danger">
                    Удалить
                  </ActionChip>
                </View>
              </SurfaceCard>
            );
          })
        )}
      </ScrollView>

      <ReminderFormSheet
        open={reminderDialogOpen}
        reminder={editingReminder}
        goals={goals}
        onOpenChange={closeReminderDialog}
        onSave={saveReminder}
        onDelete={removeReminder}
      />
    </View>
  );
}
