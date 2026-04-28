import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import Svg from "react-native-svg";
import { useTranslation } from "react-i18next";

const SvgPrimitives = Svg as typeof Svg & { Line: React.ComponentType<any>; Polyline: React.ComponentType<any>; Circle: React.ComponentType<any>; };

import { ChartSpline, ChevronDown, Flame, Target, Trophy, Zap } from "@/components/native/icons";
import { NativePeriodCalendar } from "@/components/native/NativePeriodCalendar";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useProgressScreen } from "@/shared/screens/progress/useProgressScreen";
import { appPalette } from "@/theme/palette";

function StatCard({ title, value, description, icon }: { title: string; value: string | number; description?: string; icon: React.ReactNode; }) {
  return <SurfaceCard gap={8} padding={16} radius={12}><View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat", flex: 1 }}>{title}</Text>{icon}</View><View style={{ gap: 4 }}><Text style={{ color: appPalette.semantic.textStrong, fontSize: 24, fontWeight: "500", lineHeight: 30, fontFamily: "Montserrat" }}>{value}</Text>{!!description && <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{description}</Text>}</View></SurfaceCard>;
}

function WeeklyXpChart({ data }: { data: { name: string; value: number }[] }) {
  const width = 320, height = 176, paddingLeft = 16, paddingRight = 16, paddingTop = 16, paddingBottom = 36;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const gridLines = 4;
  const points = data.map((item, index) => ({ ...item, x: paddingLeft + (data.length === 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth), y: paddingTop + chartHeight - (item.value / maxValue) * chartHeight }));
  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  return <View style={{ gap: 8 }}><Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>{Array.from({ length: gridLines + 1 }, (_, index) => { const y = paddingTop + (chartHeight / gridLines) * index; return <SvgPrimitives.Line key={`grid-${index}`} x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={appPalette.semantic.borderSubtle} strokeWidth="1" />; })}<SvgPrimitives.Line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + chartHeight} stroke={appPalette.semantic.borderSubtle} strokeWidth="1" /><SvgPrimitives.Line x1={paddingLeft} y1={paddingTop + chartHeight} x2={width - paddingRight} y2={paddingTop + chartHeight} stroke={appPalette.semantic.borderStrong} strokeWidth="1" /><SvgPrimitives.Polyline points={polylinePoints} fill="none" stroke={appPalette.brand.primary} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />{points.map((point) => <SvgPrimitives.Circle key={`${point.name}-${point.x}`} cx={point.x} cy={point.y} r="4" fill={appPalette.brand.primary} />)}</Svg><View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4 }}>{data.map((item) => <View key={item.name} style={{ flex: 1, alignItems: "center", gap: 2 }}><Text style={{ color: appPalette.semantic.text, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{item.name}</Text><Text style={{ color: appPalette.semantic.textMuted, fontSize: 10, fontWeight: "400", lineHeight: 14, fontFamily: "Montserrat" }}>{item.value}</Text></View>)}</View></View>;
}

export default function NativeProgressScreen(props: { goalId?: string | null; onConsumeLinkState?: () => void; }) {
  const { t } = useTranslation();
  const [goalId, setGoalId] = useState<string | null>(props.goalId || null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { goals, rewards, selectedGoal, filteredGoals, xp, activity, loadingActivity, completedGoals, categoryData, weeklyXpData, streakDays } = useProgressScreen(goalId);

  useEffect(() => { if (props.goalId === undefined) return; setGoalId(props.goalId || null); props.onConsumeLinkState?.(); }, [props.goalId, props.onConsumeLinkState]);
  const unlockedRewards = rewards.filter((reward) => reward.isUnlocked).length;
  const streakMeta = useMemo(() => !activity || !streakDays ? null : ({ current: activity.currentStreak, longest: activity.longestStreak, days: streakDays }), [activity, streakDays]);
  const selectedLabel = selectedGoal?.title || t("progress.all_goals");

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <View style={{ paddingHorizontal: 8, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, backgroundColor: appPalette.surface.background }}>
        <Text style={{ fontSize: 19, fontWeight: "500", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", lineHeight: 29 }}>{t("progress.title")}</Text>
        <Pressable onPress={() => setPickerOpen(true)} style={{ minWidth: 180, maxWidth: 220, borderRadius: 8, borderWidth: 1, borderColor: appPalette.semantic.borderSubtle, backgroundColor: appPalette.surface.background, paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}><Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat", flex: 1 }} numberOfLines={1}>{selectedLabel}</Text><ChevronDown size={16} color={appPalette.semantic.textMuted} /></Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
        {selectedGoal && selectedGoal.goalType === "TASK" && activity && <NativePeriodCalendar goal={selectedGoal} activity={activity} loading={loadingActivity} />}
        <View style={{ gap: 8 }}>{selectedGoal && <StatCard title={t("progress.goal_xp")} value={xp} description={t("progress.goal_xp_description")} icon={<Zap size={20} color={appPalette.semantic.textMuted} />} />}{!selectedGoal && <StatCard title={t("progress.completed_goals")} value={completedGoals} description={t("progress.completed_goals_description", { count: filteredGoals.length })} icon={<Target size={20} color={appPalette.semantic.textMuted} />} />}{!selectedGoal && <StatCard title={t("progress.rewards_received")} value={unlockedRewards} description={t("progress.rewards_received_description", { count: rewards.length })} icon={<Trophy size={20} color={appPalette.semantic.textMuted} />} />}</View>

        {selectedGoal && selectedGoal.goalType === "TASK" && streakMeta && <SurfaceCard gap={16} padding={16} radius={12}><View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat" }}>Серия выполнений</Text><Flame size={20} color={appPalette.semantic.warningStrong} /></View><View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}><View style={{ flex: 1 }}><View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}><Text style={{ color: appPalette.semantic.textStrong, fontSize: 30, fontWeight: "500", lineHeight: 36, fontFamily: "Montserrat" }}>{streakMeta.current}</Text><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.streak.day", { count: streakMeta.current })}</Text></View><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.streak.current")}</Text></View><View style={{ flex: 1, alignItems: "flex-end" }}><View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}><Text style={{ color: appPalette.semantic.textMuted, fontSize: 24, fontWeight: "500", lineHeight: 30, fontFamily: "Montserrat" }}>{streakMeta.longest}</Text><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.streak.day", { count: streakMeta.longest })}</Text></View><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.streak.record")}</Text></View></View><View style={{ gap: 8 }}><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>Последние 7 дней</Text><View style={{ flexDirection: "row", gap: 8 }}>{streakMeta.days.map((day, index) => <View key={index} style={{ flex: 1, alignItems: "center", gap: 6 }}><View style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: day ? appPalette.semantic.warningStrong : appPalette.semantic.borderSubtle }}>{day ? <Flame size={16} color={appPalette.brand.primaryForeground} /> : null}</View></View>)}</View></View></SurfaceCard>}

        {selectedGoal && selectedGoal.goalType === "TASK" && <SurfaceCard gap={12} padding={16} radius={12}><View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat" }}>{t("progress.xp_week")}</Text><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.xp_week_description")}</Text></View><ChartSpline size={20} color={appPalette.semantic.textMuted} /></View><WeeklyXpChart data={weeklyXpData} /></SurfaceCard>}

        {!selectedGoal && <SurfaceCard gap={12} padding={16} radius={12}><View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat" }}>{t("progress.tasks_by_category")}</Text><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.tasks_by_category_description")}</Text></View><ChartSpline size={20} color={appPalette.semantic.textMuted} /></View>{categoryData.length === 0 ? <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.categories_empty")}</Text> : <View style={{ gap: 10 }}>{categoryData.map((item) => <View key={item.name} style={{ gap: 6 }}><View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: appPalette.semantic.text, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat", flex: 1 }}>{item.name}</Text><Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{item.value}</Text></View><View style={{ height: 10, backgroundColor: appPalette.semantic.borderSubtle, borderRadius: 999, overflow: "hidden" }}><View style={{ width: `${Math.max(8, Math.min(100, item.value * 10))}%`, height: "100%", backgroundColor: appPalette.brand.primary }} /></View></View>)}</View>}</SurfaceCard>}
      </ScrollView>

      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable onPress={() => setPickerOpen(false)} style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "center", padding: 20 }}>
          <Pressable onPress={() => {}} style={{ backgroundColor: appPalette.surface.background, borderRadius: 16, padding: 16, gap: 8 }}>
            <Text style={{ color: appPalette.semantic.textStrong, fontSize: 16, fontWeight: "500", lineHeight: 24, fontFamily: "Montserrat" }}>{t("progress.filter_label")}</Text>
            <ScrollView style={{ maxHeight: 320 }} contentContainerStyle={{ gap: 8 }}>
              <Pressable onPress={() => { setGoalId(null); setPickerOpen(false); }} style={{ borderWidth: 1, borderColor: goalId === null ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle, backgroundColor: goalId === null ? appPalette.semantic.infoSurface : appPalette.surface.background, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}><Text style={{ color: goalId === null ? appPalette.semantic.infoText : appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.all_goals")}</Text></Pressable>
              {goals.map((goal) => { const active = goal.id === goalId; return <Pressable key={goal.id} onPress={() => { setGoalId(goal.id); setPickerOpen(false); }} style={{ borderWidth: 1, borderColor: active ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle, backgroundColor: active ? appPalette.semantic.infoSurface : appPalette.surface.background, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}><Text style={{ color: active ? appPalette.semantic.infoText : appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{goal.title}</Text></Pressable>; })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
