import { useEffect } from "react";
import { Linking, Share as NativeShare } from "react-native";
import { useTranslation } from "react-i18next";

import { buildChallengeShareUrl } from "@/platform/appUrl";
import { useChallengesScreen } from "@/shared/screens/challenges/useChallengesScreen";
import {
  confirmKickParticipant,
  confirmLeaveChallenge,
  showAcceptChallengeResult,
  showChallengePaymentStatusAlert,
} from "./alerts";

export function useChallengesScreenController(props: {
  focusId?: string | null;
  paymentId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { t } = useTranslation();
  const screen = useChallengesScreen({
    focusId: props.focusId,
    paymentId: props.paymentId,
    onShareChallenge: async (id) => {
      const url = buildChallengeShareUrl(id);
      await NativeShare.share({
        url,
        message: t("challenges.share_message", { url }),
      });
    },
    onOpenLink: (url) => {
      void Linking.openURL(url);
    },
  });

  useEffect(() => {
    if (!props.focusId && !props.paymentId) {
      return;
    }

    props.onConsumeLinkState?.();
  }, [props.focusId, props.paymentId, props.onConsumeLinkState]);

  useEffect(() => {
    if (!screen.paymentSyncStatus) {
      return;
    }

    showChallengePaymentStatusAlert(screen.paymentSyncStatus.status, t);
    screen.clearPaymentSyncStatus();
  }, [screen.paymentSyncStatus, screen.clearPaymentSyncStatus, t]);

  const handleAcceptChallenge = async (id: string) => {
    const result = await screen.acceptSelectedChallenge(id);
    if (result.status === "ignored") {
      return result;
    }

    showAcceptChallengeResult(result.status, t);
    return result;
  };

  const handleOpenParticipants = async (id: string) => {
    return await screen.loadParticipantsData(id);
  };

  const handleLeaveChallenge = async (id: string) => {
    screen.prepareLeaveChallenge(id);
    confirmLeaveChallenge(() => {
      void screen.confirmLeaveChallenge();
    }, t);
  };

  const handleKickParticipant = async (challengeId: string, userId: string) => {
    confirmKickParticipant(() => {
      void screen.kickChallengeParticipant(challengeId, userId);
    }, t);
  };

  return {
    ...screen,
    handleAcceptChallenge,
    handleOpenParticipants,
    handleLeaveChallenge,
    handleKickParticipant,
  };
}
