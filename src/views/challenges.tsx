import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

import { AcceptChallengeDialog } from "@/components/AcceptChallengeDialog";
import { ChallengeCard } from "@/components/ChallengeCard";
import { ChallengeParticipantDialog } from "@/components/ChallengeParticipantDialog.tsx";
import { ChallengeInput, CreateChallengeDialog } from "@/components/CreateChallengeDialog";
import { LeaveChallengeDialog } from "@/components/LeaveChallengeDialog.tsx";
import { SelectPaymentMethodDialog } from "@/components/SelectPaymentMethodDialog.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { openExternalLink, shareLink } from "@/platform/browser";
import { useAppStore } from "@/stores/useAppStore";
import { Challenge, ChallengeParticipant, PaymentMethod, Report } from "@/types";

export default function ChallengesView() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("id");
  const paymentId = searchParams.get("paymentId");

  const { challenges, goals } = useAppStore();
  const {
    addChallenge,
    updateChallenge,
    acceptChallenge,
    leaveChallenge,
    payChallenge,
    getReports,
    getParticipants,
    kickParticipant,
    downloadReport,
    syncPaymentStatus,
  } = useAppStore();

  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | undefined>();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentChallenge, setPaymentChallenge] = useState<Challenge | null>(null);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>();
  const [reports, setReports] = useState<Report[]>([]);
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([]);

  const handleSaveChallenge = async (data: ChallengeInput) => {
    if (editingChallenge) {
      await updateChallenge(data);
    } else {
      await addChallenge(data);
    }
  };

  const handleEditChallenge = (id: string) => {
    const challenge = challenges.find((item) => item.id === id);
    setEditingChallenge(challenge);
    setChallengeDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setChallengeDialogOpen(open);
    if (!open) {
      setEditingChallenge(undefined);
    }
  };

  const handleShareChallenge = (id: string) => {
    const url = `${window.location.origin}/challenges?id=${id}`;
    void shareLink(url);
  };

  const handleLeaveChallenge = (id: string) => {
    const challenge = challenges.find((item) => item.id === id);
    if (!challenge) return;

    setSelectedChallenge(challenge);
    setLeaveDialogOpen(true);
  };

  const handleConfirmLeave = async () => {
    if (!selectedChallenge) return;

    await leaveChallenge(selectedChallenge.id);
    setLeaveDialogOpen(false);
    setSelectedChallenge(undefined);
  };

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setAcceptDialogOpen(true);
  };

  const handleAcceptDialogClose = () => {
    setSelectedChallenge(undefined);
    setAcceptDialogOpen(false);
  };

  const handleOpenParticipants = async (id: string) => {
    const challenge = challenges.find((item) => item.id === id);
    if (!challenge) return;

    const nextReports = await getReports(challenge.id);
    const nextParticipants = await getParticipants(challenge.id);

    setReports(nextReports);
    setParticipants(nextParticipants);
    setSelectedChallenge(challenge);
    setReportsDialogOpen(true);
  };

  const handleDownloadReport = async (reportId: string) => {
    if (!selectedChallenge) return;

    const report = reports.find((item) => item.id === reportId);
    if (!report) return;

    await downloadReport(report);
  };

  const handleReportsDialogClose = () => {
    setSelectedChallenge(undefined);
    setReportsDialogOpen(false);
  };

  const handleAcceptChallenge = async (id: string) => {
    const challenge = challenges.find((item) => item.id === id);
    if (!challenge) return;

    if (challenge.price && challenge.price > 0) {
      setPaymentChallenge(challenge);
      setPaymentDialogOpen(true);
    } else {
      await acceptChallenge(challenge);
    }
  };

  const handlePaymentSelect = async (method: PaymentMethod) => {
    if (!paymentChallenge) return;

    await payChallenge(paymentChallenge, method);
    setPaymentDialogOpen(false);
    setPaymentChallenge(null);
  };

  const handleKick = async (challengeId: string, userId: string) => {
    await kickParticipant(challengeId, userId);
    const nextParticipants = await getParticipants(challengeId);
    setParticipants(nextParticipants);
  };

  const handleOpenLink = async (id: string) => {
    const challenge = challenges.find((item) => item.id === id);
    if (challenge?.link) {
      openExternalLink(challenge.link);
    }
  };

  useEffect(() => {
    if (!focusId) return;

    const challenge = challenges.find((item) => item.id === focusId);
    if (challenge) {
      handleSelectChallenge(challenge);
    }
  }, [focusId, challenges]);

  useEffect(() => {
    if (!paymentId) return;
    void syncPaymentStatus(paymentId);
  }, [paymentId, syncPaymentStatus]);

  return (
    <div className="flex flex-col px-2 flex-1">
      <div className="flex items-center justify-between py-2">
        <h2>{t("challenges.title")}</h2>

        <Button onClick={() => {
          setEditingChallenge(undefined);
          setChallengeDialogOpen(true);
        }}>
          <Plus className="size-4 mr-2" />
          {t("challenges.create")}
        </Button>
      </div>

      {challenges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">{t("challenges.empty")}</p>
            <Button onClick={() => setChallengeDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              {t("challenges.create_first")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              focused={challenge.id === focusId}
              onEdit={handleEditChallenge}
              onShare={handleShareChallenge}
              onSelect={handleSelectChallenge}
              onLeave={handleLeaveChallenge}
              onOpenLink={handleOpenLink}
              onOpenParticipants={handleOpenParticipants}
              onAccept={handleAcceptChallenge}
            />
          ))}
        </div>
      )}

      <CreateChallengeDialog
        goals={goals}
        open={challengeDialogOpen}
        onOpenChange={handleOpenChange}
        challenge={editingChallenge}
        onSave={handleSaveChallenge}
      />

      <SelectPaymentMethodDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSelect={handlePaymentSelect}
      />

      {selectedChallenge && (
        <AcceptChallengeDialog
          challenge={selectedChallenge}
          isOpen={acceptDialogOpen}
          onOpenChange={handleAcceptDialogClose}
          onAccept={handleAcceptChallenge}
          onShare={handleShareChallenge}
        />
      )}

      {selectedChallenge && (
        <ChallengeParticipantDialog
          challenge={selectedChallenge}
          reports={reports}
          isOpen={reportsDialogOpen}
          onOpenChange={handleReportsDialogClose}
          onDownload={handleDownloadReport}
          onKick={handleKick}
          participants={participants}
        />
      )}

      <LeaveChallengeDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        onConfirm={handleConfirmLeave}
      />
    </div>
  );
}
