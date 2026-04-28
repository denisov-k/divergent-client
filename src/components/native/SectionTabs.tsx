import { Pressable, Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

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
              backgroundColor: active ? appPalette.semantic.infoSurface : appPalette.surface.background,
              borderWidth: 1,
              borderColor: active ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: active ? appPalette.semantic.infoText : appPalette.semantic.text, fontWeight: "600", fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
