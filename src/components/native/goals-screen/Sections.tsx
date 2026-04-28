import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { NativeGoalCardView } from "@/components/native/NativeGoalCardView";
import { Plus, Sparkles } from "@/components/native/Icons";
import { appPalette } from "@/theme/palette";
import type { CategoryOption, Goal, Reward } from "@/types";

export function GoalsScreenHeader({
  onCreate,
  onOpenAi,
}: {
  onCreate: () => void;
  onOpenAi: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        backgroundColor: appPalette.surface.background,
      }}
    >
      <Text
        style={{
          fontSize: 19,
          fontWeight: "500",
          color: appPalette.semantic.textStrong,
          fontFamily: "Montserrat",
          lineHeight: 29,
        }}
      >
        {t("goals.title")}
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={onCreate}
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
          <Text
            style={{
              color: appPalette.semantic.infoText,
              fontSize: 12,
              fontWeight: "500",
              lineHeight: 18,
              fontFamily: "Montserrat",
            }}
          >
            {t("goals.create_goal")}
          </Text>
        </Pressable>
        <Pressable
          onPress={onOpenAi}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: appPalette.brand.ai,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Sparkles size={16} color={appPalette.brand.primaryForeground} />
          <Text
            style={{
              color: appPalette.brand.primaryForeground,
              fontSize: 12,
              fontWeight: "500",
              lineHeight: 18,
              fontFamily: "Montserrat",
            }}
          >
            {t("goals.open_ai")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function GoalsScreenContent({
  goals,
  rewards,
  categories,
  userTimeZone,
  focusedGoalId,
  onCreate,
  onEdit,
  onTaskToggle,
  onAddReminder,
  onAddProgress,
  onGoToProgress,
}: {
  goals: Goal[];
  rewards: Reward[];
  categories: CategoryOption[];
  userTimeZone: string;
  focusedGoalId?: string | null;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onTaskToggle: (goalId: string, taskId: string) => Promise<void>;
  onAddReminder: (id: string) => void;
  onAddProgress: (goalId: string, delta: number) => Promise<void>;
  onGoToProgress: (id: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
      {goals.length === 0 ? (
        <EmptyStateCard
          title={t("goals.empty_title")}
          description={t("goals.empty_description")}
          actionLabel={t("common.create_first_goal")}
          onAction={onCreate}
        />
      ) : (
        goals.map((goal) => {
          const reward = rewards.find((item) => item.goalId === goal.id) || null;
          const categoryLabel =
            categories.find((item) => item.value === goal.category)?.label ?? goal.category;

          return (
            <NativeGoalCardView
              key={goal.id}
              goal={goal}
              categoryLabel={categoryLabel}
              reward={reward}
              userTimeZone={userTimeZone}
              autoExpand={goal.id === focusedGoalId}
              onEdit={onEdit}
              onTaskToggle={onTaskToggle}
              onAddReminder={onAddReminder}
              onAddProgress={onAddProgress}
              onGoToProgress={onGoToProgress}
            />
          );
        })
      )}
    </ScrollView>
  );
}
