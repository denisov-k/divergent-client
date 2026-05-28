import { Suspense, lazy, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const ReminderFormSheet = lazy(() =>
  import("@/components/native/ReminderFormSheet").then((m) => ({ default: m.ReminderFormSheet }))
);

import { HapticPressable as Pressable } from "@/components/native/HapticPressable";
import { NativeReminderCardView } from "@/components/native/NativeReminderCardView";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { useRemindersScreen } from "@/shared/screens/reminders/useRemindersScreen";
import { appPalette } from "@/theme/palette";

function SheetFallback() {
  return null;
}

export default function NativeRemindersScreen(props: {
  reminderId?: string | null;
  goalId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { t } = useTranslation();
  const [initialGoalId, setInitialGoalId] = useState<string | undefined>(undefined);
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
    setReminderDialogOpen,
  } = useRemindersScreen();

  useEffect(() => {
    if (props.reminderId) {
      openEditReminder(props.reminderId);
      props.onConsumeLinkState?.();
      return;
    }

    if (props.goalId) {
      setInitialGoalId(props.goalId);
      setReminderDialogOpen(true);
      props.onConsumeLinkState?.();
    }
  }, [props.reminderId, props.goalId, props.onConsumeLinkState, openEditReminder, setReminderDialogOpen]);

  const handleDeleteReminder = async (id: string) => {
    const ok = await removeReminder(id);
    if (ok) {
      Alert.alert(t("reminders.deleted_title"), t("reminders.deleted_description"));
    }
    return ok;
  };

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <ScreenHeader
        title={t("reminders.title")}
        actionLabel={t("reminders.create")}
        onAction={() => {
          setInitialGoalId(undefined);
          openCreateReminder();
        }}
        paddingHorizontal={8}
        paddingVertical={8}
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
        {reminders.length === 0 ? (
          <View
            style={{
              backgroundColor: appPalette.surface.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: appPalette.semantic.borderSubtle,
              paddingHorizontal: 24,
              paddingVertical: 48,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: appPalette.semantic.textMuted,
                marginBottom: 16,
                fontFamily: "Montserrat",
                fontSize: 12,
                lineHeight: 18,
                textAlign: "center",
              }}
            >
              {t("reminders.empty")}
            </Text>
            <Pressable
              onPress={() => {
                setInitialGoalId(undefined);
                openCreateReminder();
              }}
              style={{
                minHeight: 36,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 6,
                backgroundColor: appPalette.brand.primaryStrong,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: appPalette.brand.primaryForeground,
                  fontFamily: "Montserrat",
                  fontSize: 12,
                  fontWeight: "500",
                  lineHeight: 18,
                }}
              >
                {t("reminders.create_first")}
              </Text>
            </Pressable>
          </View>
        ) : (
          reminders.map((reminder) => {
            const goal = goals.find((item) => item.id === reminder.goalId);
            const task = goal?.tasks.find((item) => item.id === reminder.taskId);

            return (
              <NativeReminderCardView
                key={reminder.id}
                reminder={reminder}
                goal={goal}
                task={task}
                onToggle={() => void toggleReminderState(reminder.id)}
                onEdit={openEditReminder}
              />
            );
          })
        )}
      </ScrollView>

      <Suspense fallback={<SheetFallback />}>
        {reminderDialogOpen && (
          <ReminderFormSheet
            open={reminderDialogOpen}
            reminder={editingReminder}
            goals={goals}
            initialGoalId={initialGoalId}
            onOpenChange={(open) => {
              closeReminderDialog(open);
              if (!open) {
                setInitialGoalId(undefined);
              }
            }}
            onSave={saveReminder}
            onDelete={handleDeleteReminder}
          />
        )}
      </Suspense>
    </View>
  );
}
