import { Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function SectionTitle(props: { children: string }) {
  return (
    <Text
      style={{
        fontSize: 16,
        fontWeight: "600",
        color: appPalette.semantic.textStrong,
        fontFamily: "Montserrat",
      }}
    >
      {props.children}
    </Text>
  );
}

export function MessageBanner(props: { tone: "danger" | "success"; message: string }) {
  const backgroundColor = props.tone === "danger" ? appPalette.semantic.dangerSurface : appPalette.semantic.successSurface;
  const color = props.tone === "danger" ? appPalette.semantic.dangerText : appPalette.semantic.successText;

  return (
    <View style={{ backgroundColor, borderRadius: 12, padding: 12 }}>
      <Text style={{ color, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{props.message}</Text>
    </View>
  );
}
