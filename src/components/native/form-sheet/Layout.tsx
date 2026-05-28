import type { ReactNode } from "react";
import { Animated, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

import { SheetDragHandle, useSheetDragToClose } from "@/components/native/form-sheet/SheetChrome";

export function FormSheetLayout(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const { headerPanHandlers, sheetStyle } = useSheetDragToClose(props.open, () => props.onOpenChange(false));

  return (
    <Modal visible={props.open} transparent animationType="none" onRequestClose={() => props.onOpenChange(false)}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "flex-end" }}>
          <Animated.View
            style={{
              maxHeight: "90%",
              backgroundColor: appPalette.surface.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              gap: 14,
              ...sheetStyle,
            }}
          >
            <View {...headerPanHandlers} style={{ gap: 6 }}>
              <SheetDragHandle />
              <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>
                {props.title}
              </Text>
              <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
                {props.subtitle}
              </Text>
            </View>

            <ScrollView contentContainerStyle={{ gap: 14 }} keyboardShouldPersistTaps="handled">
              {props.children}
            </ScrollView>

            {props.footer}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
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
