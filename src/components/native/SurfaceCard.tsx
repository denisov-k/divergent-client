import type { ReactNode } from "react";
import { View } from "react-native";

export function SurfaceCard({
  children,
  gap = 12,
}: {
  children: ReactNode;
  gap?: number;
}) {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        gap,
      }}
    >
      {children}
    </View>
  );
}
