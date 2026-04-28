import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ProgressRing } from "@/components/shared/ProgressRing";
import { ActionChip } from "@/components/native/ActionChip";
import { Calendar, ChevronDown, ChevronUp, Users } from "@/components/native/Icons";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { getChallengeDerivedState, goalCompleted } from "@/shared/display/challenges";
import { useAppStore } from "@/stores/useAppStore";
import { appPalette } from "@/theme/palette";
import type { Challenge, Leader } from "@/types";

function ChallengeStatusBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "neutral" | "success" | "danger";
}) {
  const palette = {
    neutral: {
      backgroundColor: appPalette.surface.background,
      color: appPalette.semantic.textMuted,
      borderColor: appPalette.semantic.borderSubtle,
    },
    success: {
      backgroundColor: appPalette.semantic.successStrong,
      color: appPalette.semantic.textInverse,
      borderColor: appPalette.semantic.successStrong,
    },
    danger: {
      backgroundColor: appPalette.semantic.dangerText,
      color: appPalette.semantic.textInverse,
      borderColor: appPalette.semantic.dangerText,
    },
  }[tone];

  return (
    <View
      style={{
        alignSelf: "flex-start",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: palette.borderColor,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: palette.backgroundColor,
      }}
    >
      <Text
        style={{
          color: palette.color,
          fontSize: 12,
          fontWeight: "500",
          lineHeight: 18,
          fontFamily: "Montserrat",
        }}
      >
        {children}
      </Text>
    </View>
  );
}

