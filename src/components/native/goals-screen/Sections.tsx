import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { HapticPressable as Pressable } from "@/components/native/HapticPressable";
import { NativeGoalCardView } from "@/components/native/NativeGoalCardView";
import { Plus, Sparkles } from "@/components/native/icons";
import { SectionTabs } from "@/components/native/SectionTabs";
import { AppLoader } from "@/components/shared/AppLoader";
import { appPalette } from "@/theme/palette";
import type { CategoryOption, Goal, Reward } from "@/types";

export function GoalsScreenHeader({
  categories,
  showCategories,
  selectedCategory,
  onCategoryChange,
  onCreate,
  onOpenAi,
}: {
  categories: CategoryOption[];
  showCategories: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onCreate: () => void;
  onOpenAi: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 8,
        gap: 10,
        backgroundColor: appPalette.surface.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
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

      {showCategories && (
        <SectionTabs
          tabs={[
            { key: "all", label: t("goals.all_categories") },
            ...categories.map((category) => ({ key: category.value, label: category.label })),
          ]}
          activeTab={selectedCategory}
          onChange={onCategoryChange}
        />
      )}
    </View>
  );
}

export function GoalsScreenContent({
  loading,
  goals,
  rewards,
  categories,
  hasGoals,
  selectedCategoryLabel,
  userTimeZone,
  focusedGoalId,
  onCreate,
  onEdit,
  onTaskToggle,
  onAddReminder,
  onAddProgress,
  onGoToProgress,
}: {
  loading: boolean;
  goals: Goal[];
  rewards: Reward[];
  categories: CategoryOption[];
  hasGoals: boolean;
  selectedCategoryLabel: string;
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
  const scrollRef = useRef<ScrollView | null>(null);
  const [itemOffsets, setItemOffsets] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!focusedGoalId) {
      return;
    }

    const y = itemOffsets[focusedGoalId];
    if (typeof y !== "number") {
      return;
    }

    scrollRef.current?.scrollTo({ y: Math.max(y - 12, 0), animated: true });
  }, [focusedGoalId, itemOffsets]);

  const showInitialLoading = loading && goals.length === 0;

  if (showInitialLoading) {
    return (
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        <AppLoader fullScreen />
      </View>
    );
  }

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
      {goals.length === 0 ? (
        <View
          style={{
            backgroundColor: appPalette.surface.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: appPalette.semantic.borderSubtle,
            paddingHorizontal: 24,
            paddingVertical: 48,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: appPalette.semantic.textMuted,
              marginBottom: 16,
              fontFamily: "Montserrat",
              fontSize: 12,
              lineHeight: 18,
              textAlign: "center",
            }}
          >
            {hasGoals ? t("goals.empty_filtered_title", { category: selectedCategoryLabel }) : t("goals.empty_title")}
          </Text>
          <Pressable
            onPress={onCreate}
            style={{
              minHeight: 36,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
              backgroundColor: appPalette.brand.primaryStrong,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: appPalette.brand.primaryForeground,
                fontFamily: "Montserrat",
                fontSize: 12,
                fontWeight: "500",
                lineHeight: 18,
              }}
            >
              {t("common.create_first_goal")}
            </Text>
          </Pressable>
        </View>
      ) : (
        goals.map((goal) => {
          const reward = rewards.find((item) => item.goalId === goal.id) || null;
          const categoryLabel =
            categories.find((item) => item.value === goal.category)?.label ?? goal.category;

          return (
            <View
              key={goal.id}
              onLayout={(event) => {
                const { y } = event.nativeEvent.layout;
                setItemOffsets((current) => (current[goal.id] === y ? current : { ...current, [goal.id]: y }));
              }}
            >
              <NativeGoalCardView
                goal={goal}
                categoryLabel={categoryLabel}
                reward={reward}
                userTimeZone={userTimeZone}
                autoExpand={goal.id === focusedGoalId}
                focused={goal.id === focusedGoalId}
                onEdit={onEdit}
                onTaskToggle={onTaskToggle}
                onAddReminder={onAddReminder}
                onAddProgress={onAddProgress}
                onGoToProgress={onGoToProgress}
              />
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
