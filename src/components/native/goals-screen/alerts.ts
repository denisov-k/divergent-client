import { Alert } from "react-native";
import type { TFunction } from "i18next";

export function showGoalTaskToggleResultAlert(
  result: { status: "completed" | "report_required" | "ignored" | "toggled"; xpReward?: number },
  t: TFunction,
) {
  if (result.status === "completed") {
    Alert.alert(t("common.done"), t("goals.completed_alert", { xp: result.xpReward }));
    return;
  }

  if (result.status === "report_required") {
    Alert.alert(t("goals.report_required_title"), t("goals.report_required_description"));
  }
}

export function showDraftAddedAlert(goalTitle: string, t: TFunction) {
  Alert.alert(t("goals.draft_added_title"), t("goals.draft_added_description", { title: goalTitle }));
}
