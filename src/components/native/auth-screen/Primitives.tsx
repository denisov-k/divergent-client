import { Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function ErrorBanner(props: { message?: string }) {
  if (!props.message) return null;

  return (
    <View style={{ backgroundColor: appPalette.semantic.dangerSurface, borderRadius: 12, padding: 12 }}>
      <Text style={{ color: appPalette.semantic.dangerText, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
        {props.message}
      </Text>
    </View>
  );
}

export function SuccessBanner(props: { message?: string }) {
  if (!props.message) return null;

  return (
    <View style={{ backgroundColor: appPalette.semantic.successSurface, borderRadius: 12, padding: 12 }}>
      <Text style={{ color: appPalette.semantic.successText, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
        {props.message}
      </Text>
    </View>
  );
}

export function CardTitle(props: { children: string }) {
  return (
    <Text style={{ fontSize: 18, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>
      {props.children}
    </Text>
  );
}
