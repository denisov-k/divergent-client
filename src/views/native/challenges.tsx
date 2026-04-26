import { useEffect } from "react";
import { Alert, Linking, Pressable, ScrollView, Share, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { ChallengeDetailsSheet } from "@/components/native/ChallengeDetailsSheet";
import { ChallengeFormSheet } from "@/components/native/ChallengeFormSheet";
import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SelectPaymentMethodSheet } from "@/components/native/SelectPaymentMethodSheet";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { buildChallengeShareUrl } from "@/platform/appUrl";
import { useChallengesScreen } from "@/shared/screens/challenges/useChallengesScreen";

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
    confirmLeaveChallenge,
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
      await Share.share({
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

    if (paymentSyncStatus.status === "SUCCESS") {
      Alert.alert(t("challenges.payment_confirmed_title"), t("challenges.payment_confirmed_description"));
    } else if (paymentSyncStatus.status === "PENDING") {
      Alert.alert(t("challenges.payment_pending_title"), t("challenges.payment_pending_description"));
    } else if (paymentSyncStatus.status === "CANCELLED") {
      Alert.alert(t("challenges.payment_cancelled_title"), t("challenges.payment_cancelled_description"));
    } else {
      Alert.alert(t("challenges.payment_unknown_title"), t("challenges.payment_unknown_description"));
    }

    clearPaymentSyncStatus();
  }, [paymentSyncStatus, clearPaymentSyncStatus, t]);

  const handleAcceptChallenge = async (id: string) => {
    const result = await acceptSelectedChallenge(id);

    if (result.status === "accepted") {
      Alert.alert(t("challenges.accepted_title"), t("challenges.accepted_description"));
      return;
    }

    if (result.status === "payment_required") {
      Alert.alert(t("challenges.payment_required_title"), t("challenges.payment_required_description"));
    }
  };

  const handleOpenParticipants = async (id: string) => {
    await openParticipants(id);
  };

  const handleLeaveChallenge = async (id: string) => {
    prepareLeaveChallenge(id);

    Alert.alert(t("challenges.leave_native_title"), t("challenges.leave_native_description"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("challenges.leave"),
        style: "destructive",
        onPress: () => {
          void confirmLeaveChallenge();
        },
      },
    ]);
  };

  const handleKickParticipant = async (challengeId: string, userId: string) => {
    Alert.alert(t("challenges.kick_native_title"), t("challenges.kick_native_description"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("challenges.kick"),
        style: "destructive",
        onPress: () => {
          void kickChallengeParticipant(challengeId, userId);
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScreenHeader title={t("challenges.title")} actionLabel={t("common.create")} onAction={openCreateChallenge} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {challenges.length === 0 ? (
          <EmptyStateCard
            title={t("challenges.empty_native_title")}
            description={t("challenges.empty_native_description")}
            actionLabel={t("challenges.create")}
            onAction={openCreateChallenge}
          />
        ) : (
          challenges.map((challenge) => {
            const goalsCount = challenge.goals.length;
            const participantsCount = challenge.participants.length;
            const isPaid = Boolean(challenge.price && challenge.price > 0);

            return (
              <SurfaceCard key={challenge.id}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>
                      {challenge.title}
                    </Text>
                    {!!challenge.description && (
                      <Text style={{ marginTop: 4, color: "#64748b" }}>{challenge.description}</Text>
                    )}
                  </View>

                  <Pressable onPress={() => openEditChallenge(challenge.id)}>
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>{t("common.edit")}</Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  <View
                    style={{
                      backgroundColor: "#f1f5f9",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ color: "#334155" }}>{goalsCount} {t("challenges.goals_count")}</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f1f5f9",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ color: "#334155" }}>{participantsCount} {t("challenges.participants").toLowerCase()}</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: isPaid ? "#fef3c7" : "#dcfce7",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ color: isPaid ? "#92400e" : "#166534" }}>
                      {isPaid ? `${challenge.price} ₽` : t("challenges.free")}
                    </Text>
                  </View>
                  {challenge.requiresReport && (
                    <View
                      style={{
                        backgroundColor: "#dbeafe",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: "#1d4ed8" }}>{t("challenges.requires_report")}</Text>
                    </View>
                  )}
                </View>

                <View style={{ gap: 8 }}>
                  {challenge.goals.slice(0, 3).map((goal) => (
                    <View
                      key={goal.id}
                      style={{
                        backgroundColor: "#f8fafc",
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: "#0f172a" }}>{goal.title}</Text>
                    </View>
                  ))}
                  {challenge.goals.length > 3 && (
                    <Text style={{ color: "#64748b" }}>{t("challenges.goals_more", { count: challenge.goals.length - 3 })}</Text>
                  )}
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  <ActionChip onPress={() => void handleAcceptChallenge(challenge.id)} tone="primary">
                    {t("challenges.accept")}
                  </ActionChip>

                  <ActionChip onPress={() => void shareChallenge(challenge.id)}>{t("common.share")}</ActionChip>

                  <ActionChip onPress={() => void handleOpenParticipants(challenge.id)}>
                    {t("challenges.participants")}
                  </ActionChip>

                  {!!challenge.link && (
                    <ActionChip onPress={() => openChallengeLink(challenge.id)}>{t("challenges.link")}</ActionChip>
                  )}

                  <ActionChip onPress={() => void handleLeaveChallenge(challenge.id)} tone="danger">
                    {t("challenges.leave")}
                  </ActionChip>
                </View>
              </SurfaceCard>
            );
          })
        )}
      </ScrollView>

      {selectedChallenge && (
        <ChallengeDetailsSheet
          open={reportsDialogOpen}
          challenge={selectedChallenge}
          participants={participants}
          reports={reports}
          onOpenChange={(open) => {
            if (!open) {
              closeReportsDialog();
            }
          }}
          onDownload={downloadChallengeReport}
          onKick={handleKickParticipant}
        />
      )}

      <SelectPaymentMethodSheet
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSelect={selectPaymentMethod}
      />

      <ChallengeFormSheet
        open={challengeDialogOpen}
        challenge={editingChallenge}
        goals={goals}
        onOpenChange={closeChallengeDialog}
        onSave={saveChallenge}
      />
    </View>
  );
}

