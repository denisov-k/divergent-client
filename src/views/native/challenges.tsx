import { Alert, Linking, Pressable, ScrollView, Share, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { ChallengeDetailsSheet } from "@/components/native/ChallengeDetailsSheet";
import { ChallengeFormSheet } from "@/components/native/ChallengeFormSheet";
import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SelectPaymentMethodSheet } from "@/components/native/SelectPaymentMethodSheet";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useChallengesScreen } from "@/shared/screens/challenges/useChallengesScreen";

export default function NativeChallengesScreen() {
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
  } = useChallengesScreen({
    onShareChallenge: async (id) => {
      await Share.share({
        url: `https://divergent.local/challenges?id=${id}`,
        message: `Посмотри этот челлендж: https://divergent.local/challenges?id=${id}`,
      });
    },
    onOpenLink: (url) => {
      void Linking.openURL(url);
    },
  });

  const handleAcceptChallenge = async (id: string) => {
    const result = await acceptSelectedChallenge(id);

    if (result.status === "accepted") {
      Alert.alert("Готово", "Вы присоединились к челленджу.");
      return;
    }

    if (result.status === "payment_required") {
      Alert.alert("Нужна оплата", "Откроем выбор способа оплаты и продолжим через redirect flow.");
    }
  };

  const handleOpenParticipants = async (id: string) => {
    await openParticipants(id);
  };

  const handleLeaveChallenge = async (id: string) => {
    prepareLeaveChallenge(id);

    Alert.alert("Покинуть челлендж?", "Вы потеряете доступ к его данным.", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Покинуть",
        style: "destructive",
        onPress: () => {
          void confirmLeaveChallenge();
        },
      },
    ]);
  };

  const handleKickParticipant = async (challengeId: string, userId: string) => {
    Alert.alert("Исключить участника?", "Он потеряет доступ к челленджу и его данным.", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Исключить",
        style: "destructive",
        onPress: () => {
          void kickChallengeParticipant(challengeId, userId);
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScreenHeader title="Челленджи" actionLabel="Новый" onAction={openCreateChallenge} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {challenges.length === 0 ? (
          <EmptyStateCard
            title="Пока нет челленджей"
            description="Это первый сложный native screen поверх общего controller-layer."
            actionLabel="Создать челлендж"
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
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>Изменить</Text>
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
                    <Text style={{ color: "#334155" }}>{goalsCount} целей</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f1f5f9",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ color: "#334155" }}>{participantsCount} участников</Text>
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
                      {isPaid ? `${challenge.price} ₽` : "Бесплатно"}
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
                      <Text style={{ color: "#1d4ed8" }}>Нужен отчёт</Text>
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
                    <Text style={{ color: "#64748b" }}>И ещё {challenge.goals.length - 3} целей</Text>
                  )}
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  <ActionChip onPress={() => void handleAcceptChallenge(challenge.id)} tone="primary">
                    Принять участие
                  </ActionChip>

                  <ActionChip onPress={() => void shareChallenge(challenge.id)}>Поделиться</ActionChip>

                  <ActionChip onPress={() => void handleOpenParticipants(challenge.id)}>
                    Участники
                  </ActionChip>

                  {!!challenge.link && (
                    <ActionChip onPress={() => openChallengeLink(challenge.id)}>Ссылка</ActionChip>
                  )}

                  <ActionChip onPress={() => void handleLeaveChallenge(challenge.id)} tone="danger">
                    Покинуть
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
