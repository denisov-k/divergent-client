import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppStore } from "@/stores/useAppStore";
import { useGoalsScreen } from "@/shared/screens/goals/useGoalsScreen";
import { showDraftAddedAlert, showGoalTaskToggleResultAlert } from "./alerts";

export function useGoalsScreenController(props: {
  goalId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAppStore();
  const screen = useGoalsScreen();

  useEffect(() => {
    if (!props.goalId) return;
    screen.openEditGoal(props.goalId);
    props.onConsumeLinkState?.();
  }, [props.goalId, props.onConsumeLinkState, screen.openEditGoal]);

  const handleTaskToggle = async (goalId: string, taskId: string) => {
    const result = await screen.toggleGoalTask(goalId, taskId);
    showGoalTaskToggleResultAlert(result, t);
  };

  const handleDraftAdded = (goalTitle: string) => {
    showDraftAddedAlert(goalTitle, t);
  };

  return {
    ...screen,
    userTimeZone: user?.timeZone ?? "UTC",
    handleTaskToggle,
    handleDraftAdded,
  };
}

