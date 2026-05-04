import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ChartSpline, ChevronDown, Flame } from "@/components/native/Icons";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";
import type { Goal } from "@/types";

import { WeeklyXpChart } from "./WeeklyXpChart";

export function ProgressHeader({
  title,
  selectedLabel,
  onOpenPicker,
}: {
  title: string;
  selectedLabel: string;
  onOpenPicker: () => void;
}) {
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, backgroundColor: appPalette.surface.background }}>
      <Text style={{ fontSize: 19, fontWeight: "500", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", lineHeight: 29 }}>{title}</Text>
      <Pressable
        onPress={onOpenPicker}
        style={{
          minWidth: 180,
          maxWidth: 220,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: appPalette.semantic.borderSubtle,
          backgroundColor: appPalette.surface.background,
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <Text style={{ color: appPalette.semantic.textStrong, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat", flex: 1 }} numberOfLines={1}>
          {selectedLabel}
        </Text>
        <ChevronDown size={16} color={appPalette.semantic.textMuted} />
      </Pressable>
    </View>
  );
}

export function ProgressStreakSection({
  current,
  longest,
  days,
}: {
  current: number;
  longest: number;
  days: boolean[];
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard gap={16} padding={16} radius={12}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat" }}>{t("progress.streaks_title")}</Text>
        <Flame size={20} color={appPalette.semantic.warningStrong} />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
            <Text style={{ color: appPalette.semantic.textStrong, fontSize: 30, fontWeight: "500", lineHeight: 36, fontFamily: "Montserrat" }}>{current}</Text>
            <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.streak.day_one", { count: current })}</Text>
          </View>
          <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.streak.current")}</Text>
        </View>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
            <Text style={{ color: appPalette.semantic.textMuted, fontSize: 24, fontWeight: "500", lineHeight: 30, fontFamily: "Montserrat" }}>{longest}</Text>
            <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.streak.day_one", { count: longest })}</Text>
          </View>
          <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.streak.record")}</Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.last_7_days")}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {days.map((day, index) => (
            <View key={index} style={{ flex: 1, alignItems: "center", gap: 6 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: day ? appPalette.semantic.warningStrong : appPalette.semantic.borderSubtle }}>
                {day ? <Flame size={16} color={appPalette.brand.primaryForeground} /> : null}
              </View>
            </View>
          ))}
        </View>
      </View>
    </SurfaceCard>
  );
}

export function ProgressWeeklyXpSection({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard gap={12} padding={16} radius={12}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat" }}>{t("progress.xp_week")}</Text>
          <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.xp_week_description")}</Text>
        </View>
        <ChartSpline size={20} color={appPalette.semantic.textMuted} />
      </View>
      <WeeklyXpChart data={data} />
    </SurfaceCard>
  );
}

export function ProgressCategoriesSection({
  categoryData,
}: {
  categoryData: { name: string; value: number }[];
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard gap={12} padding={16} radius={12}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat" }}>{t("progress.tasks_by_category")}</Text>
          <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.tasks_by_category_description")}</Text>
        </View>
        <ChartSpline size={20} color={appPalette.semantic.textMuted} />
      </View>

      {categoryData.length === 0 ? (
        <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.categories_empty")}</Text>
      ) : (
        <View style={{ gap: 10 }}>
          {categoryData.map((item) => (
            <View key={item.name} style={{ gap: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: appPalette.semantic.text, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat", flex: 1 }}>{item.name}</Text>
                <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{item.value}</Text>
              </View>
              <View style={{ height: 10, backgroundColor: appPalette.semantic.borderSubtle, borderRadius: 999, overflow: "hidden" }}>
                <View style={{ width: `${Math.max(8, Math.min(100, item.value * 10))}%`, height: "100%", backgroundColor: appPalette.brand.primary }} />
              </View>
            </View>
          ))}
        </View>
      )}
    </SurfaceCard>
  );
}

export function ProgressGoalPickerModal({
  open,
  goals,
  goalId,
  onClose,
  onSelectGoal,
}: {
  open: boolean;
  goals: Goal[];
  goalId: string | null;
  onClose: () => void;
  onSelectGoal: (goalId: string | null) => void;
}) {
  const { t } = useTranslation();

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "center", padding: 20 }}>
        <Pressable onPress={() => {}} style={{ backgroundColor: appPalette.surface.background, borderRadius: 16, padding: 16, gap: 8 }}>
          <Text style={{ color: appPalette.semantic.textStrong, fontSize: 16, fontWeight: "500", lineHeight: 24, fontFamily: "Montserrat" }}>{t("progress.filter_label")}</Text>
          <ScrollView style={{ maxHeight: 320 }} contentContainerStyle={{ gap: 8 }}>
            <Pressable
              onPress={() => onSelectGoal(null)}
              style={{
                borderWidth: 1,
                borderColor: goalId === null ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
                backgroundColor: goalId === null ? appPalette.semantic.infoSurface : appPalette.surface.background,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: goalId === null ? appPalette.semantic.infoText : appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("progress.all_goals")}</Text>
            </Pressable>

            {goals.map((goal) => {
              const active = goal.id === goalId;

              return (
                <Pressable
                  key={goal.id}
                  onPress={() => onSelectGoal(goal.id)}
                  style={{
                    borderWidth: 1,
                    borderColor: active ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
                    backgroundColor: active ? appPalette.semantic.infoSurface : appPalette.surface.background,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: active ? appPalette.semantic.infoText : appPalette.semantic.textStrong, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{goal.title}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

