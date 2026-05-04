import { Modal, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
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
        <View
          style={{
            backgroundColor: appPalette.surface.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 14,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>{t("challenges.payment_sheet_title")}</Text>
          <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{t("challenges.payment_sheet_description")}</Text>

          <View style={{ gap: 10 }}>
            <ActionChip onPress={() => void handleSelect("YOUKASSA")} tone="primary">
              {t("challenges.payment_sheet_submit")}
            </ActionChip>
            <ActionChip onPress={() => onOpenChange(false)}>{t("common.cancel")}</ActionChip>
          </View>
        </View>
      </View>
    </Modal>
  );
}
