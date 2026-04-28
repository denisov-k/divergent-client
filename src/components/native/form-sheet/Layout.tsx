import type { ReactNode } from "react";
import { Modal, ScrollView, Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function FormSheetLayout(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <Modal visible={props.open} transparent animationType="slide" onRequestClose={() => props.onOpenChange(false)}>
      <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "flex-end" }}>
        <View
          style={{
            maxHeight: "90%",
            backgroundColor: appPalette.surface.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 14,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>
              {props.title}
            </Text>
            <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
              {props.subtitle}
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ gap: 14 }}>{props.children}</ScrollView>

          {props.footer}
        </View>
      </View>
    </Modal>
  );
}

export const formSectionLabelStyle = {
  fontSize: 14,
  fontWeight: "600" as const,
  color: appPalette.semantic.text,
  fontFamily: "Montserrat",
};

export const formHelperStyle = {
  color: appPalette.semantic.textMuted,
  fontFamily: "Montserrat",
  fontSize: 12,
  lineHeight: 18,
};
