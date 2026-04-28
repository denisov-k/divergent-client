import { Text, View } from "react-native";

import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";

export function ProgressStatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
}) {
  return (
    <SurfaceCard gap={8} padding={16} radius={12}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat", flex: 1 }}>{title}</Text>
        {icon}
      </View>
      <View style={{ gap: 4 }}>
        <Text style={{ color: appPalette.semantic.textStrong, fontSize: 24, fontWeight: "500", lineHeight: 30, fontFamily: "Montserrat" }}>{value}</Text>
        {!!description && <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{description}</Text>}
      </View>
    </SurfaceCard>
  );
}
