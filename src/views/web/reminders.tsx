import { Plus } from "lucide-react";
import { toast } from "sonner";

import { ReminderCard } from "@/components/ReminderCard";
import { ReminderDialog } from "@/components/ReminderDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRemindersScreen } from "@/shared/screens/reminders/useRemindersScreen";

export default function RemindersScreen() {
  const {
    reminders,
    goals,
    reminderDialogOpen,
    editingReminder,
    openCreateReminder,
    openEditReminder,
    saveReminder,
    toggleReminderState,
    removeReminder,
    closeReminderDialog,
  } = useRemindersScreen();

  const handleSaveReminder = async (...args: Parameters<typeof saveReminder>) => {
    const result = await saveReminder(...args);
    toast.success(
      result.status === "updated"
        ? "РќР°РїРѕРјРёРЅР°РЅРёРµ РѕР±РЅРѕРІР»РµРЅРѕ"
        : "РќР°РїРѕРјРёРЅР°РЅРёРµ СЃРѕР·РґР°РЅРѕ"
    );
  };

  const handleDeleteReminder = async (id: string) => {
    await removeReminder(id);
  };

  return (
    <div className="flex flex-1 flex-col px-2">
      <div className="flex items-center justify-between py-2">
        <h2>РќР°РїРѕРјРёРЅР°РЅРёСЏ</h2>
        <Button onClick={openCreateReminder}>
          <Plus className="mr-2 size-4" />
          Р”РѕР±Р°РІРёС‚СЊ РЅР°РїРѕРјРёРЅР°РЅРёРµ
        </Button>
      </div>

      {reminders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">РЈ РІР°СЃ РїРѕРєР° РЅРµС‚ РЅР°РїРѕРјРёРЅР°РЅРёР№</p>
            <Button onClick={openCreateReminder}>
              <Plus className="mr-2 size-4" />
              РЎРѕР·РґР°С‚СЊ РїРµСЂРІРѕРµ РЅР°РїРѕРјРёРЅР°РЅРёРµ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              {...reminder}
              onToggle={() => void toggleReminderState(reminder.id)}
              onEdit={openEditReminder}
            />
          ))}
        </div>
      )}

      <ReminderDialog
        open={reminderDialogOpen}
        onOpenChange={closeReminderDialog}
        onSave={handleSaveReminder}
        onDelete={handleDeleteReminder}
        reminder={editingReminder}
        goals={goals}
      />
    </div>
  );
}
