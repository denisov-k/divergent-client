import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import type { ChallengeInput } from "@/types";
import { ActionChip } from "@/components/native/ActionChip";
import { FormSheetLayout } from "@/components/native/form-sheet/Layout";
import {
  ChallengeFieldsSection,
  ChallengeGoalsSection,
  ChallengeReportsSection,
  ChallengeVisibilitySection,
} from "@/components/native/challenge-form-sheet/Sections";
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
      current.includes(goalId) ? current.filter((item) => item !== goalId) : [...current, goalId],
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

  return (
    <FormSheetLayout
      open={open}
      onOpenChange={onOpenChange}
      title={challenge ? t("challenges.edit_title") : t("challenges.create_title")}
      subtitle={t("challenges.create_sheet_description")}
      footer={
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <ActionChip onPress={() => onOpenChange(false)}>{t("common.cancel")}</ActionChip>
          <ActionChip onPress={() => void handleSave()} tone="primary">
            {isSubmitting ? t("common.sending") : challenge ? t("common.save") : t("common.create")}
          </ActionChip>
        </View>
      }
    >
      <ChallengeFieldsSection
        title={title}
        description={description}
        rules={rules}
        link={link}
        price={price}
        startsAt={startsAt}
        endsAt={endsAt}
        onChangeTitle={setTitle}
        onChangeDescription={setDescription}
        onChangeRules={setRules}
        onChangeLink={setLink}
        onChangePrice={setPrice}
        onChangeStartsAt={setStartsAt}
        onChangeEndsAt={setEndsAt}
      />
      <ChallengeVisibilitySection isPublic={isPublic} onChange={setIsPublic} />
      <ChallengeReportsSection requiresReport={requiresReport} onChange={setRequiresReport} />
      <ChallengeGoalsSection goals={goals} selectedGoalIds={selectedGoalIds} onToggleGoal={toggleGoalSelection} />
    </FormSheetLayout>
  );
}
