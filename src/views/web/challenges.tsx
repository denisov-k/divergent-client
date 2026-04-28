import { lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AcceptChallengeDialog = lazy(() => import("@/components/AcceptChallengeDialog").then((m) => ({ default: m.AcceptChallengeDialog })));
const ChallengeParticipantDialog = lazy(() => import("@/components/ChallengeParticipantDialog").then((m) => ({ default: m.ChallengeParticipantDialog })));
const CreateChallengeDialog = lazy(() => import("@/components/CreateChallengeDialog").then((m) => ({ default: m.CreateChallengeDialog })));
const LeaveChallengeDialog = lazy(() => import("@/components/LeaveChallengeDialog").then((m) => ({ default: m.LeaveChallengeDialog })));
const SelectPaymentMethodDialog = lazy(() => import("@/components/SelectPaymentMethodDialog").then((m) => ({ default: m.SelectPaymentMethodDialog })));

import { ChallengeCard } from "@/components/ChallengeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildChallengeShareUrl } from "@/platform/appUrl";
import { openExternalLink, shareLink } from "@/platform/browser";
import { useChallengesScreen } from "@/shared/screens/challenges/useChallengesScreen";

function DialogFallback() {
  return null;
}

export default function ChallengesScreen() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("id");
  const paymentId = searchParams.get("paymentId");

  const {
    challenges,
    goals,
    reports,
    participants,
    challengeDialogOpen,
    editingChallenge,
    paymentDialogOpen,
    leaveDialogOpen,
    reportsDialogOpen,
    acceptDialogOpen,
    selectedChallenge,
    setPaymentDialogOpen,
    setLeaveDialogOpen,
    openCreateChallenge,
    openEditChallenge,
    saveChallenge,
    closeChallengeDialog,
    shareChallenge,
    prepareLeaveChallenge,
    confirmLeaveChallenge,
    closeAcceptDialog,
    selectChallenge,
    openParticipants,
    downloadChallengeReport,
    closeReportsDialog,
    acceptSelectedChallenge,
    selectPaymentMethod,
    kickChallengeParticipant,
    openChallengeLink,
  } = useChallengesScreen({
    focusId,
    paymentId,
    onShareChallenge: (id) => {
      const url = buildChallengeShareUrl(id);
      void shareLink(url);
    },
    onOpenLink: openExternalLink,
  });

  const handleSaveChallenge = async (...args: Parameters<typeof saveChallenge>) => {
    await saveChallenge(...args);
  };

  const handleConfirmLeave = async () => {
    await confirmLeaveChallenge();
  };

  return (
    <div className="flex flex-1 flex-col px-2">
      <div className="flex items-center justify-between py-2">
        <h2>{t("challenges.title")}</h2>

        <Button onClick={openCreateChallenge}>
          <Plus className="mr-2 size-4" />
          {t("challenges.create")}
        </Button>
      </div>

      {challenges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">{t("challenges.empty")}</p>
            <Button onClick={openCreateChallenge}>
              <Plus className="mr-2 size-4" />
              {t("challenges.create_first")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              focused={challenge.id === focusId}
              onEdit={openEditChallenge}
              onShare={shareChallenge}
              onSelect={selectChallenge}
              onLeave={prepareLeaveChallenge}
              onOpenLink={openChallengeLink}
              onOpenParticipants={openParticipants}
              onAccept={acceptSelectedChallenge}
            />
          ))}
        </div>
      )}

      <Suspense fallback={<DialogFallback />}>
        {challengeDialogOpen && (
          <CreateChallengeDialog
            goals={goals}
            open={challengeDialogOpen}
            onOpenChange={closeChallengeDialog}
            challenge={editingChallenge}
            onSave={handleSaveChallenge}
          />
        )}

        {paymentDialogOpen && (
          <SelectPaymentMethodDialog
            open={paymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            onSelect={selectPaymentMethod}
          />
        )}

        {selectedChallenge && acceptDialogOpen && (
          <AcceptChallengeDialog
            challenge={selectedChallenge}
            isOpen={acceptDialogOpen}
            onOpenChange={closeAcceptDialog}
            onAccept={acceptSelectedChallenge}
            onShare={shareChallenge}
          />
        )}

        {selectedChallenge && reportsDialogOpen && (
          <ChallengeParticipantDialog
            challenge={selectedChallenge}
            reports={reports}
            isOpen={reportsDialogOpen}
            onOpenChange={closeReportsDialog}
            onDownload={downloadChallengeReport}
            onKick={kickChallengeParticipant}
            participants={participants}
          />
        )}

        {leaveDialogOpen && (
          <LeaveChallengeDialog
            open={leaveDialogOpen}
            onOpenChange={setLeaveDialogOpen}
            onConfirm={handleConfirmLeave}
          />
        )}
      </Suspense>
    </div>
  );
}


