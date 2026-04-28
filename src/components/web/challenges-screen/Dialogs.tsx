import { Suspense, lazy } from "react";

import type {
  Challenge,
  ChallengeInput,
  ChallengeParticipant,
  Goal,
  PaymentMethod,
  Report,
} from "@/types";

const AcceptChallengeDialog = lazy(() =>
  import("@/components/AcceptChallengeDialog").then((m) => ({ default: m.AcceptChallengeDialog })),
);
const ChallengeParticipantDialog = lazy(() =>
  import("@/components/ChallengeParticipantDialog").then((m) => ({ default: m.ChallengeParticipantDialog })),
);
const CreateChallengeDialog = lazy(() =>
  import("@/components/CreateChallengeDialog").then((m) => ({ default: m.CreateChallengeDialog })),
);
const LeaveChallengeDialog = lazy(() =>
  import("@/components/LeaveChallengeDialog").then((m) => ({ default: m.LeaveChallengeDialog })),
);
const SelectPaymentMethodDialog = lazy(() =>
  import("@/components/SelectPaymentMethodDialog").then((m) => ({ default: m.SelectPaymentMethodDialog })),
);

function DialogFallback() {
  return null;
}

export function ChallengesScreenDialogs({
  goals,
  challengeDialogOpen,
  editingChallenge,
  paymentDialogOpen,
  leaveDialogOpen,
  reportsDialogOpen,
  acceptDialogOpen,
  selectedChallenge,
  reports,
  participants,
  onCloseChallengeDialog,
  onSaveChallenge,
  onSetPaymentDialogOpen,
  onSelectPaymentMethod,
  onCloseAcceptDialog,
  onAcceptChallenge,
  onShareChallenge,
  onCloseReportsDialog,
  onDownloadReport,
  onKickParticipant,
  onSetLeaveDialogOpen,
  onConfirmLeave,
}: {
  goals: Goal[];
  challengeDialogOpen: boolean;
  editingChallenge?: Challenge | null;
  paymentDialogOpen: boolean;
  leaveDialogOpen: boolean;
  reportsDialogOpen: boolean;
  acceptDialogOpen: boolean;
  selectedChallenge?: Challenge | null;
  reports: Report[];
  participants: ChallengeParticipant[];
  onCloseChallengeDialog: (open: boolean) => void;
  onSaveChallenge: (data: ChallengeInput) => Promise<void>;
  onSetPaymentDialogOpen: (open: boolean) => void;
  onSelectPaymentMethod: (method: PaymentMethod) => Promise<boolean>;
  onCloseAcceptDialog: (open: boolean) => void;
  onAcceptChallenge: (id: string) => Promise<{ status: "accepted" | "payment_required" | "ignored" }>;
  onShareChallenge: (id: string) => void;
  onCloseReportsDialog: (open: boolean) => void;
  onDownloadReport: (reportId: string) => Promise<boolean>;
  onKickParticipant: (challengeId: string, userId: string) => Promise<void>;
  onSetLeaveDialogOpen: (open: boolean) => void;
  onConfirmLeave: () => Promise<void>;
}) {
  return (
    <Suspense fallback={<DialogFallback />}>
      {challengeDialogOpen && (
        <CreateChallengeDialog
          goals={goals}
          open={challengeDialogOpen}
          onOpenChange={onCloseChallengeDialog}
          challenge={editingChallenge ?? undefined}
          onSave={onSaveChallenge}
        />
      )}

      {paymentDialogOpen && (
        <SelectPaymentMethodDialog
          open={paymentDialogOpen}
          onOpenChange={onSetPaymentDialogOpen}
          onSelect={onSelectPaymentMethod}
        />
      )}

      {selectedChallenge && acceptDialogOpen && (
        <AcceptChallengeDialog
          challenge={selectedChallenge}
          isOpen={acceptDialogOpen}
          onOpenChange={onCloseAcceptDialog}
          onAccept={onAcceptChallenge}
          onShare={onShareChallenge}
        />
      )}

      {selectedChallenge && reportsDialogOpen && (
        <ChallengeParticipantDialog
          challenge={selectedChallenge}
          reports={reports}
          isOpen={reportsDialogOpen}
          onOpenChange={onCloseReportsDialog}
          onDownload={onDownloadReport}
          onKick={onKickParticipant}
          participants={participants}
        />
      )}

      {leaveDialogOpen && (
        <LeaveChallengeDialog
          open={leaveDialogOpen}
          onOpenChange={onSetLeaveDialogOpen}
          onConfirm={onConfirmLeave}
        />
      )}
    </Suspense>
  );
}
