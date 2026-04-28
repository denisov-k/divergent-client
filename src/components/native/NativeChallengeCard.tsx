import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { buildGoalsPath } from "@/app/routes";
import { ProgressRing } from "@/components/ProgressRing";
import { Calendar, ChevronDown, ChevronUp, DoorOpen, Edit, Share, Swords, Users } from "@/components/native/icons";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { buildNativeRouteUrl } from "@/platform/appUrl.native";
import { useAppStore } from "@/stores/useAppStore";
import { appPalette } from "@/theme/palette";
import type { Challenge, Goal, Leader } from "@/types";

function formatChallengeDate(value?: string) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
  } catch {
    return value;
  }
}

function goalCompleted(goal: Goal) {
  if (goal.goalType === "TASK") return Boolean(goal.lastCompletedAt);
  if (goal.goalType === "PROGRESS" && goal.targetValue && goal.targetValue > 0) return (goal.currentValue ?? 0) >= goal.targetValue;
  return false;
}

function SmallAction({ icon, onPress }: { icon: React.ReactNode; onPress?: () => void }) {
  if (!onPress) return null;
  return <Pressable onPress={onPress} hitSlop={8} style={{ width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>{icon}</Pressable>;
}

function SmallBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) {
  const palette = {
    neutral: { backgroundColor: appPalette.surface.background, color: appPalette.semantic.textMuted, borderColor: appPalette.semantic.borderSubtle },
    success: { backgroundColor: appPalette.semantic.successSurface, color: appPalette.semantic.successText, borderColor: appPalette.semantic.successBorder },
    warning: { backgroundColor: appPalette.semantic.warningStrong, color: appPalette.brand.primaryForeground, borderColor: appPalette.semantic.warningStrong },
    danger: { backgroundColor: appPalette.semantic.dangerText, color: appPalette.brand.primaryForeground, borderColor: appPalette.semantic.dangerText },
    info: { backgroundColor: appPalette.semantic.infoSurface, color: appPalette.semantic.infoText, borderColor: appPalette.semantic.infoBorder },
  }[tone];

  return (
    <View style={{ alignSelf: "flex-start", borderRadius: 8, borderWidth: 1, borderColor: palette.borderColor, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: palette.backgroundColor }}>
      <Text style={{ color: palette.color, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{children}</Text>
    </View>
  );
}

export function NativeChallengeCard({ challenge, focused = false, onEdit, onShare, onAccept, onLeave, onOpenLink, onOpenParticipants }: { challenge: Challenge; focused?: boolean; onEdit?: (id: string) => void; onShare?: (id: string) => void; onAccept?: (id: string) => void; onLeave?: (id: string) => void; onOpenLink?: (id: string) => void; onOpenParticipants?: (id: string) => void; }) {
  const { t } = useTranslation();
  const { user, getLeaderboard } = useAppStore();
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Leader[]>([]);

  const isCreator = challenge.creatorId === user?.id;
  const isParticipant = challenge.participants.some((participant) => participant.userId === user?.id);
  const goals = challenge.goals;
  const completedGoals = goals.filter(goalCompleted).length;
  const progress = goals.length === 0 ? 0 : goals.reduce((sum, goal) => {
    if (goal.goalType === "TASK") return sum + (goal.lastCompletedAt ? 1 : 0);
    if (goal.goalType === "PROGRESS" && goal.targetValue && goal.targetValue > 0) {
      const value = Math.min(goal.currentValue ?? 0, goal.targetValue);
      return sum + value / goal.targetValue;
    }
    return sum;
  }, 0) / goals.length;

  const allGoalsCompleted = goals.every(goalCompleted);
  const now = new Date();
  const challengeStart = challenge.startsAt ? new Date(challenge.startsAt) : null;
  const challengeEnd = challenge.endsAt ? new Date(challenge.endsAt) : null;
  const hasStarted = challengeStart ? new Date(challengeStart.getTime() + 24 * 60 * 60 * 1000) <= now : false;
  const hasEnded = challengeEnd ? new Date(challengeEnd.getTime() + 24 * 60 * 60 * 1000) <= now : false;
  const challengeStatus: "COMPLETED" | "FAILED" | "ACTIVE" = !isParticipant ? "ACTIVE" : allGoalsCompleted ? "COMPLETED" : challenge.endsAt && new Date(challenge.endsAt) < now ? "FAILED" : "ACTIVE";
  const statusLabel = challengeStatus === "COMPLETED" ? t("challenges.status_completed") : challengeStatus === "FAILED" ? t("challenges.status_failed") : t("challenges.status_active");

  const openGoal = (goalId: string) => { if (!isParticipant) return; void Linking.openURL(buildNativeRouteUrl(buildGoalsPath({ id: goalId }))); };
  const openLeaderboard = async () => { if (isLeaderboardOpen) { setIsLeaderboardOpen(false); return; } const nextLeaderboard = await getLeaderboard(challenge.id); setLeaderboard(nextLeaderboard); setIsLeaderboardOpen(true); };

  return (
    <View style={{ opacity: (hasEnded || hasStarted) && !isParticipant ? 0.6 : 1 }}>
      <SurfaceCard gap={12} padding={24} radius={12}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
          <View style={{ flex: 1, gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Swords size={20} color={appPalette.brand.primary} />
              <Text style={{ fontSize: 12, fontWeight: "500", color: appPalette.semantic.textStrong, flex: 1, fontFamily: "Montserrat", lineHeight: 12 }}>{challenge.title}</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {(isCreator && <SmallBadge>{t("common.created_by")}</SmallBadge>) || (isParticipant && <SmallBadge>{t("common.participating")}</SmallBadge>)}
              {challengeStatus !== "ACTIVE" && <SmallBadge tone={challengeStatus === "COMPLETED" ? "success" : "danger"}>{statusLabel}</SmallBadge>}
            </View>
            {!!challenge.description && <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{challenge.description}</Text>}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {isParticipant && <ProgressRing progress={progress * 100} size={70} strokeWidth={6} />}
            <View>
              {isCreator && !!onEdit && <SmallAction icon={<Edit size={14} color={appPalette.semantic.textMuted} />} onPress={() => onEdit(challenge.id)} />}
              {!!onShare && <SmallAction icon={<Share size={14} color={appPalette.semantic.textMuted} />} onPress={() => onShare(challenge.id)} />}
              {!isCreator && isParticipant && !!onLeave && <SmallAction icon={<DoorOpen size={14} color={appPalette.semantic.textMuted} />} onPress={() => onLeave(challenge.id)} />}
            </View>
          </View>
        </View>

        {isParticipant && (
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("goals.progress")}</Text>
              <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{completedGoals} / {goals.length} {t("challenges.goals_count")}</Text>
            </View>
            <View style={{ height: 8, backgroundColor: appPalette.semantic.borderSubtle, borderRadius: 999, overflow: "hidden" }}><View style={{ width: `${progress * 100}%`, height: "100%", backgroundColor: appPalette.brand.primary }} /></View>
          </View>
        )}

        <View style={{ gap: 10 }}>
          <Pressable onPress={() => setIsGoalsOpen((current) => !current)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("challenges.goals")}</Text>
            {isGoalsOpen ? <ChevronUp size={18} color={appPalette.semantic.textMuted} /> : <ChevronDown size={18} color={appPalette.semantic.textMuted} />}
          </Pressable>
          {isGoalsOpen && <View style={{ gap: 8 }}>{goals.map((goal) => <Pressable key={goal.id} onPress={() => openGoal(goal.id)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: focused ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: focused ? appPalette.semantic.infoSurfaceStrong : appPalette.surface.background }}><Text style={{ flex: 1, color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }} numberOfLines={2}>{goal.title}</Text>{goalCompleted(goal) && <SmallBadge>✓</SmallBadge>}</Pressable>)}</View>}
        </View>

        {!!challenge.rules && <View style={{ gap: 10 }}><Pressable onPress={() => setIsRulesOpen((current) => !current)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("challenges.rules")}</Text>{isRulesOpen ? <ChevronUp size={18} color={appPalette.semantic.textMuted} /> : <ChevronDown size={18} color={appPalette.semantic.textMuted} />}</Pressable>{isRulesOpen && <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{challenge.rules}</Text>}</View>}

        <View style={{ gap: 10 }}>
          <Pressable onPress={() => void openLeaderboard()} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("challenges.top_participants")}</Text>{isLeaderboardOpen ? <ChevronUp size={18} color={appPalette.semantic.textMuted} /> : <ChevronDown size={18} color={appPalette.semantic.textMuted} />}</Pressable>
          {isLeaderboardOpen && <View style={{ gap: 8 }}>{leaderboard.map((participant, index) => <View key={participant.userId} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: focused ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: focused ? appPalette.semantic.infoSurfaceStrong : appPalette.surface.background }}><View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}><SmallBadge>#{index + 1}</SmallBadge><Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat", flex: 1 }} numberOfLines={1}>{participant.name}</Text></View><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{participant.xp} XP</Text></View>)}</View>}
        </View>

        <View style={{ borderWidth: 1, borderColor: focused ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("challenges.participation_cost")}</Text><Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{challenge.price ? `${challenge.price} руб.` : t("challenges.free")}</Text></View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
          {!!onOpenLink && !!challenge.link && isParticipant && <Pressable onPress={() => onOpenLink(challenge.id)} style={{ backgroundColor: appPalette.brand.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}><Text style={{ color: appPalette.brand.primaryForeground, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("common.community")}</Text></Pressable>}
          {!!onOpenParticipants && isCreator && <Pressable onPress={() => onOpenParticipants(challenge.id)} style={{ backgroundColor: appPalette.brand.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}><Text style={{ color: appPalette.brand.primaryForeground, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("common.participants")}</Text></Pressable>}
          {!isParticipant && !!onAccept && !hasStarted && !hasEnded && <Pressable onPress={() => onAccept(challenge.id)} style={{ backgroundColor: appPalette.brand.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}><Text style={{ color: appPalette.brand.primaryForeground, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("challenges.accept")}</Text></Pressable>}
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: appPalette.semantic.borderSubtle, paddingTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1 }}><Calendar size={14} color={appPalette.semantic.textSubtle} /><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat", flex: 1 }}>{formatChallengeDate(challenge.startsAt)} {" → "} {formatChallengeDate(challenge.endsAt)}</Text></View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><Users size={14} color={appPalette.semantic.textSubtle} /><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{challenge.participants.length}</Text></View>
        </View>
      </SurfaceCard>
    </View>
  );
}

