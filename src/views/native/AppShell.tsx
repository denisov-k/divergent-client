import { Suspense, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, SafeAreaView, Text, View } from "react-native";

import { parseNativeAppRoute, type NativeAppTab } from "@/app/router.native";
import { NativeAppHeader } from "@/components/native/NativeAppHeader";
import { BarChart2, Bell, Gift, Swords, Target } from "@/components/native/icons";
import { useAppStore } from "@/stores/useAppStore";
import { appPalette } from "@/theme/palette";

const NativeChallengesScreen = lazy(() => import("@/views/native/challenges"));
const NativeGoalsScreen = lazy(() => import("@/views/native/goals"));
const NativeProgressScreen = lazy(() => import("@/views/native/progress-view"));
const NativeRemindersScreen = lazy(() => import("@/views/native/reminders"));
const NativeRewardsScreen = lazy(() => import("@/views/native/rewards"));
const NativeSettingsScreen = lazy(() => import("@/views/native/settings"));

function NativeScreenFallback() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: appPalette.surface.background }}>
      <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
        Loading...
      </Text>
    </View>
  );
}

export default function NativeAppShell() {
  const { t } = useTranslation();
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<NativeAppTab>("goals");
  const [goalLinkState, setGoalLinkState] = useState<{ goalId?: string | null }>({});
  const [reminderLinkState, setReminderLinkState] = useState<{
    reminderId?: string | null;
    goalId?: string | null;
  }>({});
  const [challengeLinkState, setChallengeLinkState] = useState<{
    focusId?: string | null;
    paymentId?: string | null;
  }>({});
  const [rewardLinkState, setRewardLinkState] = useState<{ rewardId?: string | null }>({});
  const [progressLinkState, setProgressLinkState] = useState<{ goalId?: string | null }>({});

  const tabs: Array<{
    key: Exclude<NativeAppTab, "settings">;
    label: string;
    icon: typeof Target;
  }> = [
    { key: "goals", label: t("navigation.goals"), icon: Target },
    { key: "challenges", label: t("navigation.challenges"), icon: Swords },
    { key: "rewards", label: t("navigation.rewards"), icon: Gift },
    { key: "progress", label: t("navigation.progress"), icon: BarChart2 },
    { key: "reminders", label: t("navigation.reminders"), icon: Bell },
  ];

  useEffect(() => {
    const clearTransientState = () => {
      setGoalLinkState({});
      setReminderLinkState({});
      setChallengeLinkState({});
      setRewardLinkState({});
      setProgressLinkState({});
    };

    const applyLink = (url: string) => {
      const state = parseNativeAppRoute(url);
      if (!state?.tab) {
        return;
      }

      setActiveTab(state.tab);
      clearTransientState();

      if (state.tab === "goals") {
        setGoalLinkState({ goalId: state.goalId ?? null });
        return;
      }

      if (state.tab === "reminders") {
        setReminderLinkState({
          reminderId: state.reminderId ?? null,
          goalId: state.goalId ?? null,
        });
        return;
      }

      if (state.tab === "challenges") {
        setChallengeLinkState({
          focusId: state.focusId ?? null,
          paymentId: state.paymentId ?? null,
        });
        return;
      }

      if (state.tab === "rewards") {
        setRewardLinkState({ rewardId: state.rewardId ?? null });
        return;
      }

      if (state.tab === "progress") {
        setProgressLinkState({ goalId: state.goalId ?? null });
      }
    };

    void Linking.getInitialURL().then((url) => {
      if (url) {
        applyLink(url);
      }
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      applyLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      {!!user && <NativeAppHeader user={user} onOpenSettings={() => setActiveTab("settings")} />}

      <View style={{ flex: 1 }}>
        <Suspense fallback={<NativeScreenFallback />}>
          {activeTab === "goals" && (
            <NativeGoalsScreen
              goalId={goalLinkState.goalId}
              onConsumeLinkState={() => {
                setGoalLinkState({});
              }}
            />
          )}
          {activeTab === "reminders" && (
            <NativeRemindersScreen
              reminderId={reminderLinkState.reminderId}
              goalId={reminderLinkState.goalId}
              onConsumeLinkState={() => {
                setReminderLinkState({});
              }}
            />
          )}
          {activeTab === "challenges" && (
            <NativeChallengesScreen
              focusId={challengeLinkState.focusId}
              paymentId={challengeLinkState.paymentId}
              onConsumeLinkState={() => {
                setChallengeLinkState({});
              }}
            />
          )}
          {activeTab === "rewards" && (
            <NativeRewardsScreen
              rewardId={rewardLinkState.rewardId}
              onConsumeLinkState={() => {
                setRewardLinkState({});
              }}
            />
          )}
          {activeTab === "progress" && (
            <NativeProgressScreen
              goalId={progressLinkState.goalId}
              onConsumeLinkState={() => {
                setProgressLinkState({});
              }}
            />
          )}
          {activeTab === "settings" && <NativeSettingsScreen />}
        </Suspense>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: appPalette.surface.background,
          paddingHorizontal: 4,
          paddingVertical: 8,
        }}
      >
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          const Icon = tab.icon;

          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                minWidth: 0,
                marginHorizontal: 4,
                minHeight: 45,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: appPalette.brand.primary,
                paddingHorizontal: 8,
                paddingVertical: 4,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: active ? appPalette.brand.primary : appPalette.surface.background,
              }}
            >
              <Icon color={active ? appPalette.brand.primaryForeground : appPalette.brand.primary} size={17} strokeWidth={2.5} />
              <Text
                style={{
                  color: active ? appPalette.brand.primaryForeground : appPalette.brand.primary,
                  fontSize: 8,
                  fontWeight: "800",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 8,
                  marginTop: 2,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

