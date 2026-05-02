import { View, Text } from "react-native";

import { appPalette } from "@/theme/palette";

export function WeeklyXpChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          height: 176,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 8,
          borderBottomWidth: 1,
          borderBottomColor: appPalette.semantic.borderStrong,
          paddingTop: 16,
          paddingBottom: 12,
        }}
      >
        {data.map((item) => (
          <View key={item.name} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
            <Text style={{ color: appPalette.semantic.textMuted, fontSize: 10, fontWeight: "400", lineHeight: 14, fontFamily: "Montserrat" }}>{item.value}</Text>
            <View
              style={{
                width: "100%",
                maxWidth: 28,
                height: `${Math.max(6, (item.value / maxValue) * 100)}%`,
                minHeight: 6,
                borderRadius: 999,
                backgroundColor: appPalette.brand.primary,
              }}
            />
            <Text style={{ color: appPalette.semantic.text, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
