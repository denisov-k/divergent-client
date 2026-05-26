import { Alert } from "react-native";
import type { TFunction } from "i18next";

type PaymentSyncStatus = "SUCCESS" | "PENDING" | "CANCELLED" | "FAILED";

export function showChallengePaymentStatusAlert(status: PaymentSyncStatus, t: TFunction) {
  if (status === "SUCCESS") {
    Alert.alert(t("challenges.payment_confirmed_title"), t("challenges.payment_confirmed_description"));
    return;
  }

  if (status === "PENDING") {
    Alert.alert(t("challenges.payment_pending_title"), t("challenges.payment_pending_description"));
    return;
  }

  if (status === "CANCELLED") {
    Alert.alert(t("challenges.payment_cancelled_title"), t("challenges.payment_cancelled_description"));
    return;
  }

  Alert.alert(t("challenges.payment_unknown_title"), t("challenges.payment_unknown_description"));
}

export function confirmLeaveChallenge(onConfirm: () => void, t: TFunction) {
  Alert.alert(t("challenges.leave_native_title"), t("challenges.leave_native_description"), [
    { text: t("common.cancel"), style: "cancel" },
    {
      text: t("challenges.leave"),
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
}

export function confirmKickParticipant(onConfirm: () => void, t: TFunction) {
  Alert.alert(t("challenges.kick_native_title"), t("challenges.kick_native_description"), [
    { text: t("common.cancel"), style: "cancel" },
    {
      text: t("challenges.kick"),
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
}

export function showAcceptChallengeResult(status: "accepted" | "payment_required", t: TFunction) {
  if (status === "accepted") {
    Alert.alert(t("challenges.accepted_title"), t("challenges.accepted_description"));
    return;
  }

  Alert.alert(t("challenges.payment_required_title"), t("challenges.payment_required_description"));
}

export function showPaidChallengeUnavailableAlert(t: TFunction) {
  Alert.alert(
    t("challenges.mobile_paid_unavailable_title"),
    t("challenges.mobile_paid_unavailable_description"),
  );
}
