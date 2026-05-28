import { useTranslation } from "react-i18next";
import { Animated, Modal, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { SheetDragHandle, useSheetDragToClose } from "@/components/native/form-sheet/SheetChrome";
import { appPalette } from "@/theme/palette";
import type { PaymentMethod } from "@/types";

export function SelectPaymentMethodSheet({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (method: PaymentMethod) => Promise<boolean>;
}) {
  const { t } = useTranslation();
  const { headerPanHandlers, sheetStyle } = useSheetDragToClose(open, () => onOpenChange(false));

  const handleSelect = async (method: PaymentMethod) => {
    await onSelect(method);
    onOpenChange(false);
  };

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={() => onOpenChange(false)}>
      <View
        style={{
          flex: 1,
          backgroundColor: appPalette.surface.overlay,
          justifyContent: "flex-end",
        }}
      >
        <Animated.View
          style={{
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
            <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>{t("challenges.payment_sheet_title")}</Text>
            <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{t("challenges.payment_sheet_description")}</Text>
          </View>

          <View style={{ gap: 10 }}>
            <ActionChip onPress={() => void handleSelect("YOUKASSA")} tone="primary">
              {t("challenges.payment_sheet_submit")}
            </ActionChip>
            <ActionChip onPress={() => onOpenChange(false)}>{t("common.cancel")}</ActionChip>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
