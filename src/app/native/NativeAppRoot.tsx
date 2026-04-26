import { Text, View } from "react-native";

import { useAppBootstrap } from "@/app/useAppBootstrap";
import { ActionChip } from "@/components/native/ActionChip";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useAppStore } from "@/stores/useAppStore";
import NativeAppShell from "@/views/native/AppShell";
import NativeAuthRoot from "@/views/native/auth/NativeAuthRoot";

function NativeLoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 24, justifyContent: "center" }}>
      <SurfaceCard>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a" }}>Запускаем приложение</Text>
        <Text style={{ color: "#64748b" }}>
          Общий bootstrap уже работает и для web, и для будущего Expo/RN entrypoint.
        </Text>
      </SurfaceCard>
    </View>
  );
}

function NativeAuthScreen() {
  const { logout } = useAppStore();

  return (
    <View style={{ flex: 1 }}>
      <NativeAuthRoot />
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <ActionChip onPress={logout}>Сбросить локальную сессию</ActionChip>
      </View>
    </View>
  );
}

export default function NativeAppRoot() {
  const { initialized, user } = useAppBootstrap();

  if (!initialized) {
    return <NativeLoadingScreen />;
  }

  if (!user) {
    return <NativeAuthScreen />;
  }

  return <NativeAppShell />;
}
