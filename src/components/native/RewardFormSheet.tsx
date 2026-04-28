import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { FormSheetLayout } from "@/components/native/form-sheet/Layout";
import { RewardGoalSection, RewardIconSection } from "@/components/native/reward-form-sheet/Sections";
import type { Goal, Reward, RewardIcon } from "@/types";

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
    <FormSheetLayout
      open={open}
      onOpenChange={onOpenChange}
      title={reward ? t("rewards.dialog.edit_title") : t("rewards.dialog.create_title")}
      subtitle={t("rewards.dialog.description")}
      footer={
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {reward && (
            <ActionChip onPress={() => void onDelete(reward.id)} tone="danger">
              {t("common.delete")}
            </ActionChip>
          )}
          <ActionChip onPress={() => onOpenChange(false)}>{t("common.cancel")}</ActionChip>
          <ActionChip onPress={() => void handleSave()} tone="primary">
            {isSubmitting ? t("common.sending") : reward ? t("common.save") : t("rewards.dialog.create_submit")}
          </ActionChip>
        </View>
      }
    >
      <FieldInput label={t("rewards.dialog.title_label")} value={title} onChangeText={setTitle} placeholder={t("rewards.dialog.title_placeholder")} />
      <FieldInput label={t("rewards.dialog.description_label")} value={description} onChangeText={setDescription} placeholder={t("rewards.dialog.description_placeholder")} />
      <FieldInput label={t("rewards.dialog.xp_label")} value={xpRequires} onChangeText={setXpRequires} placeholder="100" />
      <RewardIconSection icon={icon} onChange={setIcon} />
      <RewardGoalSection goals={goals} goalId={goalId} onChange={setGoalId} />
    </FormSheetLayout>
  );
}
