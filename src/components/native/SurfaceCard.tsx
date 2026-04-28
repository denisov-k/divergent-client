import type { ReactNode } from "react";
import { View } from "react-native";

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
        backgroundColor: "#ffffff",
        borderRadius: radius,
        padding,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        gap,
      }}
    >
      {children}
    </View>
  );
}
