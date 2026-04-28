import { useEffect, useState } from "react";
import { Alert, Modal, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { appPalette } from "@/theme/palette";
import type { FriendInput } from "@/types";

export function FriendFormSheet({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (friend: FriendInput) => Promise<unknown>;
}) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("1");
  const [currentXp, setCurrentXp] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName("");
    setLevel("1");
    setCurrentXp("0");
    setIsSubmitting(false);
  }, [open]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("Нужно имя", "Укажи имя друга.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        name: trimmedName,
        level: Math.max(1, Number(level) || 1),
        currentXp: Math.max(0, Number(currentXp) || 0),
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
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
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>Добавить друга</Text>
            <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>Теперь friends flow в mobile уже не read-only.</Text>
          </View>

          <FieldInput label="Имя" value={name} onChangeText={setName} placeholder="Например, Алина" />
          <FieldInput label="Уровень" value={level} onChangeText={setLevel} placeholder="1" />
          <FieldInput label="XP" value={currentXp} onChangeText={setCurrentXp} placeholder="0" />

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <ActionChip onPress={() => onOpenChange(false)}>Отмена</ActionChip>
            <ActionChip onPress={() => void handleSave()} tone="primary">
              {isSubmitting ? "Создаём..." : "Добавить"}
            </ActionChip>
          </View>
        </View>
      </View>
    </Modal>
  );
}
