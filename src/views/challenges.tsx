import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Challenge, ChallengeParticipant, PaymentMethod, Report} from "@/types";

import { Plus } from "lucide-react";

import { useAppStore } from "@/stores/useAppStore";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";

import {ChallengeInput, CreateChallengeDialog} from "@/components/CreateChallengeDialog";
import { AcceptChallengeDialog } from "@/components/AcceptChallengeDialog";

import { ChallengeCard } from "@/components/ChallengeCard";
import Config from "@/services/Config.ts";
import {useSearchParams} from "react-router-dom";
import {SelectPaymentMethodDialog} from "@/components/SelectPaymentMethodDialog.tsx";
import {ChallengeParticipantDialog} from "@/components/ChallengeParticipantDialog.tsx";
import {MessageDialog} from "@/components/MessageDialog.tsx";
import {LeaveChallengeDialog} from "@/components/LeaveChallengeDialog.tsx";

export default function ChallengesView() {
  const { challenges, goals } = useAppStore();

  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("id");

  const { addChallenge, updateChallenge, acceptChallenge, sendMessageToParticipants,
    leaveChallenge, payChallenge, getReports, getParticipants, kickParticipant, downloadReport } = useAppStore();

  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | undefined>();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentChallenge, setPaymentChallenge] = useState<Challenge | null>(null);

  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>();
  const [isMessageOpen, setIsMessageOpen] = useState(false);

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
    const challenge = challenges.find((c) => c.id === id);
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
    const baseUrl = Config.data?.api.telegram.twaURL;
    const text = "";
    const url = `${baseUrl}?startapp=challenge-${id}`;

    Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + url + '&text=' + text);
  };

  const handleLeaveChallenge = (id: string) => {
    const challenge = challenges.find((c) => c.id === id);
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

  // --- Новый обработчик для открытия AcceptChallengeDialog
  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setAcceptDialogOpen(true);
  };

  const handleAcceptDialogClose = () => {
    setSelectedChallenge(undefined);
    setAcceptDialogOpen(false);
  };

  const handleOpenParticipants = async (id: string) => {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) return;

    const reports = await getReports(challenge.id);
    setReports(reports);

    const participants = await getParticipants(challenge.id);
    setParticipants(participants);

    setSelectedChallenge(challenge);
    setReportsDialogOpen(true);
  };

  const handleDownloadReport = async (reportId: string) => {
    // 1️⃣ Найдём отчёт в объекте reports по выбранному challenge
    if (!selectedChallenge) return;

    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    // 2️⃣ Скачиваем через store
    await downloadReport(report);
  };

  const handleReportsDialogClose = () => {
    setSelectedChallenge(undefined);
    setReportsDialogOpen(false);
  };

  const handleAcceptChallenge = async (id: string) => {
    const challenge = challenges.find((c) => c.id === id);
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

  const handleSendMessage = async (challengeId: string, text: string) => {
    await sendMessageToParticipants(challengeId, text);
  }

  const handleKick = async (challengeId: string, userId: string) => {
    await kickParticipant(challengeId, userId);

    const participants = await getParticipants(challengeId);
    setParticipants(participants);
  };

  const handleOpenLink = async (id: string) => {
    const challenge = challenges.find((c) => c.id === id);

    if (challenge && challenge.link)
      Telegram.WebApp.openTelegramLink(challenge.link);
  };


  useEffect(() => {
    if (focusId) {
      const challenge = challenges.find((c) => c.id === focusId);
      if (challenge) {
        handleSelectChallenge(challenge);
      }
    }
  }, [focusId, challenges]);

  return (
    <div className="flex flex-col px-2 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <h2>
          {t("challenges.title")}
        </h2>

        <Button onClick={() => { setEditingChallenge(undefined); setChallengeDialogOpen(true); }}>
          <Plus className="size-4 mr-2" />
          {t("challenges.create")}
        </Button>
      </div>

      {/* Empty state */}
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
        /* List */
        <div className="columns-1
          sm:columns-2
          lg:columns-3
          xl:columns-4
          gap-2">
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
          onOpenMessageDialog={() => {
            setReportsDialogOpen(false); // если нужно закрыть первый
            setIsMessageOpen(true);
          }}
          participants={participants}
        />
      )}

      {selectedChallenge && (
        <MessageDialog
          challenge={selectedChallenge}
          isOpen={isMessageOpen}
          onOpenChange={setIsMessageOpen}
          onSend={handleSendMessage}
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
