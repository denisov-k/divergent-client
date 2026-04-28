import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import { NativeRewardIcon } from "@/components/native/NativeRewardIcon";
import type { Goal, Reward, RewardIcon } from "@/types";

const iconOptions: RewardIcon[] = ["trophy", "star", "gift", "crown", "award", "zap"];

export function RewardFormSheet({
  open,
  reward,
  goals,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean;
  reward?: Reward;
  goals: Goal[];
  onOpenChange: (open: boolean) => void;
  onSave: (reward: Reward) => Promise<unknown> | unknown;
  onDelete: (id: string) => Promise<unknown> | unknown;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xpRequires, setXpRequires] = useState("");
  const [icon, setIcon] = useState<RewardIcon>("trophy");
  const [goalId, setGoalId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (reward) {
      setTitle(reward.title || "");
      setDescription(reward.description || "");
      setXpRequires(reward.xpRequires ? String(reward.xpRequires) : "");
      setIcon(reward.icon || "trophy");
      setGoalId(reward.goalId || "");
      return;
    }

    setTitle("");
    setDescription("");
    setXpRequires("");
    setIcon("trophy");
    setGoalId("");
  }, [open, reward]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        id: reward?.id || Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        icon,
        goalId: goalId || undefined,
        xpRequires: xpRequires ? Number(xpRequires) : undefined,
        isUnlocked: reward?.isUnlocked || false,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <View style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.35)", justifyContent: "flex-end" }}>
        <View
          style={{
            maxHeight: "90%",
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 14,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a" }}>
              {reward ? "Редактировать награду" : "Создать новую награду"}
            </Text>
            <Text style={{ color: "#64748b" }}>
              Создайте награду, которую можно получить за достижение определенного опыта
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ gap: 14 }}>
            <FieldInput label="Название награды *" value={title} onChangeText={setTitle} placeholder="Например: Мастер привычек" />
            <FieldInput label="Описание *" value={description} onChangeText={setDescription} placeholder="За что даётся награда..." />
            <FieldInput label="Требуется XP *" value={xpRequires} onChangeText={setXpRequires} placeholder="100" />

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Иконка</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {iconOptions.map((option) => (
                  <ActionChip key={option} onPress={() => setIcon(option)} tone={icon === option ? "primary" : "secondary"}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <NativeRewardIcon icon={option} />
                      <Text style={{ color: icon === option ? "#ffffff" : "#334155", fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{option}</Text>
                    </View>
                  </ActionChip>
                ))}
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Цель</Text>
              <SectionTabs
                tabs={[{ key: "none", label: "Без цели" }, ...goals.map((goal) => ({ key: goal.id, label: goal.title }))]}
                activeTab={goalId || "none"}
                onChange={(tab) => setGoalId(tab === "none" ? "" : tab)}
              />
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {reward && (
              <ActionChip onPress={() => void onDelete(reward.id)} tone="danger">
                {t("common.delete")}
              </ActionChip>
            )}
            <ActionChip onPress={() => onOpenChange(false)}>{t("common.cancel")}</ActionChip>
            <ActionChip onPress={() => void handleSave()} tone="primary">
              {isSubmitting ? t("common.sending") : reward ? t("common.save") : "Создать награду"}
            </ActionChip>
          </View>
        </View>
      </View>
    </Modal>
  );
}
