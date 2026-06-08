import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { buildRewardsPath } from "@/app/routes";
import { useNativeNavigation } from "@/app/native/NativeNavigation";
import { HapticPressable as Pressable } from "@/components/native/HapticPressable";
import { NativeRewardIcon } from "@/components/native/NativeRewardIcon";
import { CircleCheck, Target } from "@/components/native/icons";
import { appPalette } from "@/theme/palette";
import type { OnboardingStepKey, Reward } from "@/types";

import type { OnboardingChecklistState } from "@/shared/screens/onboarding/model";

type VisibleOnboardingStepKey = Exclude<OnboardingStepKey, "added_first_task">;
const STEP_XP = 100;

const STEP_META: Record<
  VisibleOnboardingStepKey,
  {
    titleKey: string;
    descriptionKey: string;
  }
> = {
  created_first_goal: {
    titleKey: "onboarding.steps.create_goal_title",
    descriptionKey: "onboarding.steps.create_goal_description",
  },
  used_ai: {
    titleKey: "onboarding.steps.use_ai_title",
    descriptionKey: "onboarding.steps.use_ai_description",
  },
  completed_first_task: {
    titleKey: "onboarding.steps.complete_task_title",
    descriptionKey: "onboarding.steps.complete_task_description",
  },
};

export function OnboardingCard({
  state,
  reward,
}: {
  state: OnboardingChecklistState;
  reward: Reward | null;
}) {
  const { t } = useTranslation();
  const { navigateToPath } = useNativeNavigation();

  if (state.isComplete) {
    return null;
  }

  return (
    <View
      style={{
        gap: 16,
        borderWidth: 1,
        borderColor: appPalette.semantic.borderSubtle,
        backgroundColor: appPalette.surface.card,
        borderRadius: 16,
        padding: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flex: 1, gap: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Target size={16} color={appPalette.semantic.successText} />
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                fontWeight: "600",
                color: appPalette.semantic.textStrong,
                fontFamily: "Montserrat",
              }}
            >
              {t("onboarding.title")}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              color: appPalette.semantic.textMuted,
              fontFamily: "Montserrat",
            }}
          >
            {t("onboarding.subtitle")}
          </Text>
        </View>
        <View
          style={{
            borderRadius: 999,
            backgroundColor: appPalette.semantic.successSurface,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              color: appPalette.semantic.successText,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "500",
              fontFamily: "Montserrat",
            }}
          >
            {t("onboarding.progress", { completed: state.completedCount, total: state.totalCount })}
          </Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        {state.steps.map((step) => {
          const meta = STEP_META[step.key as VisibleOnboardingStepKey];

          return (
            <View
              key={step.key}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: appPalette.semantic.borderSubtle,
                backgroundColor: appPalette.surface.background,
              }}
            >
              <View style={{ marginTop: 2 }}>
                {step.completed ? (
                  <CircleCheck size={16} color={appPalette.semantic.successText} />
                ) : (
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: appPalette.semantic.borderSubtle,
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <Text
                    style={{
                      flex: 1,
                      color: appPalette.semantic.textStrong,
                      fontSize: 13,
                      lineHeight: 19,
                      fontWeight: "500",
                      fontFamily: "Montserrat",
                    }}
                  >
                    {t(meta.titleKey)}
                  </Text>
                  <View
                    style={{
                      borderRadius: 999,
                      backgroundColor: appPalette.semantic.successSurface,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text
                      style={{
                        color: appPalette.semantic.successText,
                        fontSize: 11,
                        lineHeight: 16,
                        fontWeight: "600",
                        fontFamily: "Montserrat",
                      }}
                    >
                      +{STEP_XP} {t("common.xp")}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: appPalette.semantic.textMuted,
                    fontSize: 12,
                    lineHeight: 18,
                    fontFamily: "Montserrat",
                  }}
                >
                  {t(meta.descriptionKey)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {reward && (
        <Pressable
          onPress={() => navigateToPath(buildRewardsPath({ id: reward.id }))}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: appPalette.semantic.borderSubtle,
            backgroundColor: appPalette.surface.background,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <NativeRewardIcon icon={reward.icon} unlocked={reward.isUnlocked} size={32} iconSize={16} />
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Text
                style={{
                  color: appPalette.semantic.textStrong,
                  fontSize: 13,
                  lineHeight: 19,
                  fontWeight: "600",
                  fontFamily: "Montserrat",
                  flexShrink: 1,
                }}
                numberOfLines={1}
              >
                {reward.title}
              </Text>
              <View
                style={{
                  borderRadius: 999,
                  backgroundColor: reward.isUnlocked ? appPalette.semantic.successStrong : appPalette.semantic.neutralSurface,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                }}
              >
                <Text
                  style={{
                    color: reward.isUnlocked ? appPalette.semantic.textInverse : appPalette.semantic.neutralText,
                    fontSize: 11,
                    lineHeight: 16,
                    fontWeight: "600",
                    fontFamily: "Montserrat",
                  }}
                >
                  {reward.isUnlocked ? t("rewards.unlocked") : t("rewards.locked")}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: appPalette.semantic.textMuted,
                fontSize: 12,
                lineHeight: 18,
                fontFamily: "Montserrat",
              }}
              numberOfLines={2}
            >
              {reward.description}
            </Text>
          </View>
          <Text
            style={{
              color: appPalette.semantic.successText,
              fontSize: 18,
              lineHeight: 18,
              fontFamily: "Montserrat",
              paddingHorizontal: 2,
            }}
          >
            {'>'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
