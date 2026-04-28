import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import type { ChallengeInput } from "@/types";
import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import { appPalette } from "@/theme/palette";
import type { Challenge, Goal } from "@/types";

export function ChallengeFormSheet({
  open,
  challenge,
  goals,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  challenge?: Challenge;
  goals: Goal[];
  onOpenChange: (open: boolean) => void;
  onSave: (data: ChallengeInput) => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [requiresReport, setRequiresReport] = useState(false);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (challenge) {
      setTitle(challenge.title);
      setDescription(challenge.description ?? "");
      setRules(challenge.rules ?? "");
      setLink(challenge.link ?? "");
      setPrice(challenge.price ? String(challenge.price) : "");
      setStartsAt(challenge.startsAt ?? "");
      setEndsAt(challenge.endsAt ?? "");
      setIsPublic(challenge.isPublic);
      setRequiresReport(challenge.requiresReport);
      setSelectedGoalIds(challenge.goalIds ?? challenge.goals.map((goal) => goal.id));
      return;
    }

    setTitle("");
    setDescription("");
    setRules("");
    setLink("");
    setPrice("");
    setStartsAt("");
    setEndsAt("");
    setIsPublic(true);
    setRequiresReport(false);
    setSelectedGoalIds([]);
  }, [open, challenge]);

  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoalIds((current) =>
      current.includes(goalId) ? current.filter((item) => item !== goalId) : [...current, goalId]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        id: challenge?.id ?? "",
        title: title.trim(),
        description: description.trim() || undefined,
        rules: rules.trim() || undefined,
        link: link.trim() || undefined,
        isPublic,
        reports: challenge?.reports ?? [],
        requiresReport,
        price: price ? Number(price) : undefined,
        startsAt: startsAt.trim() || undefined,
        endsAt: endsAt.trim() || undefined,
        goalIds: selectedGoalIds,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionLabelStyle = { fontSize: 14, fontWeight: "600" as const, color: appPalette.semantic.text, fontFamily: "Montserrat" };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "flex-end" }}>
        <View style={{ maxHeight: "90%", backgroundColor: appPalette.surface.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 14 }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>
              {challenge ? t("challenges.edit_title") : t("challenges.create_title")}
            </Text>
            <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{t("challenges.create_sheet_description")}</Text>
          </View>

          <ScrollView contentContainerStyle={{ gap: 14 }}>
            <FieldInput label={t("challenges.fields.title")} value={title} onChangeText={setTitle} placeholder={t("challenges.placeholders.title")} />
            <FieldInput label={t("challenges.fields.description")} value={description} onChangeText={setDescription} placeholder={t("challenges.placeholders.description")} />
            <FieldInput label={t("challenges.fields.rules")} value={rules} onChangeText={setRules} placeholder={t("challenges.placeholders.rules")} />
            <FieldInput label={t("challenges.fields.link")} value={link} onChangeText={setLink} placeholder={t("challenges.placeholders.link")} />
            <FieldInput label={t("challenges.fields.price")} value={price} onChangeText={setPrice} placeholder={t("challenges.placeholders.price")} />
            <FieldInput label={`${t("challenges.fields.start_date")} (YYYY-MM-DD)`} value={startsAt} onChangeText={setStartsAt} placeholder={t("challenges.placeholders.start_date")} />
            <FieldInput label={`${t("challenges.fields.end_date")} (YYYY-MM-DD)`} value={endsAt} onChangeText={setEndsAt} placeholder={t("challenges.placeholders.end_date")} />

            <View style={{ gap: 8 }}>
              <Text style={sectionLabelStyle}>{t("challenges.fields.visibility")}</Text>
              <SectionTabs tabs={[{ key: "public", label: t("challenges.visibility.public") }, { key: "private", label: t("challenges.visibility.private") }]} activeTab={isPublic ? "public" : "private"} onChange={(tab) => setIsPublic(tab === "public")} />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={sectionLabelStyle}>{t("challenges.fields.requiresReport")}</Text>
              <SectionTabs tabs={[{ key: "yes", label: t("common.yes") }, { key: "no", label: t("common.no") }]} activeTab={requiresReport ? "yes" : "no"} onChange={(tab) => setRequiresReport(tab === "yes")} />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={sectionLabelStyle}>{t("challenges.selection.goals")}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {goals.map((goal) => (
                  <ActionChip key={goal.id} onPress={() => toggleGoalSelection(goal.id)} tone={selectedGoalIds.includes(goal.id) ? "primary" : "secondary"}>
                    {goal.title}
                  </ActionChip>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <ActionChip onPress={() => onOpenChange(false)}>{t("common.cancel")}</ActionChip>
            <ActionChip onPress={() => void handleSave()} tone="primary">
              {isSubmitting ? t("common.sending") : challenge ? t("common.save") : t("common.create")}
            </ActionChip>
          </View>
        </View>
      </View>
    </Modal>
  );
}
