import { Suspense, lazy, useEffect } from "react";
import { Alert, Linking, ScrollView, Share as NativeShare, Text, Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

const ChallengeDetailsSheet = lazy(() => import("@/components/native/ChallengeDetailsSheet").then((m) => ({ default: m.ChallengeDetailsSheet })));
const ChallengeFormSheet = lazy(() => import("@/components/native/ChallengeFormSheet").then((m) => ({ default: m.ChallengeFormSheet })));
const SelectPaymentMethodSheet = lazy(() => import("@/components/native/SelectPaymentMethodSheet").then((m) => ({ default: m.SelectPaymentMethodSheet })));

import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { NativeChallengeCardView } from "@/components/native/NativeChallengeCardView";
import { Plus } from "@/components/native/icons";
import { buildChallengeShareUrl } from "@/platform/appUrl";
import { useChallengesScreen } from "@/shared/screens/challenges/useChallengesScreen";
import { appPalette } from "@/theme/palette";

function SheetFallback() {
  return null;
}

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
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <View style={{ paddingHorizontal: 8, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, backgroundColor: appPalette.surface.background }}>
        <Text style={{ fontSize: 19, fontWeight: "500", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", lineHeight: 29 }}>
          {t("challenges.title")}
        </Text>

        <Pressable
          onPress={openCreateChallenge}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: appPalette.semantic.infoSurface,
            borderWidth: 1,
            borderColor: appPalette.semantic.infoBorder,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Plus size={16} color={appPalette.semantic.infoText} />
          <Text style={{ color: appPalette.semantic.infoText, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
            {t("challenges.create")}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
        {challenges.length === 0 ? (
          <EmptyStateCard title={t("challenges.empty")} description={t("challenges.empty_native_description")} actionLabel={t("challenges.create_first")} onAction={openCreateChallenge} />
        ) : (
          challenges.map((challenge) => (
            <NativeChallengeCardView
              key={challenge.id}
              challenge={challenge}
              focused={challenge.id === props.focusId}
              onEdit={openEditChallenge}
              onShare={shareChallenge}
              onAccept={handleAcceptChallenge}
              onLeave={handleLeaveChallenge}
              onOpenLink={openChallengeLink}
              onOpenParticipants={handleOpenParticipants}
            />
          ))
        )}
      </ScrollView>

      <Suspense fallback={<SheetFallback />}>
        {selectedChallenge && reportsDialogOpen && (
          <ChallengeDetailsSheet open={reportsDialogOpen} challenge={selectedChallenge} participants={participants} reports={reports} onOpenChange={(open) => { if (!open) { closeReportsDialog(); } }} onDownload={downloadChallengeReport} onKick={handleKickParticipant} />
        )}
        {paymentDialogOpen && (
          <SelectPaymentMethodSheet open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen} onSelect={selectPaymentMethod} />
        )}
        {challengeDialogOpen && (
          <ChallengeFormSheet open={challengeDialogOpen} challenge={editingChallenge} goals={goals} onOpenChange={closeChallengeDialog} onSave={saveChallenge} />
        )}
      </Suspense>
    </View>
  );
}
