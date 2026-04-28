import { SurfaceCard } from "@/components/native/SurfaceCard";
import type { Goal, Reminder, Task } from "@/types";

import { ReminderHeader, ReminderLinksSection, ReminderRepeatSection } from "./reminder-card/Sections";

export function NativeReminderCardView({
  reminder,
  goal,
  task,
  onToggle,
  onEdit,
}: {
  reminder: Reminder;
  goal?: Goal;
  task?: Task;
  onToggle?: () => void;
  onEdit?: (id: string) => void;
}) {
  return (
    <SurfaceCard gap={12} padding={24} radius={12}>
      <ReminderHeader reminder={reminder} onToggle={onToggle} onEdit={onEdit} />
      <ReminderRepeatSection reminder={reminder} />
      <ReminderLinksSection goal={goal} task={task} />
    </SurfaceCard>
  );
}
