import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppBootstrap } from "@/app/useAppBootstrap";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";
import NativeAppShell from "@/views/native/AppShell";
import NativeAuthRoot from "@/views/native/auth/NativeAuthRoot";

type NativeRuntimeMode = "preview" | "standalone";

function NativeLoadingScreen({ mode }: { mode: NativeRuntimeMode }) {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background, padding: 24, justifyContent: "center" }}>
      <SurfaceCard>
        <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>
          {t("runtime.loading_title")}
        </Text>
        <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
          {mode === "preview"
            ? t("runtime.preview_description")
            : t("runtime.standalone_description")}
        </Text>
      </SurfaceCard>
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
