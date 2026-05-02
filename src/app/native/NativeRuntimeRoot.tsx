import { ActivityIndicator, View } from "react-native";

import { useAppBootstrap } from "@/app/useAppBootstrap";
import { appPalette } from "@/theme/palette";
import NativeAppShell from "@/views/native/AppShell";
import NativeAuthRoot from "@/views/native/auth/NativeAuthRoot";

type NativeRuntimeMode = "preview" | "standalone";

function NativeLoadingScreen({ mode }: { mode: NativeRuntimeMode }) {
  void mode;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appPalette.surface.background,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        gap: 16,
      }}
    >
      <ActivityIndicator size="large" color={appPalette.brand.primary} />
    </View>
  );
}

function NativeAuthScreen() {
  return <NativeAuthRoot />;
}

export function NativeRuntimeRoot({
  mode,
  ready = true,
}: {
  mode: NativeRuntimeMode;
  ready?: boolean;
}) {
  const { initialized, user } = useAppBootstrap();

  if (!ready || !initialized) {
    return <NativeLoadingScreen mode={mode} />;
  }

  if (!user) {
    return <NativeAuthScreen />;
  }

  return <NativeAppShell mode={mode} />;
}
