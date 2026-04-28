import { View } from "react-native";

import { ChallengesScreenDialogs } from "@/components/native/challenges-screen/Dialogs";
import {
  ChallengesScreenContent,
  ChallengesScreenHeader,
} from "@/components/native/challenges-screen/Sections";
import { useChallengesScreenController } from "@/components/native/challenges-screen/useChallengesScreenController";
import { appPalette } from "@/theme/palette";

export default function NativeChallengesScreen(props: {
  focusId?: string | null;
  paymentId?: string | null;
  onConsumeLinkState?: () => void;
}) {
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
    closeChallengeDialog,
    setPaymentDialogOpen,
    openCreateChallenge,
    openEditChallenge,
    shareChallenge,
    downloadChallengeReport,
    closeReportsDialog,
    saveChallenge,
    selectPaymentMethod,
    openChallengeLink,
    handleAcceptChallenge,
    handleOpenParticipants,
    handleLeaveChallenge,
    handleKickParticipant,
  } = useChallengesScreenController(props);

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
