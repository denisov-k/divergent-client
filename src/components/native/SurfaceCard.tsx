import type { ReactNode } from "react";
import { View } from "react-native";

import { appPalette } from "@/theme/palette";

export function SurfaceCard({
  children,
  gap = 12,
  padding = 16,
  radius = 16,
}: {
  children: ReactNode;
  gap?: number;
  padding?: number;
  radius?: number;
}) {
  return (
    <View
      style={{
        backgroundColor: appPalette.surface.card,
        borderRadius: radius,
        padding,
        borderWidth: 1,
        borderColor: appPalette.semantic.borderSubtle,
        gap,
      }}
    >
      {children}
    </View>
  );
}
