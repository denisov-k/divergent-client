import { Suspense, lazy } from "react";

import type {
  Challenge,
  ChallengeInput,
  ChallengeParticipant,
  Goal,
  PaymentMethod,
  Report,
} from "@/types";

const ChallengeDetailsSheet = lazy(() =>
  import("@/components/native/ChallengeDetailsSheet").then((m) => ({ default: m.ChallengeDetailsSheet })),
);
const ChallengeFormSheet = lazy(() =>
  import("@/components/native/ChallengeFormSheet").then((m) => ({ default: m.ChallengeFormSheet })),
);
const SelectPaymentMethodSheet = lazy(() =>
  import("@/components/native/SelectPaymentMethodSheet").then((m) => ({ default: m.SelectPaymentMethodSheet })),
);

function SheetFallback() {
  return null;
}

export function ChallengesScreenDialogs({
  selectedChallenge,
  reportsDialogOpen,
  participants,
  reports,
  paymentDialogOpen,
  challengeDialogOpen,
  editingChallenge,
  goals,
  onCloseReports,
  onSetPaymentDialogOpen,
  onCloseChallengeDialog,
  onDownloadReport,
  onKickParticipant,
  onSaveChallenge,
  onSelectPaymentMethod,
}: {
  selectedChallenge?: Challenge | null;
  reportsDialogOpen: boolean;
  participants: ChallengeParticipant[];
  reports: Report[];
  paymentDialogOpen: boolean;
  challengeDialogOpen: boolean;
  editingChallenge?: Challenge | null;
  goals: Goal[];
  onCloseReports: () => void;
  onSetPaymentDialogOpen: (open: boolean) => void;
  onCloseChallengeDialog: (open: boolean) => void;
  onDownloadReport: (reportId: string) => Promise<boolean>;
  onKickParticipant: (challengeId: string, userId: string) => Promise<void>;
  onSaveChallenge: (data: ChallengeInput) => Promise<unknown>;
  onSelectPaymentMethod: (method: PaymentMethod) => Promise<boolean>;
}) {
  return (
    <Suspense fallback={<SheetFallback />}>
      {selectedChallenge && reportsDialogOpen && (
        <ChallengeDetailsSheet
          open={reportsDialogOpen}
          challenge={selectedChallenge}
          participants={participants}
          reports={reports}
          onOpenChange={(open) => {
            if (!open) onCloseReports();
          }}
          onDownload={onDownloadReport}
          onKick={onKickParticipant}
        />
      )}

      {paymentDialogOpen && (
        <SelectPaymentMethodSheet
          open={paymentDialogOpen}
          onOpenChange={onSetPaymentDialogOpen}
          onSelect={onSelectPaymentMethod}
        />
      )}

      {challengeDialogOpen && (
        <ChallengeFormSheet
          open={challengeDialogOpen}
          challenge={editingChallenge ?? undefined}
          goals={goals}
          onOpenChange={onCloseChallengeDialog}
          onSave={onSaveChallenge}
        />
      )}
    </Suspense>
  );
}
