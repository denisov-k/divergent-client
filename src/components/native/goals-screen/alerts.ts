import { Alert } from "react-native";
import type { TFunction } from "i18next";
import { useAppStore } from "@/stores/useAppStore";

export function showGoalTaskToggleResultAlert(
  result: { status: "completed" | "report_required" | "ignored" | "toggled"; xpReward?: number },
  t: TFunction,
) {
  if (result.status === "completed") {
    useAppStore.getState().showNativeToast({
      title: t("common.done"),
      message: t("goals.completed_alert", { xp: result.xpReward }),
      tone: "success",
    });
    return;
  }

  if (result.status === "report_required") {
    Alert.alert(t("goals.report_required_title"), t("goals.report_required_description"));
  }
}

export function showDraftAddedAlert(goalTitle: string, t: TFunction) {
  Alert.alert(t("goals.draft_added_title"), t("goals.draft_added_description", { title: goalTitle }));
}
