import { useEffect } from "react";
import { Linking, Share as NativeShare, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ChallengesScreenDialogs } from "@/components/native/challenges-screen/Dialogs";
import {
  confirmKickParticipant,
  confirmLeaveChallenge,
  showAcceptChallengeResult,
  showChallengePaymentStatusAlert,
} from "@/components/native/challenges-screen/alerts";
import {
  ChallengesScreenContent,
  ChallengesScreenHeader,
} from "@/components/native/challenges-screen/Sections";
import { buildChallengeShareUrl } from "@/platform/appUrl";
import { useChallengesScreen } from "@/shared/screens/challenges/useChallengesScreen";
import { appPalette } from "@/theme/palette";

export default function NativeChallengesScreen(props: {
  focusId?: string | null;
  paymentId?: string | null;
  onConsumeLinkState?: () => void;
}) {
  const { t } = useTranslation();
  const {
    challenges,
    goals,
    reports,
    participants,
    challengeDialogOpen,
    editingChallenge,
    paymentDialogOpen,
    reportsDialogOpen,
    selectedChallenge,
    paymentSyncStatus,
    closeChallengeDialog,
    setPaymentDialogOpen,
    openCreateChallenge,
    openEditChallenge,
    shareChallenge,
    prepareLeaveChallenge,
    confirmLeaveChallenge: confirmLeaveChallengeAction,
    openParticipants,
    downloadChallengeReport,
    closeReportsDialog,
    acceptSelectedChallenge,
    saveChallenge,
    selectPaymentMethod,
    kickChallengeParticipant,
    openChallengeLink,
    clearPaymentSyncStatus,
  } = useChallengesScreen({
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
    if (!paymentSyncStatus) {
      return;
    }

    showChallengePaymentStatusAlert(paymentSyncStatus.status, t);
    clearPaymentSyncStatus();
  }, [paymentSyncStatus, clearPaymentSyncStatus, t]);

  const handleAcceptChallenge = async (id: string) => {
    const result = await acceptSelectedChallenge(id);
    if (result.status === "ignored") {
      return;
    }
    showAcceptChallengeResult(result.status, t);
  };

  const handleOpenParticipants = async (id: string) => {
    await openParticipants(id);
  };

  const handleLeaveChallenge = async (id: string) => {
    prepareLeaveChallenge(id);
    confirmLeaveChallenge(() => {
      void confirmLeaveChallengeAction();
    }, t);
  };

  const handleKickParticipant = async (challengeId: string, userId: string) => {
    confirmKickParticipant(() => {
      void kickChallengeParticipant(challengeId, userId);
    }, t);
  };

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <ChallengesScreenHeader onCreate={openCreateChallenge} />

      <ChallengesScreenContent
        challenges={challenges}
        focusedChallengeId={props.focusId}
        onCreate={openCreateChallenge}
        onEdit={openEditChallenge}
        onShare={shareChallenge}
        onAccept={handleAcceptChallenge}
        onLeave={handleLeaveChallenge}
        onOpenLink={openChallengeLink}
        onOpenParticipants={handleOpenParticipants}
      />

      <ChallengesScreenDialogs
        selectedChallenge={selectedChallenge}
        reportsDialogOpen={reportsDialogOpen}
        participants={participants}
        reports={reports}
        paymentDialogOpen={paymentDialogOpen}
        challengeDialogOpen={challengeDialogOpen}
        editingChallenge={editingChallenge}
        goals={goals}
        onCloseReports={closeReportsDialog}
        onSetPaymentDialogOpen={setPaymentDialogOpen}
        onCloseChallengeDialog={closeChallengeDialog}
        onDownloadReport={downloadChallengeReport}
        onKickParticipant={handleKickParticipant}
        onSaveChallenge={saveChallenge}
        onSelectPaymentMethod={selectPaymentMethod}
      />
    </View>
  );
}
