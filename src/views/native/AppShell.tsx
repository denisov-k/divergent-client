import { Linking, Pressable, SafeAreaView, Text, View } from "react-native";
import { useEffect, useState } from "react";

import { parseNativeAppLink, type NativeAppTab } from "@/platform/nativeAppLinking";
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
  const [challengeLinkState, setChallengeLinkState] = useState<{
    focusId?: string | null;
    paymentId?: string | null;
  }>({});

  useEffect(() => {
    const applyLink = (url: string) => {
      const state = parseNativeAppLink(url);
      if (!state?.tab) {
        return;
      }

      setActiveTab(state.tab);
      if (state.tab === "challenges") {
        setChallengeLinkState({
          focusId: state.challenge?.focusId ?? null,
          paymentId: state.challenge?.paymentId ?? null,
        });
        return;
      }

      setChallengeLinkState({});
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
        {activeTab === "goals" && <NativeGoalsScreen />}
        {activeTab === "reminders" && <NativeRemindersScreen />}
        {activeTab === "challenges" && (
          <NativeChallengesScreen
            focusId={challengeLinkState.focusId}
            paymentId={challengeLinkState.paymentId}
            onConsumeLinkState={() => {
              setChallengeLinkState({});
            }}
          />
        )}
        {activeTab === "rewards" && <NativeRewardsScreen />}
        {activeTab === "progress" && <NativeProgressScreen />}
        {activeTab === "more" && <NativeMoreScreen />}
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
