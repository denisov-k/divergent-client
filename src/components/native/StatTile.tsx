import { Text, View } from "react-native";

export function StatTile({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: string;
  tone?: "slate" | "blue" | "emerald";
}) {
  const palette =
    tone === "blue"
      ? { backgroundColor: "#dbeafe", valueColor: "#1d4ed8" }
      : tone === "emerald"
        ? { backgroundColor: "#dcfce7", valueColor: "#166534" }
        : { backgroundColor: "#f8fafc", valueColor: "#0f172a" };

  return (
    <View
      style={{
        flex: 1,
        minWidth: 140,
        backgroundColor: palette.backgroundColor,
        borderRadius: 16,
        padding: 16,
        gap: 6,
      }}
    >
      <Text style={{ color: "#64748b", fontSize: 13 }}>{label}</Text>
      <Text style={{ color: palette.valueColor, fontSize: 24, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}
