import { lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ReminderDialog = lazy(() => import("@/components/web/reminders/ReminderDialog").then((m) => ({ default: m.ReminderDialog })));

import { ReminderCard } from "@/components/web/reminders/ReminderCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRemindersScreen } from "@/shared/screens/reminders/useRemindersScreen";

function DialogFallback() {
  return null;
}

export default function RemindersScreen() {
  const { t } = useTranslation();
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
    toast.success(result.status === "updated" ? t("reminders.updated") : t("reminders.created"));
  };

  const handleDeleteReminder = async (id: string) => {
    await removeReminder(id);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-2">
      <div className="flex items-center justify-between py-2">
        <h2>{t("reminders.title")}</h2>
        <Button onClick={openCreateReminder}>
          <Plus className="mr-2 size-4" />
          {t("reminders.create")}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-muted-foreground">{t("reminders.empty")}</p>
              <Button onClick={openCreateReminder}>
                <Plus className="mr-2 size-4" />
                {t("reminders.create_first")}
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
      </div>

      <Suspense fallback={<DialogFallback />}>
        {reminderDialogOpen && (
          <ReminderDialog
            open={reminderDialogOpen}
            onOpenChange={closeReminderDialog}
            onSave={handleSaveReminder}
            onDelete={handleDeleteReminder}
            reminder={editingReminder}
            goals={goals}
          />
        )}
      </Suspense>
    </div>
  );
}


