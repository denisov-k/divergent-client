import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SectionTabs } from "@/components/native/SectionTabs";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import type { NativeMoreTab } from "@/app/router.native";
import { appPalette } from "@/theme/palette";
import NativeFrensScreen from "@/views/native/frens";
import NativeSettingsScreen from "@/views/native/settings";

export default function NativeMoreScreen(props: { activeScreen?: NativeMoreTab; onConsumeLinkState?: () => void; }) {
  const [activeTab, setActiveTab] = useState<NativeMoreTab>(props.activeScreen || "menu");
  useEffect(() => {
    if (!props.activeScreen) return;
    setActiveTab(props.activeScreen);
    props.onConsumeLinkState?.();
  }, [props.activeScreen, props.onConsumeLinkState]);

  if (activeTab === "frens") return <View style={{ flex: 1 }}><View style={{ paddingHorizontal: 16, paddingTop: 12 }}><ActionChip onPress={() => setActiveTab("menu")}>Назад</ActionChip></View><NativeFrensScreen /></View>;
  if (activeTab === "settings") return <View style={{ flex: 1 }}><View style={{ paddingHorizontal: 16, paddingTop: 12 }}><ActionChip onPress={() => setActiveTab("menu")}>Назад</ActionChip></View><NativeSettingsScreen /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.ui.inputBackground }}>
      <ScreenHeader title="Ещё" subtitle="Вторичные mobile-разделы поверх общего shared слоя." />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <SectionTabs tabs={[{ key: "menu", label: "Разделы" }, { key: "frens", label: "Друзья" }, { key: "settings", label: "Настройки" }]} activeTab={activeTab} onChange={setActiveTab} />
        <SurfaceCard>
          <Text style={{ fontSize: 16, fontWeight: "600", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>Дополнительные экраны</Text>
          <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>Здесь собраны разделы, которые не хочется тянуть в основной нижний таб-бар мобильного клиента.</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <ActionChip onPress={() => setActiveTab("frens")} tone="primary">Открыть друзей</ActionChip>
            <ActionChip onPress={() => setActiveTab("settings")}>Открыть настройки</ActionChip>
          </View>
        </SurfaceCard>
      </ScrollView>
    </View>
  );
}
