import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Challenge, PaymentMethod} from "@/types";

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
import {ReportsDialog} from "@/components/ReportsDialog.tsx";

export default function ChallengesView() {
  const { challenges, goals, reports } = useAppStore();

  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  // const navigate = useNavigate();

  const { addChallenge, updateChallenge, acceptChallenge,
    leaveChallenge, payChallenge, getReports, downloadReport } = useAppStore();

  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | undefined>();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentChallenge, setPaymentChallenge] = useState<Challenge | null>(null);

  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>();

  const selectedChallengeReports = selectedChallenge ? reports[selectedChallenge.id] ?? [] : [];

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

  const handleLeaveChallenge = async (id: string) => {
    await leaveChallenge(id);
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

  const handleOpenReports = async (id: string) => {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) return;

    setSelectedChallenge(challenge);
    setReportsDialogOpen(true);

    await getReports(challenge.id);
  };

  const handleDownloadReport = async (reportId: string) => {
    // 1️⃣ Найдём отчёт в объекте reports по выбранному challenge
    if (!selectedChallenge) return;

    const challengeReports = reports[selectedChallenge.id] ?? [];
    const report = challengeReports.find(r => r.id === reportId);
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

  const handleOpenLink = async (id: string) => {
    const challenge = challenges.find((c) => c.id === id);

    if (challenge && challenge.link)
      Telegram.WebApp.openTelegramLink(challenge.link);
  };

  useEffect(() => {
    // Проверяем параметр startapp
    const challengeId = searchParams.get("challengeId");
    console.log(challengeId);

    if (challengeId) {
      const challenge = challenges.find((c) => c.id === challengeId);
      if (challenge) {
        handleSelectChallenge(challenge);
      }
    }
  }, [searchParams, challenges]);

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
        <div className="flex flex-wrap gap-2 overflow-auto flex-1">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="
                w-full
                sm:w-[calc(50%-0.25rem)]
                lg:w-[calc(33.333%-0.4rem)]
                xl:w-[calc(25%-0.4rem)]
              "
            >
              <ChallengeCard
                challenge={challenge}
                onEdit={handleEditChallenge}
                onShare={handleShareChallenge}
                onSelect={handleSelectChallenge}
                onLeave={handleLeaveChallenge}
                onOpenLink={handleOpenLink}
                onOpenReports={handleOpenReports}
                onAccept={handleAcceptChallenge}
              />
            </div>
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
        <ReportsDialog
          challenge={selectedChallenge}
          reports={selectedChallengeReports}
          isOpen={reportsDialogOpen}
          onOpenChange={handleReportsDialogClose}
          onDownload={handleDownloadReport}
        />
      )}
    </div>
  );
}
