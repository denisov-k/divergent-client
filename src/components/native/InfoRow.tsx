import { Text, View } from "react-native";

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
      <Text style={{ color: "#64748b" }}>{label}</Text>
      <Text style={{ color: "#0f172a", fontWeight: "600", flexShrink: 1, textAlign: "right" }}>
        {value}
      </Text>
    </View>
  );
}
