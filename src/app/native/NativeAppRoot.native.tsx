import { useFonts } from "expo-font";
import { Text, View } from "react-native";

import { useAppBootstrap } from "@/app/useAppBootstrap";
import { ActionChip } from "@/components/native/ActionChip";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useAppStore } from "@/stores/useAppStore";
import { appPalette } from "@/theme/palette";
import NativeAppShell from "@/views/native/AppShell";
import NativeAuthRoot from "@/views/native/auth/NativeAuthRoot";

function NativeLoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background, padding: 24, justifyContent: "center" }}>
      <SurfaceCard>
        <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>Запускаем приложение</Text>
        <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
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
  const [fontsLoaded] = useFonts({
    Montserrat: require("@/assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });
  const { initialized, user } = useAppBootstrap();

  if (!fontsLoaded || !initialized) {
    return <NativeLoadingScreen />;
  }

  if (!user) {
    return <NativeAuthScreen />;
  }

  return <NativeAppShell />;
}
