import { Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { NativeRewardIcon } from "@/components/native/NativeRewardIcon";
import { SectionTabs } from "@/components/native/SectionTabs";
import { formSectionLabelStyle } from "@/components/native/form-sheet/Layout";
import { appPalette } from "@/theme/palette";
import type { Goal, RewardIcon } from "@/types";

export const iconOptions: RewardIcon[] = ["trophy", "star", "gift", "crown", "award", "zap"];

export function RewardIconSection(props: { icon: RewardIcon; onChange: (value: RewardIcon) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Иконка</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {iconOptions.map((option) => (
          <ActionChip key={option} onPress={() => props.onChange(option)} tone={props.icon === option ? "primary" : "secondary"}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <NativeRewardIcon icon={option} />
              <Text
                style={{
                  color: props.icon === option ? appPalette.semantic.textInverse : appPalette.semantic.text,
                  fontSize: 12,
                  fontWeight: "500",
                  lineHeight: 18,
                  fontFamily: "Montserrat",
                }}
              >
                {option}
              </Text>
            </View>
          </ActionChip>
        ))}
      </View>
    </View>
  );
}

export function RewardGoalSection(props: { goals: Goal[]; goalId: string; onChange: (value: string) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>Цель</Text>
      <SectionTabs
        tabs={[{ key: "none", label: "Без цели" }, ...props.goals.map((goal) => ({ key: goal.id, label: goal.title }))]}
        activeTab={props.goalId || "none"}
        onChange={(tab) => props.onChange(tab === "none" ? "" : tab)}
      />
    </View>
  );
}
