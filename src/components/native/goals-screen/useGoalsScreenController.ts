import { useTranslation } from "react-i18next";

import { useNativeNavigation } from "@/app/native/NativeNavigation";
import { buildProgressPath, buildRemindersPath } from "@/app/routes";
import { useAppStore } from "@/stores/useAppStore";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";
import { showDraftAddedAlert, showGoalTaskToggleResultAlert } from "./alerts";

export function useGoalsScreenController(_: {
  goalId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAppStore();
  const { navigateToPath } = useNativeNavigation();
  const screen = useGoalsScreen({
    onNavigateToProgress: (goalId) => {
      navigateToPath(buildProgressPath({ goalId }));
    },
  });

  const handleTaskToggle = async (goalId: string, taskId: string) => {
    const result = await screen.toggleGoalTask(goalId, taskId);
    showGoalTaskToggleResultAlert(result, t);
  };

  const handleDraftAdded = (goalTitle: string) => {
    showDraftAddedAlert(goalTitle, t);
  };

  const openReminderForGoal = (goalId: string) => {
    navigateToPath(buildRemindersPath({ goalId }));
  };

  return {
    ...screen,
    userTimeZone: user?.timeZone ?? "UTC",
    openReminderForGoal,
    handleTaskToggle,
    handleDraftAdded,
  };
}
