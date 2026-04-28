import { Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

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
      ? { backgroundColor: appPalette.semantic.infoSurface, valueColor: appPalette.semantic.infoText }
      : tone === "emerald"
        ? { backgroundColor: appPalette.semantic.successSurface, valueColor: appPalette.semantic.successText }
        : { backgroundColor: appPalette.surface.background, valueColor: appPalette.semantic.textStrong };

  return (
    <View
      style={{
        flex: 1,
        minWidth: 140,
        backgroundColor: palette.backgroundColor,
        borderRadius: 16,
        padding: 16,
        gap: 6,
        borderWidth: tone === "slate" ? 1 : 0,
        borderColor: appPalette.semantic.borderSubtle,
      }}
    >
      <Text style={{ color: appPalette.semantic.textMuted, fontSize: 13, fontFamily: "Montserrat" }}>{label}</Text>
      <Text style={{ color: palette.valueColor, fontSize: 24, fontWeight: "700", fontFamily: "Montserrat" }}>{value}</Text>
    </View>
  );
}
