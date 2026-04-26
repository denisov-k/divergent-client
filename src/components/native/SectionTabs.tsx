import { Pressable, Text, View } from "react-native";

export function SectionTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: Array<{ key: T; label: string }>;
  activeTab: T;
  onChange: (tab: T) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={{
              backgroundColor: active ? "#dbeafe" : "#ffffff",
              borderWidth: 1,
              borderColor: active ? "#93c5fd" : "#e2e8f0",
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: active ? "#1d4ed8" : "#334155", fontWeight: "600" }}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
