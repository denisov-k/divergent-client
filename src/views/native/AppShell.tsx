import { Linking, Pressable, SafeAreaView, Text, View } from "react-native";
import { useEffect, useState } from "react";

import { parseNativeAppRoute, type NativeAppTab, type NativeMoreTab } from "@/app/router.native";
import NativeChallengesScreen from "@/views/native/challenges";
import NativeGoalsScreen from "@/views/native/goals";
import NativeMoreScreen from "@/views/native/more";
import NativeProgressScreen from "@/views/native/progress";
import NativeRemindersScreen from "@/views/native/reminders";
import NativeRewardsScreen from "@/views/native/rewards";

const tabs: Array<{ key: NativeAppTab; label: string }> = [
  { key: "goals", label: "Цели" },
  { key: "reminders", label: "Ритм" },
  { key: "challenges", label: "Челл." },
  { key: "rewards", label: "Награды" },
  { key: "progress", label: "Прогресс" },
  { key: "more", label: "Еще" },
];

export default function NativeAppShell() {
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
  const [moreLinkState, setMoreLinkState] = useState<{ screen?: NativeMoreTab }>({});

  useEffect(() => {
    const clearTransientState = () => {
      setGoalLinkState({});
      setReminderLinkState({});
      setChallengeLinkState({});
      setRewardLinkState({});
      setProgressLinkState({});
      setMoreLinkState({});
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
        return;
      }

      if (state.tab === "more") {
        setMoreLinkState({
          screen: state.screen || "menu",
        });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e2e8f0" }}>
      <View style={{ flex: 1 }}>
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
        {activeTab === "more" && (
          <NativeMoreScreen
            activeScreen={moreLinkState.screen}
            onConsumeLinkState={() => {
              setMoreLinkState({});
            }}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: "#cbd5e1",
          backgroundColor: "#ffffff",
          paddingHorizontal: 8,
          paddingVertical: 10,
          gap: 8,
        }}
      >
        {tabs.map((tab) => {
          const active = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                borderRadius: 12,
                paddingVertical: 10,
                backgroundColor: active ? "#dbeafe" : "#f8fafc",
                alignItems: "center",
              }}
            >
              <Text style={{ color: active ? "#1d4ed8" : "#475569", fontWeight: "600", fontSize: 12 }}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