export function AcceptChallengeSheet({
  open,
  challenge,
  onOpenChange,
  onAccept,
  onShare,
}: {
  open: boolean;
  challenge: Challenge;
  onOpenChange: (open: boolean) => void;
  onAccept: (id: string) => Promise<{ status: "accepted" | "payment_required" | "ignored" }>;
  onShare: (id: string) => void;
}) {
  const { t } = useTranslation();
  const { user, getLeaderboard } = useAppStore();
  const [showGoals, setShowGoals] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Leader[]>([]);

  const { challengeStatus, hasEnded, hasStarted, isParticipant, progress } = getChallengeDerivedState(
    challenge,
    user?.id,
  );

  const statusLabel =
    challengeStatus === "COMPLETED"
      ? t("challenges.status_completed")
      : challengeStatus === "FAILED"
        ? t("challenges.status_failed")
        : t("challenges.status_active");

  const openLeaderboard = async () => {
    if (showLeaderboard) {
      setShowLeaderboard(false);
      return;
    }

    const nextLeaderboard = await getLeaderboard(challenge.id);
    setLeaderboard(nextLeaderboard);
    setShowLeaderboard(true);
  };

  const handleAccept = async () => {
    await onAccept(challenge.id);
    onOpenChange(false);
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "flex-end" }}>
        <View
          style={{
            maxHeight: "88%",
            backgroundColor: appPalette.surface.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 14,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: appPalette.semantic.textStrong,
                fontFamily: "Montserrat",
              }}
            >
              {challenge.title}
            </Text>
            {!!challenge.description && (
              <Text
                style={{
                  color: appPalette.semantic.textMuted,
                  fontFamily: "Montserrat",
                  fontSize: 12,
                  lineHeight: 18,
                }}
              >
                {challenge.description}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ProgressRing progress={progress * 100} size={70} strokeWidth={6} />

            <View style={{ flex: 1, gap: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Calendar size={14} color={appPalette.semantic.textSubtle} />
                <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
                  {challenge.startsAt ? new Date(challenge.startsAt).toLocaleDateString("ru-RU") : "—"} {" > "}
                  {challenge.endsAt ? new Date(challenge.endsAt).toLocaleDateString("ru-RU") : "—"}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Users size={14} color={appPalette.semantic.textSubtle} />
                <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
                  {t("challenges.participants_count")} {challenge.participants.length}
                </Text>
              </View>

              <ChallengeStatusBadge tone="neutral">
                {challenge.isPublic ? t("challenges.visibility.public") : t("challenges.visibility.private")}
              </ChallengeStatusBadge>
              {challengeStatus !== "ACTIVE" && (
                <ChallengeStatusBadge tone={challengeStatus === "COMPLETED" ? "success" : "danger"}>
                  {statusLabel}
                </ChallengeStatusBadge>
              )}
            </View>
          </View>

          <ScrollView contentContainerStyle={{ gap: 10 }}>
            {challenge.goals.length > 0 && (
              <View style={{ gap: 8 }}>
                <Pressable
                  onPress={() => setShowGoals((current) => !current)}
                  style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
                    {t("challenges.goals")}
                  </Text>
                  {showGoals ? <ChevronUp size={18} color={appPalette.semantic.textMuted} /> : <ChevronDown size={18} color={appPalette.semantic.textMuted} />}
                </Pressable>
                {showGoals && (
                  <View style={{ gap: 8 }}>
                    {challenge.goals.map((goal) => (
                      <SurfaceCard key={goal.id} gap={8} padding={12} radius={12}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <Text style={{ flex: 1, color: appPalette.semantic.textStrong, fontSize: 12, lineHeight: 18, fontFamily: "Montserrat" }}>
                            {goal.title}
                          </Text>
                          {goalCompleted(goal) && <ChallengeStatusBadge tone="neutral">{t("challenges.completed")}</ChallengeStatusBadge>}
                        </View>
                      </SurfaceCard>
                    ))}
                  </View>
                )}
              </View>
            )}

            {!!challenge.rules && (
              <View style={{ gap: 8 }}>
                <Pressable
                  onPress={() => setShowRules((current) => !current)}
                  style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
                    {t("challenges.rules")}
                  </Text>
                  {showRules ? <ChevronUp size={18} color={appPalette.semantic.textMuted} /> : <ChevronDown size={18} color={appPalette.semantic.textMuted} />}
                </Pressable>
                {showRules && (
                  <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
                    {challenge.rules}
                  </Text>
                )}
              </View>
            )}

            <View style={{ gap: 8 }}>
              <Pressable
                onPress={() => void openLeaderboard()}
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              >
                <Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
                  {t("challenges.top_participants")}
                </Text>
                {showLeaderboard ? <ChevronUp size={18} color={appPalette.semantic.textMuted} /> : <ChevronDown size={18} color={appPalette.semantic.textMuted} />}
              </Pressable>
              {showLeaderboard && (
                <View style={{ gap: 8 }}>
                  {leaderboard.map((participant, index) => (
                    <SurfaceCard key={participant.userId} gap={8} padding={12} radius={12}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                          <ChallengeStatusBadge tone="neutral">#{index + 1}</ChallengeStatusBadge>
                          <Text style={{ flex: 1, color: appPalette.semantic.textStrong, fontSize: 12, lineHeight: 18, fontFamily: "Montserrat" }}>
                            {participant.name}
                          </Text>
                        </View>
                        <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
                          {participant.xp} XP
                        </Text>
                      </View>
                    </SurfaceCard>
                  ))}
                </View>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: appPalette.semantic.borderSubtle,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: appPalette.semantic.textStrong, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18, fontWeight: "500" }}>
                {t("challenges.participation_cost")}
              </Text>
              <Text style={{ color: appPalette.semantic.textStrong, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18, fontWeight: "500" }}>
                {challenge.price ? `${challenge.price} ${t("common.rubles_short")}` : t("challenges.free")}
              </Text>
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <ActionChip onPress={() => onOpenChange(false)}>{t("common.close")}</ActionChip>
            <ActionChip onPress={() => onShare(challenge.id)} tone="secondary">{t("common.share")}</ActionChip>
            {!isParticipant && !hasStarted && !hasEnded && (
              <ActionChip onPress={() => void handleAccept()} tone="primary">
                {t("challenges.accept")}
              </ActionChip>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
