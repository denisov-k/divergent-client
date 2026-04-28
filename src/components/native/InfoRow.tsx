import { Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
      <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{label}</Text>
      <Text style={{ color: appPalette.semantic.textStrong, fontWeight: "600", flexShrink: 1, textAlign: "right", fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
        {value}
      </Text>
    </View>
  );
}
